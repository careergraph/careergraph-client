import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChatWindow from "~/features/messaging/components/ChatWindow";
import EmptyChat from "~/features/messaging/components/EmptyChat";
import InboxList from "~/features/messaging/components/InboxList";
import useThreads from "~/features/messaging/hooks/useThreads";
import "~/features/messaging/styles/messaging.css";

export function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryThreadId = searchParams.get("thread");

  const [selectedThreadId, setSelectedThreadId] = useState(queryThreadId);

  const { openThread, totalUnread } = useThreads({ autoLoad: true, archived: false });

  useEffect(() => {
    setSelectedThreadId(queryThreadId);
    openThread(queryThreadId);
  }, [openThread, queryThreadId]);

  const applyQueryThread = useCallback(
    (threadId) => {
      const nextParams = new URLSearchParams(searchParams);

      if (threadId) {
        nextParams.set("thread", threadId);
      } else {
        nextParams.delete("thread");
      }

      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const handleSelectThread = useCallback(
    (threadId) => {
      setSelectedThreadId(threadId);
      openThread(threadId);
      applyQueryThread(threadId);
    },
    [applyQueryThread, openThread]
  );

  const handleBackMobile = useCallback(() => {
    setSelectedThreadId(null);
    openThread(null);
    applyQueryThread(null);
  }, [applyQueryThread, openThread]);

  const sidebarVisibleClass = useMemo(
    () => (selectedThreadId ? "hidden md:flex" : "flex"),
    [selectedThreadId]
  );

  const chatVisibleClass = useMemo(
    () => (selectedThreadId ? "flex" : "hidden md:flex"),
    [selectedThreadId]
  );

  return (
    <div className="w-full px-3 pb-4 sm:px-6 lg:px-8">
      <div className="mb-3 mt-1">
        <h1 className="text-xl font-bold text-slate-900">Tin nhắn</h1>
        <p className="text-sm text-slate-500">Các cuộc trò chuyện của bạn với nhà tuyển dụng</p>
      </div>

      <div className="messaging-page-enter flex h-[calc(100dvh-11rem)] min-h-[30rem] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:h-[calc(100dvh-11.5rem)]">
        <div className={`${sidebarVisibleClass} w-full md:w-80 xl:w-96`}>
          <InboxList
            selectedThreadId={selectedThreadId}
            onSelectThread={handleSelectThread}
            totalUnread={totalUnread}
            className="w-full"
          />
        </div>

        <div className={`${chatVisibleClass} min-w-0 flex-1`}>
          {selectedThreadId ? (
            <ChatWindow threadId={selectedThreadId} onBackMobile={handleBackMobile} />
          ) : (
            <EmptyChat />
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
