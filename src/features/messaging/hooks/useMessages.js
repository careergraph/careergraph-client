import { useCallback, useMemo, useState } from "react";
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

const resolveErrorMessage = (error) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Không thể xử lý tin nhắn.";
};

export const useMessages = (threadId) => {
  const [messagesError, setMessagesError] = useState(null);
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

  const loadLatestMessages = useCallback(async () => {
    if (!threadId) {
      return;
    }

    setMessageMeta(threadId, { loading: true, loadingOlder: false });
    setMessagesError(null);

    try {
      const firstPage = await messagingApi.getMessages(threadId, 0, MESSAGE_PAGE_SIZE);

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
          : await messagingApi.getMessages(threadId, latestPageIndex, MESSAGE_PAGE_SIZE);

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
  }, [setMessageMeta, setMessagesForThread, threadId]);

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
      const page = await messagingApi.getMessages(threadId, nextOlderPage, MESSAGE_PAGE_SIZE);

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
  }, [prependMessagesForThread, setMessageMeta, threadId]);

  const sendMessage = useCallback(
    async (content, contentType = "TEXT") => {
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
          contentType
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
          targetMessage.contentType
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
