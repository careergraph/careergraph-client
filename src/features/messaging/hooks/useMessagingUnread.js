import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import messagingApi from "~/features/messaging/api/messagingApi";
import { getToken } from "~/utils/storage";

const NOTIFY_SOCKET_URL = import.meta.env.VITE_RTC_BASE_URL || "http://localhost:4000";
const POLL_INTERVAL_MS = 20000;

let sharedUnread = 0;
let notifySocket = null;
let attached = false;
let consumerCount = 0;
let sharedToken = null;
const listeners = new Set();
let refreshTimerId = null;
let refreshPromise = null;

const isRecord = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const broadcastUnread = (nextUnread) => {
  sharedUnread = Math.max(0, Number(nextUnread) || 0);
  listeners.forEach((listener) => listener(sharedUnread));
};

const refreshUnread = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = messagingApi
    .getUnreadCount()
    .then((count) => {
      broadcastUnread(count);
      return count;
    })
    .catch(() => sharedUnread)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

const scheduleRefresh = () => {
  if (refreshTimerId !== null) {
    window.clearTimeout(refreshTimerId);
  }

  refreshTimerId = window.setTimeout(() => {
    refreshTimerId = null;
    void refreshUnread();
  }, 180);
};

const attachNotifyListeners = () => {
  if (!notifySocket || attached) {
    return;
  }

  notifySocket.on("unread-counts", (payload) => {
    if (!isRecord(payload)) {
      scheduleRefresh();
      return;
    }

    if (typeof payload.messages === "number") {
      broadcastUnread(payload.messages);
      return;
    }

    scheduleRefresh();
  });

  notifySocket.on("notification", (payload) => {
    if (!isRecord(payload)) {
      scheduleRefresh();
      return;
    }

    if (payload.type === "NEW_MESSAGE") {
      scheduleRefresh();
      return;
    }

    scheduleRefresh();
  });

  notifySocket.on("connect", () => {
    void refreshUnread();
  });

  notifySocket.on("connect_error", () => {
    // Fallback polling still keeps badge updated.
  });

  attached = true;
};

const detachNotifyListeners = () => {
  if (!notifySocket) {
    return;
  }

  notifySocket.removeAllListeners("unread-counts");
  notifySocket.removeAllListeners("notification");
  notifySocket.removeAllListeners("connect");
  notifySocket.removeAllListeners("connect_error");
  attached = false;
};

const ensureNotifySocket = (token) => {
  if (notifySocket && sharedToken === token) {
    return notifySocket;
  }

  if (notifySocket) {
    detachNotifyListeners();
    notifySocket.disconnect();
  }

  notifySocket = io(`${NOTIFY_SOCKET_URL}/notify`, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  sharedToken = token;
  attached = false;

  return notifySocket;
};

export const useMessagingUnread = ({ autoStart = true } = {}) => {
  const [unreadCount, setUnreadCount] = useState(sharedUnread);

  const syncUnread = useCallback((count) => {
    setUnreadCount(Math.max(0, Number(count) || 0));
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

    let intervalId = null;

    void triggerRefresh();

    const token = getToken();
    if (token) {
      consumerCount += 1;
      ensureNotifySocket(token);
      attachNotifyListeners();
    }

    intervalId = window.setInterval(() => {
      void triggerRefresh();
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }

      if (refreshTimerId !== null) {
        window.clearTimeout(refreshTimerId);
        refreshTimerId = null;
      }

      if (token) {
        consumerCount = Math.max(0, consumerCount - 1);

        if (consumerCount === 0 && notifySocket) {
          detachNotifyListeners();
          notifySocket.disconnect();
          notifySocket = null;
          sharedToken = null;
        }
      }
    };
  }, [autoStart, triggerRefresh]);

  return {
    unreadCount,
    refreshUnread: triggerRefresh,
  };
};

export default useMessagingUnread;
