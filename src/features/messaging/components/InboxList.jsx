import { useMemo, useState } from "react";
import { MessageSquareMore, RefreshCw, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import EmptyInbox from "~/features/messaging/components/EmptyInbox";
import ThreadCard from "~/features/messaging/components/ThreadCard";
import useThreads from "~/features/messaging/hooks/useThreads";

function ThreadSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3">
      <div className="flex items-start gap-3">
        <div className="messaging-pulse h-11 w-11 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="messaging-pulse h-3 w-2/3 rounded bg-slate-200" />
          <div className="messaging-pulse h-2.5 w-1/2 rounded bg-slate-200" />
          <div className="messaging-pulse h-2.5 w-4/5 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

const normalize = (value) => (value || "").trim().toLowerCase();

const resolveDisplayName = (otherUser) => {
  if (!otherUser) {
    return "";
  }

  const fullName = `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim();
  if (fullName) {
    return fullName;
  }

  return otherUser.displayName || otherUser.email || "";
};

export function InboxList({
  selectedThreadId,
  onSelectThread,
  totalUnread,
  className = "",
}) {
  const [keyword, setKeyword] = useState("");

  const {
    threads,
    threadsLoading,
    threadsError,
    threadsHasMore,
    loadMoreThreads,
    refreshThreads,
  } = useThreads({ autoLoad: true, archived: false });

  const filteredThreads = useMemo(() => {
    const normalizedKeyword = normalize(keyword);

    if (!normalizedKeyword) {
      return threads;
    }

    return threads.filter((thread) => {
      const companyName = normalize(resolveDisplayName(thread.otherUser));
      const email = normalize(thread.otherUser?.email);
      const jobTitle = normalize(thread.application?.jobTitle);
      const preview = normalize(thread.lastMessagePreview);

      return (
        companyName.includes(normalizedKeyword) ||
        email.includes(normalizedKeyword) ||
        jobTitle.includes(normalizedKeyword) ||
        preview.includes(normalizedKeyword)
      );
    });
  }, [keyword, threads]);

  return (
    <aside
      className={`flex h-full min-h-0 flex-col border-r border-slate-200 bg-white/95 ${className}`}
    >
      <div className="border-b border-slate-200 px-3 py-3 sm:px-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900">Tin nhắn</h2>
              {totalUnread > 0 ? (
                <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              ) : null}
            </div>
            <p className="text-xs text-slate-500">
              {totalUnread > 0 ? `${totalUnread} tin chưa đọc` : "Không có tin nhắn chưa đọc"}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl px-3 text-xs"
            onClick={() => {
              void refreshThreads();
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Làm mới
          </Button>
        </div>

        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo công ty, vị trí..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto px-2 py-2 sm:px-3">
        {threadsLoading && threads.length === 0 ? (
          <div className="space-y-2 py-1">
            {Array.from({ length: 6 }).map((_, index) => (
              <ThreadSkeleton key={`thread-skeleton-${index}`} />
            ))}
          </div>
        ) : null}

        {!threadsLoading && threadsError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {threadsError}
          </div>
        ) : null}

        {!threadsLoading && !threadsError && filteredThreads.length === 0 ? (
          threads.length === 0 ? (
            <EmptyInbox />
          ) : (
            <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <MessageSquareMore className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Không có kết quả phù hợp</p>
              <p className="mt-1 text-xs text-slate-500">
                Thử từ khóa khác để tìm cuộc trò chuyện.
              </p>
            </div>
          )
        ) : null}

        <div className="space-y-1">
          {filteredThreads.map((thread) => (
            <ThreadCard
              key={thread.threadId}
              thread={thread}
              isSelected={selectedThreadId === thread.threadId}
              onClick={() => onSelectThread(thread.threadId)}
            />
          ))}
        </div>
      </div>

      {threadsHasMore ? (
        <div className="border-t border-slate-200 p-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl"
            disabled={threadsLoading}
            onClick={() => {
              void loadMoreThreads();
            }}
          >
            {threadsLoading ? "Đang tải..." : "Xem thêm hội thoại"}
          </Button>
        </div>
      ) : null}
    </aside>
  );
}

export default InboxList;
