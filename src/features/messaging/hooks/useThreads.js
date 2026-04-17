import { useCallback, useEffect, useRef } from "react";
import messagingApi from "~/features/messaging/api/messagingApi";
import { syncMessagingUnreadCount } from "~/features/messaging/hooks/useMessagingUnread";
import { useMessagingStore } from "~/features/messaging/store/messagingStore";

const THREAD_PAGE_SIZE = 20;

const resolveErrorMessage = (error) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Không thể tải danh sách hội thoại.";
};

export const useThreads = ({ autoLoad = true, archived = false } = {}) => {
  const hasInitializedRef = useRef(false);

  const threads = useMessagingStore((state) => state.threads);
  const threadsLoading = useMessagingStore((state) => state.threadsLoading);
  const threadsError = useMessagingStore((state) => state.threadsError);
  const threadsPage = useMessagingStore((state) => state.threadsPage);
  const threadsHasMore = useMessagingStore((state) => state.threadsHasMore);
  const selectedThreadId = useMessagingStore((state) => state.selectedThreadId);
  const totalUnread = useMessagingStore((state) => state.totalUnread);

  const setSelectedThreadId = useMessagingStore(
    (state) => state.setSelectedThreadId
  );
  const setThreadsLoading = useMessagingStore((state) => state.setThreadsLoading);
  const setThreadsError = useMessagingStore((state) => state.setThreadsError);
  const setThreadsPage = useMessagingStore((state) => state.setThreadsPage);
  const setThreadsHasMore = useMessagingStore((state) => state.setThreadsHasMore);
  const replaceThreads = useMessagingStore((state) => state.replaceThreads);
  const appendThreads = useMessagingStore((state) => state.appendThreads);
  const upsertThreadSummary = useMessagingStore(
    (state) => state.upsertThreadSummary
  );
  const setTotalUnread = useMessagingStore((state) => state.setTotalUnread);

  const fetchThreads = useCallback(
    async (options = {}) => {
      const reset = Boolean(options.reset);
      const page = reset ? 0 : threadsPage;

      if (!reset && (threadsLoading || !threadsHasMore)) {
        return;
      }

      setThreadsLoading(true);
      setThreadsError(null);

      try {
        const response = await messagingApi.getThreads(page, THREAD_PAGE_SIZE, archived);

        if (reset) {
          replaceThreads(response.content);
        } else {
          appendThreads(response.content);
        }

        setThreadsPage(page + 1);
        setThreadsHasMore(!response.last && page + 1 < response.totalPages);
      } catch (error) {
        setThreadsError(resolveErrorMessage(error));
      } finally {
        setThreadsLoading(false);
      }
    },
    [
      appendThreads,
      replaceThreads,
      setThreadsError,
      setThreadsHasMore,
      setThreadsLoading,
      setThreadsPage,
      threadsHasMore,
      threadsLoading,
      threadsPage,
      archived,
    ]
  );

  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await messagingApi.getUnreadCount();
      setTotalUnread(count);
    } catch {
      // Silent fallback: unread badge can be derived from thread list.
    }
  }, [setTotalUnread]);

  const refreshThreads = useCallback(async () => {
    await fetchThreads({ reset: true });
    await refreshUnreadCount();
  }, [fetchThreads, refreshUnreadCount]);

  const loadMoreThreads = useCallback(async () => {
    await fetchThreads({ reset: false });
  }, [fetchThreads]);

  const openThread = useCallback(
    (threadId) => {
      setSelectedThreadId(threadId);
      if (threadId) {
        useMessagingStore.getState().markThreadOpenedAsRead(threadId);
        syncMessagingUnreadCount(useMessagingStore.getState().totalUnread);
      }
    },
    [setSelectedThreadId]
  );

  const ensureThread = useCallback(
    async (params = {}) => {
      const thread = await messagingApi.getOrCreateThread(params);
      upsertThreadSummary(thread);
      return thread;
    },
    [upsertThreadSummary]
  );

  useEffect(() => {
    hasInitializedRef.current = false;
  }, [archived]);

  useEffect(() => {
    if (!autoLoad || hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;

    void refreshThreads();
  }, [autoLoad, refreshThreads]);

  return {
    threads,
    threadsLoading,
    threadsError,
    threadsHasMore,
    selectedThreadId,
    totalUnread,
    fetchThreads,
    refreshThreads,
    loadMoreThreads,
    refreshUnreadCount,
    openThread,
    ensureThread,
    archived,
  };
};

export default useThreads;
