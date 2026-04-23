import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import notificationApi from "~/features/notifications/api/notificationApi";
import {
  requestBrowserNotificationPermission,
  useNotifySocket,
} from "~/features/notifications/hooks/useNotifySocket";
import messagingApi from "~/features/messaging/api/messagingApi";
import { syncMessagingUnreadCount } from "~/features/messaging/hooks/useMessagingUnread";
import { useAuthStore } from "~/stores/authStore";
import { getToken } from "~/utils/storage";
import NotificationContext from "~/features/notifications/context/notificationContextInstance";

const PAGE_SIZE = 20;

const isRecord = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toStringSafe = (value, fallback = "") =>
  typeof value === "string" ? value : fallback;

const toBooleanSafe = (value, fallback = false) =>
  typeof value === "boolean" ? value : fallback;

const normalizeNotification = (payload) => {
  const source = isRecord(payload) ? payload : {};
  const read =
    typeof source.read === "boolean"
      ? source.read
      : toBooleanSafe(source.isRead);

  return {
    id: toStringSafe(source.id, `notification-${Date.now()}`),
    type: toStringSafe(source.type, "GENERAL"),
    title: toStringSafe(source.title, "Thông báo mới"),
    body: toStringSafe(source.body, "Bạn có một thông báo mới."),
    data: isRecord(source.data) ? source.data : undefined,
    createdAt: toStringSafe(source.createdAt, new Date().toISOString()),
    read,
  };
};

const sortByLatest = (notifications) => {
  return [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

const mergeNotifications = (current, incoming) => {
  const byId = new Map();

  for (const item of current) {
    byId.set(item.id, item);
  }

  for (const item of incoming) {
    byId.set(item.id, item);
  }

  return sortByLatest(Array.from(byId.values()));
};

const resolveErrorMessage = (error, fallback) => {
  const responseData = error?.response?.data;

  if (isRecord(responseData) && typeof responseData.message === "string") {
    return responseData.message;
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, authInitializing } = useAuthStore();
  const token = isAuthenticated ? getToken() : null;

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messageUnreadCount, setMessageUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const resetState = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    setMessageUnreadCount(0);
    setLoading(false);
    setError(null);
    setHasMore(true);
    setPage(0);
    setInitialized(false);
    syncMessagingUnreadCount(0);
  }, []);

  const refreshUnreadCounts = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      const [nextNotificationUnread, nextMessageUnread] = await Promise.all([
        notificationApi.getUnreadCount(),
        messagingApi.getUnreadCount(),
      ]);

      setUnreadCount(Math.max(0, nextNotificationUnread || 0));
      setMessageUnreadCount(Math.max(0, nextMessageUnread || 0));
      syncMessagingUnreadCount(nextMessageUnread || 0);
    } catch {
      // Keep local unread badges unchanged on transient errors.
    }
  }, [token]);

  const fetchNotifications = useCallback(
    async ({ reset = false } = {}) => {
      if (!token) {
        return;
      }

      const targetPage = reset ? 0 : page;

      if (!reset && (!hasMore || loading)) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await notificationApi.getNotifications(targetPage, PAGE_SIZE);

        setNotifications((prev) => {
          const next = reset
            ? response.notifications
            : mergeNotifications(prev, response.notifications);
          return sortByLatest(next);
        });

        setUnreadCount(Math.max(0, response.totalUnread || 0));
        setHasMore(Boolean(response.hasMore));
        setPage(targetPage + 1);
        setInitialized(true);
      } catch (reason) {
        setError(resolveErrorMessage(reason, "Không thể tải thông báo."));
      } finally {
        setLoading(false);
      }
    },
    [hasMore, loading, page, token]
  );

  const ensureLoaded = useCallback(async () => {
    const shouldLoadNotifications = !initialized || (unreadCount > 0 && notifications.length === 0);

    if (shouldLoadNotifications) {
      await fetchNotifications({ reset: true });
    }

    await refreshUnreadCounts();
  }, [fetchNotifications, initialized, notifications.length, refreshUnreadCounts, unreadCount]);

  const markAsRead = useCallback(
    async (notificationId) => {
      let wasUnread = false;

      setNotifications((prev) =>
        prev.map((item) => {
          if (item.id === notificationId && !item.read) {
            wasUnread = true;
            return {
              ...item,
              read: true,
            };
          }

          return item;
        })
      );

      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      try {
        await notificationApi.markAsRead(notificationId);
        await refreshUnreadCounts();
      } catch {
        // Optimistic UI is intentionally preserved for better UX.
      }
    },
    [refreshUnreadCounts]
  );

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);

    try {
      await notificationApi.markAllAsRead();
      await refreshUnreadCounts();
    } catch {
      // Optimistic UI is intentionally preserved for better UX.
    }
  }, [refreshUnreadCounts]);

  const handleIncomingNotification = useCallback((payload) => {
    const nextNotification = normalizeNotification(payload);

    setNotifications((prev) => mergeNotifications([nextNotification], prev));

    if (!nextNotification.read) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  const handleUnreadCounts = useCallback((payload) => {
    if (!isRecord(payload)) {
      return;
    }

    if (typeof payload.notifications === "number") {
      setUnreadCount(Math.max(0, payload.notifications));
    }

    if (typeof payload.messages === "number") {
      const nextMessageUnread = Math.max(0, payload.messages);
      setMessageUnreadCount(nextMessageUnread);
      syncMessagingUnreadCount(nextMessageUnread);
    }
  }, []);

  useNotifySocket({
    token,
    onNotification: handleIncomingNotification,
    onUnreadCounts: handleUnreadCounts,
    enableNativeNotification: true,
  });

  useEffect(() => {
    if (!token) {
      resetState();
      return;
    }

    void refreshUnreadCounts();
  }, [refreshUnreadCounts, resetState, token]);

  useEffect(() => {
    if (!token || loading) {
      return;
    }

    if (unreadCount > 0 && notifications.length === 0) {
      void fetchNotifications({ reset: true });
    }
  }, [fetchNotifications, loading, notifications.length, token, unreadCount]);

  useEffect(() => {
    if (authInitializing || !isAuthenticated || !token) {
      return;
    }

    void requestBrowserNotificationPermission();
  }, [authInitializing, isAuthenticated, token]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      messageUnreadCount,
      loading,
      error,
      hasMore,
      ensureLoaded,
      fetchNotifications,
      refreshUnreadCounts,
      markAsRead,
      markAllAsRead,
    }),
    [
      ensureLoaded,
      error,
      fetchNotifications,
      hasMore,
      loading,
      markAllAsRead,
      markAsRead,
      messageUnreadCount,
      notifications,
      refreshUnreadCounts,
      unreadCount,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
};

export default NotificationProvider;
