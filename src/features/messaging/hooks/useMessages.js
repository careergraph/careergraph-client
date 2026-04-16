import { useCallback, useEffect, useMemo, useState } from "react";
import messagingApi from "~/features/messaging/api/messagingApi";
import { useMessagingStore } from "~/features/messaging/store/messagingStore";
import { getMessagingIdentity } from "~/features/messaging/utils/identity";
import { useUserStore } from "~/stores/userStore";

const MESSAGE_PAGE_SIZE = 30;
const EMPTY_MESSAGES = [];
const DEFAULT_MESSAGE_META = {
  nextOlderPage: null,
  hasMore: false,
  loading: false,
  loadingOlder: false,
};

const isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);

const getResponseMessage = (error) => {
  const responseData = error?.response?.data;

  if (isObject(responseData)) {
    if (typeof responseData.message === "string" && responseData.message.trim()) {
      return responseData.message.trim();
    }

    if (typeof responseData.error === "string" && responseData.error.trim()) {
      return responseData.error.trim();
    }
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return "";
};

const isBlockedConversationError = (error) => {
  const status = error?.response?.status;
  const responseMessage = getResponseMessage(error).toLowerCase();

  return (
    status === 403 ||
    status === 500 ||
    responseMessage.includes("bị hr chặn") ||
    responseMessage.includes("blocked") ||
    responseMessage.includes("chặn")
  );
};

const resolveErrorMessage = (error) => {
  const status = error?.response?.status;
  const responseMessage = getResponseMessage(error);
  const normalizedMessage = responseMessage.toLowerCase();

  if (isBlockedConversationError(error)) {
    return "Bạn đã bị HR chặn nên không thể gửi tin nhắn trong cuộc trò chuyện này.";
  }

  if (status === 400) {
    return responseMessage || "Tin nhắn không hợp lệ.";
  }

  if (status === 401) {
    return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
  }

  if (status === 403) {
    return responseMessage || "Bạn không có quyền thực hiện thao tác này.";
  }

  if (status === 404) {
    return responseMessage || "Không tìm thấy cuộc trò chuyện hoặc tin nhắn.";
  }

  if (status === 429) {
    return "Bạn thao tác quá nhanh. Vui lòng thử lại sau vài giây.";
  }

  if (status >= 500) {
    if (normalizedMessage && !normalizedMessage.includes("request failed with status code")) {
      return responseMessage;
    }

    return "Hệ thống đang gặp sự cố tạm thời. Vui lòng thử lại sau.";
  }

  if (responseMessage && !normalizedMessage.includes("request failed with status code")) {
    return responseMessage;
  }

  return "Không thể xử lý tin nhắn. Vui lòng thử lại.";
};

export const useMessages = (threadId, activeJobFilterId = null) => {
  const [messagesError, setMessagesError] = useState(null);
  const [isBlockedByHR, setIsBlockedByHR] = useState(false);
  const authUser = useUserStore((state) => state.user);

  const messages = useMessagingStore(
    useCallback(
      (state) => (threadId ? state.messages[threadId] || EMPTY_MESSAGES : EMPTY_MESSAGES),
      [threadId]
    )
  );

  const messageMeta = useMessagingStore(
    useCallback(
      (state) =>
        threadId
          ? state.messageMeta[threadId] || DEFAULT_MESSAGE_META
          : DEFAULT_MESSAGE_META,
      [threadId]
    )
  );

  const setMessageMeta = useMessagingStore((state) => state.setMessageMeta);
  const setMessagesForThread = useMessagingStore(
    (state) => state.setMessagesForThread
  );
  const prependMessagesForThread = useMessagingStore(
    (state) => state.prependMessagesForThread
  );
  const addMessageToThread = useMessagingStore(
    (state) => state.addMessageToThread
  );
  const replaceMessageInThread = useMessagingStore(
    (state) => state.replaceMessageInThread
  );
  const markMessageFailed = useMessagingStore((state) => state.markMessageFailed);
  const markMessageSending = useMessagingStore(
    (state) => state.markMessageSending
  );
  const markThreadOpenedAsRead = useMessagingStore(
    (state) => state.markThreadOpenedAsRead
  );
  const applyMessageDeletedEvent = useMessagingStore(
    (state) => state.applyMessageDeletedEvent
  );

  const currentUser = useMemo(() => getMessagingIdentity(authUser), [authUser]);

  useEffect(() => {
    setIsBlockedByHR(false);
    setMessagesError(null);
  }, [threadId]);

  const loadLatestMessages = useCallback(async () => {
    if (!threadId) {
      return;
    }

    setMessageMeta(threadId, { loading: true, loadingOlder: false });
    setMessagesError(null);

    try {
      const firstPage = await messagingApi.getMessages(
        threadId,
        activeJobFilterId,
        0,
        MESSAGE_PAGE_SIZE
      );

      if (firstPage.totalElements === 0) {
        setMessagesForThread(threadId, []);
        setMessageMeta(threadId, {
          loading: false,
          hasMore: false,
          nextOlderPage: null,
          loadingOlder: false,
        });
        return;
      }

      const latestPageIndex = Math.max(0, firstPage.totalPages - 1);
      const latestPage =
        latestPageIndex === 0
          ? firstPage
          : await messagingApi.getMessages(
              threadId,
              activeJobFilterId,
              latestPageIndex,
              MESSAGE_PAGE_SIZE
            );

      setMessagesForThread(threadId, latestPage.content);
      setMessageMeta(threadId, {
        loading: false,
        loadingOlder: false,
        hasMore: latestPageIndex > 0,
        nextOlderPage: latestPageIndex > 0 ? latestPageIndex - 1 : null,
      });
    } catch (error) {
      setMessagesError(resolveErrorMessage(error));
      setMessageMeta(threadId, { loading: false, loadingOlder: false });
    }
  }, [activeJobFilterId, setMessageMeta, setMessagesForThread, threadId]);

  const loadOlderMessages = useCallback(async () => {
    if (!threadId) {
      return false;
    }

    const currentMeta = useMessagingStore.getState().messageMeta[threadId];
    const nextOlderPage = currentMeta?.nextOlderPage;

    if (typeof nextOlderPage !== "number") {
      return false;
    }

    setMessageMeta(threadId, { loadingOlder: true });

    try {
      const page = await messagingApi.getMessages(
        threadId,
        activeJobFilterId,
        nextOlderPage,
        MESSAGE_PAGE_SIZE
      );

      prependMessagesForThread(threadId, page.content);

      const updatedNextOlderPage = nextOlderPage > 0 ? nextOlderPage - 1 : null;

      setMessageMeta(threadId, {
        loadingOlder: false,
        hasMore: updatedNextOlderPage !== null,
        nextOlderPage: updatedNextOlderPage,
      });

      return true;
    } catch (error) {
      setMessagesError(resolveErrorMessage(error));
      setMessageMeta(threadId, { loadingOlder: false });
      return false;
    }
  }, [activeJobFilterId, prependMessagesForThread, setMessageMeta, threadId]);

  const sendMessage = useCallback(
    async (content, contentType = "TEXT", jobContextId = null) => {
      if (!threadId) {
        return { ok: false };
      }

      const normalizedContent = content.trim();
      if (!normalizedContent) {
        return { ok: false };
      }

      const tempMessageId = `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const tempMessage = {
        id: tempMessageId,
        threadId,
        sender: currentUser,
        content: normalizedContent,
        contentType,
        deleted: false,
        createdAt: new Date().toISOString(),
        isRead: false,
        localStatus: "sending",
      };

      addMessageToThread(threadId, tempMessage, { incoming: false });
      setMessagesError(null);

      try {
        const createdMessage = await messagingApi.sendMessage(
          threadId,
          normalizedContent,
          contentType,
          jobContextId
        );

        replaceMessageInThread(threadId, tempMessageId, {
          ...createdMessage,
          localStatus: "sent",
        });

        return {
          ok: true,
          message: createdMessage,
        };
      } catch (error) {
        if (isBlockedConversationError(error)) {
          setIsBlockedByHR(true);
        }

        markMessageFailed(threadId, tempMessageId);
        setMessagesError(resolveErrorMessage(error));
        return {
          ok: false,
          tempMessageId,
        };
      }
    },
    [
      addMessageToThread,
      currentUser,
      markMessageFailed,
      replaceMessageInThread,
      threadId,
    ]
  );

  const retryMessage = useCallback(
    async (messageId) => {
      if (!threadId) {
        return { ok: false };
      }

      const targetMessage = (useMessagingStore.getState().messages[threadId] || []).find(
        (message) => message.id === messageId
      );

      if (!targetMessage || targetMessage.localStatus !== "failed") {
        return { ok: false };
      }

      markMessageSending(threadId, messageId);
      setMessagesError(null);

      try {
        const createdMessage = await messagingApi.sendMessage(
          threadId,
          targetMessage.content,
          targetMessage.contentType,
          targetMessage.jobContext?.jobId || null
        );

        replaceMessageInThread(threadId, messageId, {
          ...createdMessage,
          localStatus: "sent",
        });

        return {
          ok: true,
          message: createdMessage,
        };
      } catch (error) {
        if (isBlockedConversationError(error)) {
          setIsBlockedByHR(true);
        }

        markMessageFailed(threadId, messageId);
        setMessagesError(resolveErrorMessage(error));
        return {
          ok: false,
          tempMessageId: messageId,
        };
      }
    },
    [markMessageFailed, markMessageSending, replaceMessageInThread, threadId]
  );

  const deleteSentMessage = useCallback(
    async (messageId) => {
      if (!threadId) {
        return false;
      }

      const previousMessages = useMessagingStore.getState().messages[threadId] || [];
      const target = previousMessages.find((message) => message.id === messageId);
      if (!target) {
        return false;
      }

      applyMessageDeletedEvent({
        threadId,
        messageId,
        deletedAt: new Date().toISOString(),
      });

      try {
        await messagingApi.unsendMessage(messageId);
        return true;
      } catch (error) {
        setMessagesForThread(threadId, previousMessages);
        setMessagesError(resolveErrorMessage(error));
        return false;
      }
    },
    [applyMessageDeletedEvent, setMessagesForThread, threadId]
  );

  const markThreadAsRead = useCallback(async () => {
    if (!threadId) {
      return;
    }

    markThreadOpenedAsRead(threadId);

    try {
      await messagingApi.markThreadAsRead(threadId);
    } catch {
      // Keep local unread state optimistic.
    }
  }, [markThreadOpenedAsRead, threadId]);

  return {
    currentUser,
    messages,
    messagesError,
    isBlockedByHR,
    isMessagesLoading: messageMeta.loading,
    isLoadingOlderMessages: messageMeta.loadingOlder,
    hasMoreMessages: messageMeta.hasMore,
    loadLatestMessages,
    loadOlderMessages,
    sendMessage,
    retryMessage,
    deleteSentMessage,
    markThreadAsRead,
  };
};

export default useMessages;
