import { useCallback, useEffect, useState } from "react";
import messagingApi from "~/features/messaging/api/messagingApi";
import { useMessagingStore } from "~/features/messaging/store/messagingStore";

const POLL_INTERVAL_MS = 20000;

let sharedUnread = 0;
const listeners = new Set();
let refreshPromise = null;

const normalizeUnread = (value) => Math.max(0, Number(value) || 0);

const notifyListeners = (nextUnread) => {
  listeners.forEach((listener) => listener(nextUnread));
};

const applyUnread = (nextUnread) => {
  const normalizedUnread = normalizeUnread(nextUnread);
  const previousUnread = sharedUnread;

  sharedUnread = normalizedUnread;
  useMessagingStore.getState().setTotalUnread(normalizedUnread);

  if (previousUnread !== normalizedUnread) {
    notifyListeners(normalizedUnread);
  }
};

export const syncMessagingUnreadCount = (nextUnread) => {
  applyUnread(nextUnread);
};

const refreshUnread = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = messagingApi
    .getUnreadCount()
    .then((count) => {
      applyUnread(count);
      return sharedUnread;
    })
    .catch(() => sharedUnread)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

export const useMessagingUnread = ({ autoStart = true } = {}) => {
  const [unreadCount, setUnreadCount] = useState(sharedUnread);

  const syncUnread = useCallback((count) => {
    setUnreadCount(normalizeUnread(count));
  }, []);

  const triggerRefresh = useCallback(async () => {
    return refreshUnread();
  }, []);

  useEffect(() => {
    listeners.add(syncUnread);
    syncUnread(sharedUnread);

    return () => {
      listeners.delete(syncUnread);
    };
  }, [syncUnread]);

  useEffect(() => {
    if (!autoStart) {
      return;
    }

    void triggerRefresh();

    const intervalId = window.setInterval(() => {
      void triggerRefresh();
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoStart, triggerRefresh]);

  return {
    unreadCount,
    refreshUnread: triggerRefresh,
  };
};

export default useMessagingUnread;
