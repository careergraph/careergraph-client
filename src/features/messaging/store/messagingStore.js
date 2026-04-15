import { create } from "zustand";

const buildThreadMeta = () => ({
  nextOlderPage: null,
  hasMore: false,
  loading: false,
  loadingOlder: false,
});

const sortThreadsByRecent = (threads) => {
  return [...threads].sort((a, b) => {
    if (!a.lastMessageAt && !b.lastMessageAt) return 0;
    if (!a.lastMessageAt) return 1;
    if (!b.lastMessageAt) return -1;

    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
  });
};

const upsertThread = (threads, nextThread) => {
  const existingIndex = threads.findIndex(
    (thread) => thread.threadId === nextThread.threadId
  );

  if (existingIndex === -1) {
    return sortThreadsByRecent([...threads, nextThread]);
  }

  const merged = threads.map((thread) =>
    thread.threadId === nextThread.threadId
      ? {
          ...thread,
          ...nextThread,
          otherUser: {
            ...thread.otherUser,
            ...(nextThread.otherUser || {}),
          },
          application: nextThread.application || thread.application,
        }
      : thread
  );

  return sortThreadsByRecent(merged);
};

const computeTotalUnread = (threads) =>
  threads.reduce((total, thread) => total + Math.max(0, thread.unreadCount || 0), 0);

const sortMessagesByCreatedAt = (messages) => {
  return [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
};

const mergeMessages = (current, incoming) => {
  const byId = new Map();

  for (const message of current) {
    byId.set(message.id, message);
  }

  for (const message of incoming) {
    byId.set(message.id, message);
  }

  return sortMessagesByCreatedAt(Array.from(byId.values()));
};

const initialState = {
  threads: [],
  threadsLoading: false,
  threadsError: null,
  threadsPage: 0,
  threadsHasMore: true,
  selectedThreadId: null,
  messages: {},
  messageMeta: {},
  typingUsers: {},
  onlineUsers: {},
  totalUnread: 0,
};

export const useMessagingStore = create((set, get) => ({
  ...initialState,

  setSelectedThreadId: (threadId) => set({ selectedThreadId: threadId }),

  resetMessaging: () => set({ ...initialState }),

  setThreadsLoading: (threadsLoading) => set({ threadsLoading }),

  setThreadsError: (threadsError) => set({ threadsError }),

  setThreadsPage: (threadsPage) => set({ threadsPage }),

  setThreadsHasMore: (threadsHasMore) => set({ threadsHasMore }),

  replaceThreads: (threads) => {
    const sorted = sortThreadsByRecent(threads || []);
    set({
      threads: sorted,
      totalUnread: computeTotalUnread(sorted),
    });
  },

  appendThreads: (threads) => {
    const current = get().threads;
    let merged = [...current];

    for (const thread of threads || []) {
      merged = upsertThread(merged, thread);
    }

    set({
      threads: merged,
      totalUnread: computeTotalUnread(merged),
    });
  },

  upsertThreadSummary: (thread) => {
    const merged = upsertThread(get().threads, thread);
    set({
      threads: merged,
      totalUnread: computeTotalUnread(merged),
    });
  },

  patchThreadSummary: (threadId, patch) => {
    const updated = get().threads.map((thread) =>
      thread.threadId === threadId
        ? {
            ...thread,
            ...patch,
            otherUser: {
              ...thread.otherUser,
              ...(patch?.otherUser || {}),
            },
            application: patch?.application || thread.application,
          }
        : thread
    );

    const sorted = sortThreadsByRecent(updated);

    set({
      threads: sorted,
      totalUnread: computeTotalUnread(sorted),
    });
  },

  setTotalUnread: (totalUnread) => set({ totalUnread: Math.max(0, totalUnread || 0) }),

  recalculateTotalUnread: () => {
    set({ totalUnread: computeTotalUnread(get().threads) });
  },

  markThreadOpenedAsRead: (threadId) => {
    const updatedThreads = get().threads.map((thread) =>
      thread.threadId === threadId
        ? {
            ...thread,
            unreadCount: 0,
          }
        : thread
    );

    set({
      threads: updatedThreads,
      totalUnread: computeTotalUnread(updatedThreads),
    });
  },

  setMessageMeta: (threadId, patch) => {
    const currentMeta = get().messageMeta[threadId] || buildThreadMeta();

    set({
      messageMeta: {
        ...get().messageMeta,
        [threadId]: {
          ...currentMeta,
          ...(patch || {}),
        },
      },
    });
  },

  setMessagesForThread: (threadId, messages) => {
    set({
      messages: {
        ...get().messages,
        [threadId]: sortMessagesByCreatedAt(messages || []),
      },
    });
  },

  prependMessagesForThread: (threadId, messages) => {
    const current = get().messages[threadId] || [];

    set({
      messages: {
        ...get().messages,
        [threadId]: mergeMessages(messages || [], current),
      },
    });
  },

  addMessageToThread: (threadId, message, options = {}) => {
    const currentMessages = get().messages[threadId] || [];
    const alreadyExists = currentMessages.some((item) => item.id === message.id);

    if (alreadyExists) {
      return;
    }

    const mergedMessages = sortMessagesByCreatedAt([...currentMessages, message]);

    const shouldIncreaseUnread = options?.incoming && get().selectedThreadId !== threadId;

    const updatedThreads = sortThreadsByRecent(
      get().threads.map((thread) => {
        if (thread.threadId !== threadId) {
          return thread;
        }

        return {
          ...thread,
          lastMessagePreview: message.deleted
            ? "Tin nhắn đã được thu hồi"
            : message.content,
          lastMessageAt: message.createdAt,
          unreadCount: shouldIncreaseUnread
            ? (thread.unreadCount || 0) + 1
            : thread.unreadCount,
        };
      })
    );

    set({
      messages: {
        ...get().messages,
        [threadId]: mergedMessages,
      },
      threads: updatedThreads,
      totalUnread: computeTotalUnread(updatedThreads),
    });
  },

  replaceMessageInThread: (threadId, tempMessageId, message) => {
    const currentMessages = get().messages[threadId] || [];

    const replacedMessages = sortMessagesByCreatedAt(
      currentMessages.map((item) =>
        item.id === tempMessageId ? { ...message, localStatus: "sent" } : item
      )
    );

    const updatedThreads = sortThreadsByRecent(
      get().threads.map((thread) => {
        if (thread.threadId !== threadId) {
          return thread;
        }

        return {
          ...thread,
          lastMessagePreview: message.deleted
            ? "Tin nhắn đã được thu hồi"
            : message.content,
          lastMessageAt: message.createdAt,
        };
      })
    );

    set({
      messages: {
        ...get().messages,
        [threadId]: replacedMessages,
      },
      threads: updatedThreads,
      totalUnread: computeTotalUnread(updatedThreads),
    });
  },

  markMessageFailed: (threadId, messageId) => {
    const currentMessages = get().messages[threadId] || [];

    set({
      messages: {
        ...get().messages,
        [threadId]: currentMessages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                localStatus: "failed",
              }
            : message
        ),
      },
    });
  },

  markMessageSending: (threadId, messageId) => {
    const currentMessages = get().messages[threadId] || [];

    set({
      messages: {
        ...get().messages,
        [threadId]: currentMessages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                localStatus: "sending",
              }
            : message
        ),
      },
    });
  },

  applyMessageDeletedEvent: (event) => {
    const currentMessages = get().messages[event.threadId] || [];

    const updatedMessages = currentMessages.map((message) =>
      message.id === event.messageId
        ? {
            ...message,
            deleted: true,
            content: "Tin nhắn đã được thu hồi",
          }
        : message
    );

    const latestMessage = updatedMessages[updatedMessages.length - 1];

    const updatedThreads = get().threads.map((thread) =>
      thread.threadId === event.threadId
        ? {
            ...thread,
            lastMessagePreview:
              latestMessage && latestMessage.deleted
                ? "Tin nhắn đã được thu hồi"
                : latestMessage?.content || thread.lastMessagePreview,
          }
        : thread
    );

    set({
      messages: {
        ...get().messages,
        [event.threadId]: updatedMessages,
      },
      threads: updatedThreads,
    });
  },

  applyThreadReadEvent: (event, currentUserIdentity = {}) => {
    const currentMessages = get().messages[event.threadId] || [];

    if (currentMessages.length === 0) {
      return;
    }

    const { id: currentUserId = "", email: currentUserEmail = "" } = currentUserIdentity;

    const normalize = (value) => (value || "").trim().toLowerCase();
    const normalizedCurrentId = normalize(currentUserId);
    const normalizedCurrentEmail = normalize(currentUserEmail);

    const lastReadIndex = event.lastReadMessageId
      ? currentMessages.findIndex((message) => message.id === event.lastReadMessageId)
      : currentMessages.length - 1;

    const boundary = lastReadIndex >= 0 ? lastReadIndex : currentMessages.length - 1;

    const updatedMessages = currentMessages.map((message, index) => {
      if (index > boundary) {
        return message;
      }

      const messageSenderId = normalize(message.sender?.id);
      const messageSenderEmail = normalize(message.sender?.email);

      const isOwnById =
        normalizedCurrentId && messageSenderId && messageSenderId === normalizedCurrentId;
      const isOwnByEmail =
        normalizedCurrentEmail &&
        messageSenderEmail &&
        messageSenderEmail === normalizedCurrentEmail;

      if (!isOwnById && !isOwnByEmail) {
        return message;
      }

      return {
        ...message,
        isRead: true,
        readAt: event.readAt,
      };
    });

    set({
      messages: {
        ...get().messages,
        [event.threadId]: updatedMessages,
      },
    });
  },

  setUserOnline: (userId, isOnline) => {
    const updatedThreads = get().threads.map((thread) =>
      thread.otherUser.id === userId
        ? {
            ...thread,
            isOnline,
          }
        : thread
    );

    set({
      onlineUsers: {
        ...get().onlineUsers,
        [userId]: isOnline,
      },
      threads: updatedThreads,
    });
  },

  applyThreadOnlineUsers: (threadId, userIds) => {
    const onlineUsers = { ...get().onlineUsers };

    for (const userId of userIds || []) {
      onlineUsers[userId] = true;
    }

    const updatedThreads = get().threads.map((thread) => {
      if (thread.threadId !== threadId) {
        return thread;
      }

      return {
        ...thread,
        isOnline: (userIds || []).includes(thread.otherUser.id),
      };
    });

    set({
      onlineUsers,
      threads: updatedThreads,
    });
  },

  setTypingStatus: (typing, isTyping) => {
    const current = get().typingUsers[typing.threadId] || [];

    const exists = current.some((item) => item.userId === typing.userId);

    const next = isTyping
      ? exists
        ? current.map((item) =>
            item.userId === typing.userId ? { ...item, ...typing } : item
          )
        : [...current, typing]
      : current.filter((item) => item.userId !== typing.userId);

    set({
      typingUsers: {
        ...get().typingUsers,
        [typing.threadId]: next,
      },
    });
  },

  clearThreadTyping: (threadId) => {
    set((state) => {
      const current = state.typingUsers[threadId];
      if (!current || current.length === 0) {
        return state;
      }

      return {
        typingUsers: {
          ...state.typingUsers,
          [threadId]: [],
        },
      };
    });
  },
}));

export default useMessagingStore;
