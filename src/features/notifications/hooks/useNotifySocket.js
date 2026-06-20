import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const NOTIFY_SOCKET_URL = import.meta.env.VITE_RTC_BASE_URL || "http://localhost:4000";
const logNotifySocket = (...args) => {
  console.info("[notify socket][candidate]", ...args);
};

const canUseBrowserNotifications = () =>
  typeof window !== "undefined" && "Notification" in window;

const toDataNavigatePath = (payload) => {
  const navigateTo = payload?.data?.navigateTo;
  return typeof navigateTo === "string" && navigateTo.startsWith("/") ? navigateTo : null;
};

const appendRefreshParams = (rawPath) => {
  const [pathname, queryString = ""] = rawPath.split("?");
  const params = new URLSearchParams(queryString);
  params.set("refresh", "1");
  params.set("ts", String(Date.now()));
  const serialized = params.toString();
  return serialized ? `${pathname}?${serialized}` : pathname;
};

export const requestBrowserNotificationPermission = async () => {
  if (!canUseBrowserNotifications()) {
    return;
  }

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
};

export function useNotifySocket({
  token,
  onNotification,
  onUnreadCounts,
  enableNativeNotification = true,
  onConnect,
}) {
  const socketRef = useRef(null);
  const notificationHandlerRef = useRef(onNotification);
  const unreadCountsHandlerRef = useRef(onUnreadCounts);
  const connectHandlerRef = useRef(onConnect);

  useEffect(() => {
    notificationHandlerRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    unreadCountsHandlerRef.current = onUnreadCounts;
  }, [onUnreadCounts]);

  useEffect(() => {
    connectHandlerRef.current = onConnect;
  }, [onConnect]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = io(`${NOTIFY_SOCKET_URL}/notify`, {
      auth: { token },
      transports: ["websocket", "polling"],
      tryAllTransports: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: Infinity,
      timeout: 20000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      logNotifySocket("connected", { id: socket.id, url: `${NOTIFY_SOCKET_URL}/notify` });
      connectHandlerRef.current?.();
    });

    socket.on("disconnect", (reason) => {
      logNotifySocket("disconnected", { reason });
    });

    socket.on("connect_error", (error) => {
      console.error("[notify socket][candidate] connect_error", error.message);
    });

    socket.on("notification", (payload) => {
      logNotifySocket("notification", {
        id: payload?.id,
        type: payload?.type,
      });
      notificationHandlerRef.current(payload);

      if (
        enableNativeNotification &&
        canUseBrowserNotifications() &&
        Notification.permission === "granted"
      ) {
        const nativeNotification = new Notification(payload?.title || "Thông báo mới", {
          body: payload?.body || "Bạn có một thông báo mới.",
          icon: "/favicon.ico",
          tag: payload?.id || undefined,
        });

        nativeNotification.onclick = () => {
          window.focus();
          nativeNotification.close();
          const navigatePath = toDataNavigatePath(payload);
          if (navigatePath) {
            window.location.assign(appendRefreshParams(navigatePath));
          }
        };
      }
    });

    socket.on("unread-counts", (payload) => {
      logNotifySocket("unread-counts", payload);
      unreadCountsHandlerRef.current(payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enableNativeNotification, token]);
}

export default useNotifySocket;
