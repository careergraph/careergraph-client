import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const NOTIFY_SOCKET_URL = import.meta.env.VITE_RTC_BASE_URL || "http://localhost:4000";

const canUseBrowserNotifications = () =>
  typeof window !== "undefined" && "Notification" in window;

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
}) {
  const socketRef = useRef(null);
  const notificationHandlerRef = useRef(onNotification);
  const unreadCountsHandlerRef = useRef(onUnreadCounts);

  useEffect(() => {
    notificationHandlerRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    unreadCountsHandlerRef.current = onUnreadCounts;
  }, [onUnreadCounts]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = io(`${NOTIFY_SOCKET_URL}/notify`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("notification", (payload) => {
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
        };
      }
    });

    socket.on("unread-counts", (payload) => {
      unreadCountsHandlerRef.current(payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enableNativeNotification, token]);
}

export default useNotifySocket;
