import { useCallback, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useMessagingStore } from "~/features/messaging/store/messagingStore";
import { getMessagingIdentity } from "~/features/messaging/utils/identity";
import { useUserStore } from "~/stores/userStore";

const CHAT_SOCKET_URL = import.meta.env.VITE_RTC_BASE_URL || "http://localhost:4000";

let sharedSocket = null;
let sharedToken = null;
let activeConsumers = 0;
let listenersAttached = false;

const isRecord = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toStringSafe = (value, fallback = "") =>
  typeof value === "string" ? value : fallback;

const toBooleanSafe = (value, fallback = false) =>
  typeof value === "boolean" ? value : fallback;

const resolveTypingDisplayName = (payload, fallback) => {
  const source = isRecord(payload) ? payload : {};
  const displayName = toStringSafe(source.displayName).trim();
  if (displayName && !displayName.includes("@")) {
    return displayName;
  }

  const firstName = toStringSafe(source.firstName).trim();
  const lastName = toStringSafe(source.lastName).trim();
  const fullName = `${firstName} ${lastName}`.trim();
  if (fullName) {
    return fullName;
  }

  return fallback;
};

const splitDisplayName = (displayName) => {
  const normalized = displayName.trim();
  if (!normalized) {
    return { firstName: "", lastName: "" };
  }

  const parts = normalized.split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
};

const normalizeUser = (payload) => {
  const source = isRecord(payload) ? payload : {};
  const displayName = toStringSafe(source.displayName).trim();
  const nameParts = splitDisplayName(displayName);

  const firstName = toStringSafe(source.firstName, nameParts.firstName);
  const lastName = toStringSafe(source.lastName, nameParts.lastName);
  const normalizedDisplayName =
    displayName || `${firstName} ${lastName}`.trim() || toStringSafe(source.email) || "HR";

  return {
    id: toStringSafe(source.id, toStringSafe(source.userId, toStringSafe(source.senderId))),
    firstName,
    lastName,
    email: toStringSafe(source.email),
    avatarUrl: toStringSafe(source.avatarUrl, toStringSafe(source.avatar, toStringSafe(source.senderAvatar))) || undefined,
    displayName: normalizedDisplayName,
  };
};

const normalizeMessage = (payload, threadId) => {
  const source = isRecord(payload) ? payload : {};

  const senderPayload = isRecord(source.sender)
    ? source.sender
    : {
        senderId: source.senderId,
        senderName: source.senderName,
        senderAvatar: source.senderAvatar,
      };

  return {
    id: toStringSafe(source.id),
    threadId: toStringSafe(source.threadId, threadId),
    sender: normalizeUser(senderPayload),
    content: toStringSafe(source.content),
    contentType: toStringSafe(source.contentType, "TEXT"),
    fileUrl: toStringSafe(source.fileUrl) || undefined,
    fileName: toStringSafe(source.fileName) || undefined,
    fileSize:
      typeof source.fileSize === "number" && Number.isFinite(source.fileSize)
        ? source.fileSize
        : undefined,
    deleted: toBooleanSafe(source.deleted),
    createdAt: toStringSafe(source.createdAt, new Date().toISOString()),
    isRead: toBooleanSafe(source.isRead, toBooleanSafe(source.read)),
    readAt: toStringSafe(source.readAt) || undefined,
    localStatus: "sent",
  };
};

const resolveCurrentUserIdentity = () => {
  const state = useUserStore.getState();
  const identity = getMessagingIdentity(state.user);

  return {
    id: identity.id || "",
    email: identity.email || "",
  };
};

const attachSocketListeners = (currentUserIdentityRef) => {
  if (!sharedSocket || listenersAttached) {
    return;
  }

  const addMessageToThread = useMessagingStore.getState().addMessageToThread;
  const setTypingStatus = useMessagingStore.getState().setTypingStatus;
  const setUserOnline = useMessagingStore.getState().setUserOnline;
  const applyThreadReadEvent = useMessagingStore.getState().applyThreadReadEvent;
  const applyMessageDeletedEvent = useMessagingStore.getState().applyMessageDeletedEvent;
  const applyThreadOnlineUsers = useMessagingStore.getState().applyThreadOnlineUsers;
  const patchThreadSummary = useMessagingStore.getState().patchThreadSummary;

  sharedSocket.on("new-message", (payload) => {
    if (!isRecord(payload)) return;

    const threadId = toStringSafe(payload.threadId);
    if (!threadId) return;

    const message = normalizeMessage(payload.message, threadId);
    addMessageToThread(threadId, message, { incoming: true });
  });

  sharedSocket.on("typing-start", (payload) => {
    if (!isRecord(payload)) return;

    const threadId = toStringSafe(payload.threadId);
    const userId = toStringSafe(payload.userId);
    const displayName = resolveTypingDisplayName(payload, "Nhà tuyển dụng");

    if (!threadId || !userId || userId === currentUserIdentityRef.current.id) return;

    setTypingStatus(
      {
        threadId,
        userId,
        displayName,
      },
      true
    );
  });

  sharedSocket.on("typing-stop", (payload) => {
    if (!isRecord(payload)) return;

    const threadId = toStringSafe(payload.threadId);
    const userId = toStringSafe(payload.userId);

    if (!threadId || !userId || userId === currentUserIdentityRef.current.id) return;

    setTypingStatus(
      {
        threadId,
        userId,
        displayName: "",
      },
      false
    );
  });

  sharedSocket.on("user-online", (payload) => {
    if (!isRecord(payload)) return;

    const threadId = toStringSafe(payload.threadId);
    const userId = toStringSafe(payload.userId);
    if (!threadId || !userId || userId === currentUserIdentityRef.current.id) return;

    setUserOnline(userId, true);
    patchThreadSummary(threadId, { isOnline: true });
  });

  sharedSocket.on("user-offline", (payload) => {
    if (!isRecord(payload)) return;

    const threadId = toStringSafe(payload.threadId);
    const userId = toStringSafe(payload.userId);
    if (!threadId || !userId || userId === currentUserIdentityRef.current.id) return;

    setUserOnline(userId, false);
    patchThreadSummary(threadId, { isOnline: false });
  });

  sharedSocket.on("thread-online-users", (payload) => {
    if (!isRecord(payload)) return;

    const threadId = toStringSafe(payload.threadId);
    const onlineUsers = Array.isArray(payload.onlineUsers)
      ? payload.onlineUsers.filter((userId) => typeof userId === "string")
      : [];

    if (!threadId) return;

    applyThreadOnlineUsers(threadId, onlineUsers);

    const hasPeerOnline = onlineUsers.some(
      (userId) => userId !== currentUserIdentityRef.current.id
    );
    patchThreadSummary(threadId, { isOnline: hasPeerOnline });
  });

  sharedSocket.on("messages-read", (payload) => {
    if (!isRecord(payload)) return;

    const userId = toStringSafe(payload.userId);
    if (!userId || userId === currentUserIdentityRef.current.id) return;

    const event = {
      threadId: toStringSafe(payload.threadId),
      userId,
      lastReadMessageId: toStringSafe(payload.lastReadMessageId) || undefined,
      readAt: toStringSafe(payload.readAt, new Date().toISOString()),
    };

    if (!event.threadId) return;

    applyThreadReadEvent(event, currentUserIdentityRef.current);
  });

  sharedSocket.on("message-deleted", (payload) => {
    if (!isRecord(payload)) return;

    const threadId = toStringSafe(payload.threadId);
    const messageId = toStringSafe(payload.messageId);

    if (!threadId || !messageId) return;

    applyMessageDeletedEvent({
      threadId,
      messageId,
      deletedAt: toStringSafe(payload.deletedAt, new Date().toISOString()),
    });
  });

  listenersAttached = true;
};

const detachSocketListeners = () => {
  if (!sharedSocket) return;

  sharedSocket.removeAllListeners("new-message");
  sharedSocket.removeAllListeners("typing-start");
  sharedSocket.removeAllListeners("typing-stop");
  sharedSocket.removeAllListeners("user-online");
  sharedSocket.removeAllListeners("user-offline");
  sharedSocket.removeAllListeners("thread-online-users");
  sharedSocket.removeAllListeners("messages-read");
  sharedSocket.removeAllListeners("message-deleted");

  listenersAttached = false;
};

const ensureSocket = (token) => {
  if (sharedSocket && sharedToken === token) {
    return sharedSocket;
  }

  if (sharedSocket) {
    detachSocketListeners();
    sharedSocket.disconnect();
  }

  sharedSocket = io(`${CHAT_SOCKET_URL}/chat`, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  sharedToken = token;
  listenersAttached = false;

  return sharedSocket;
};

export const useChatSocket = (token) => {
  const currentUserIdentityRef = useRef(resolveCurrentUserIdentity());

  currentUserIdentityRef.current = resolveCurrentUserIdentity();

  useEffect(() => {
    if (!token) {
      return;
    }

    activeConsumers += 1;

    const socket = ensureSocket(token);
    attachSocketListeners(currentUserIdentityRef);

    const handleConnectError = (error) => {
      console.error("[chat socket] connect error:", error.message);
    };

    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect_error", handleConnectError);
      activeConsumers = Math.max(0, activeConsumers - 1);

      if (activeConsumers === 0 && sharedSocket) {
        detachSocketListeners();
        sharedSocket.disconnect();
        sharedSocket = null;
        sharedToken = null;
      }
    };
  }, [token]);

  const joinThread = useCallback((threadId) => {
    if (!threadId) return;
    sharedSocket?.emit("join-thread", threadId);
  }, []);

  const leaveThread = useCallback((threadId) => {
    if (!threadId) return;
    sharedSocket?.emit("leave-thread", threadId);
  }, []);

  const sendTypingStart = useCallback((threadId) => {
    if (!threadId) return;
    sharedSocket?.emit("typing-start", { threadId });
  }, []);

  const sendTypingStop = useCallback((threadId) => {
    if (!threadId) return;
    sharedSocket?.emit("typing-stop", { threadId });
  }, []);

  const broadcastNewMessage = useCallback((threadId, message) => {
    if (!threadId || !message) return;
    sharedSocket?.emit("new-message", { threadId, message });
  }, []);

  const broadcastRead = useCallback((threadId, lastReadMessageId) => {
    if (!threadId) return;
    sharedSocket?.emit("messages-read", { threadId, lastReadMessageId });
  }, []);

  const broadcastDeleted = useCallback((threadId, messageId) => {
    if (!threadId || !messageId) return;
    sharedSocket?.emit("message-deleted", { threadId, messageId });
  }, []);

  return {
    isConnected: Boolean(sharedSocket?.connected),
    joinThread,
    leaveThread,
    sendTypingStart,
    sendTypingStop,
    broadcastNewMessage,
    broadcastRead,
    broadcastDeleted,
  };
};

export default useChatSocket;
