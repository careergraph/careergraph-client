import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Circle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";
import MessageBubble from "~/features/messaging/components/MessageBubble";
import MessageInput from "~/features/messaging/components/MessageInput";
import TypingIndicator from "~/features/messaging/components/TypingIndicator";
import EmptyChat from "~/features/messaging/components/EmptyChat";
import useChatSocket from "~/features/messaging/hooks/useChatSocket";
import useMessages from "~/features/messaging/hooks/useMessages";
import { useMessagingStore } from "~/features/messaging/store/messagingStore";
import { cn } from "~/lib/utils";
import { getToken } from "~/utils/storage";

const FIVE_MINUTES = 5 * 60 * 1000;
const EMPTY_TYPING_USERS = [];

const STATUS_LABEL = {
  APPLIED: "Đã nộp đơn",
  SCREENING: "Đang sàng lọc",
  INTERVIEW: "Phỏng vấn",
  HR_CONTACTED: "Đã liên hệ HR",
  INTERVIEW_SCHEDULED: "Đã lên lịch phỏng vấn",
  INTERVIEW_COMPLETED: "Đã phỏng vấn",
  TRIAL: "Thử việc",
  OFFER_EXTENDED: "Đã gửi offer",
  OFFER_ACCEPTED: "Đã nhận offer",
  OFFER_DECLINED: "Đã từ chối offer",
  HIRED: "Đã tuyển",
  REJECTED: "Đã từ chối",
  WITHDRAWN: "Đã rút hồ sơ",
  SCHEDULED: "Đã hẹn lịch",
};

const normalize = (value) => (value || "").trim().toLowerCase();

const isOwnMessage = (message, currentUser) => {
  const senderId = normalize(message?.sender?.id);
  const currentUserId = normalize(currentUser?.id);

  if (senderId && currentUserId && senderId === currentUserId) {
    return true;
  }

  const senderEmail = normalize(message?.sender?.email);
  const currentUserEmail = normalize(currentUser?.email);

  return Boolean(senderEmail && currentUserEmail && senderEmail === currentUserEmail);
};

const toDisplayName = (otherUser) => {
  if (!otherUser) {
    return "Nhà tuyển dụng";
  }

  const fullName = `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim();
  if (fullName) {
    return fullName;
  }

  if (otherUser.displayName && otherUser.displayName.trim()) {
    return otherUser.displayName.trim();
  }

  if (otherUser.email) {
    const localPart = otherUser.email.split("@")[0]?.trim();
    if (localPart) {
      return localPart;
    }
  }

  if (otherUser.id) {
    return `HR-${otherUser.id.slice(0, 6)}`;
  }

  return "Nhà tuyển dụng";
};

const firstLetter = (value) => {
  const char = value.trim().charAt(0);
  return char ? char.toUpperCase() : "H";
};

const isNearBottom = (element) => {
  const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
  return distance < 120;
};

const isGroupedWithPrevious = (messages, index) => {
  if (index <= 0) {
    return false;
  }

  const current = messages[index];
  const previous = messages[index - 1];

  if (!current || !previous) {
    return false;
  }

  if (current.sender?.id !== previous.sender?.id) {
    return false;
  }

  const currentTime = new Date(current.createdAt).getTime();
  const previousTime = new Date(previous.createdAt).getTime();

  if (Number.isNaN(currentTime) || Number.isNaN(previousTime)) {
    return false;
  }

  return currentTime - previousTime <= FIVE_MINUTES;
};

export function ChatWindow({ threadId, onBackMobile }) {
  const viewportRef = useRef(null);
  const previousMessageCountRef = useRef(0);
  const loadingOlderRef = useRef(false);
  const lastReadBroadcastRef = useRef(null);

  const [showNewMessageBanner, setShowNewMessageBanner] = useState(false);

  const thread = useMessagingStore(
    useCallback(
      (state) => state.threads.find((item) => item.threadId === threadId) || null,
      [threadId]
    )
  );

  const typingUsers = useMessagingStore(
    useCallback(
      (state) => state.typingUsers[threadId] || EMPTY_TYPING_USERS,
      [threadId]
    )
  );

  const clearThreadTyping = useMessagingStore((state) => state.clearThreadTyping);

  const token = getToken();
  const {
    joinThread,
    leaveThread,
    sendTypingStart,
    sendTypingStop,
    broadcastDeleted,
    broadcastNewMessage,
    broadcastRead,
  } = useChatSocket(token);

  const {
    currentUser,
    messages,
    messagesError,
    hasMoreMessages,
    isMessagesLoading,
    isLoadingOlderMessages,
    loadLatestMessages,
    loadOlderMessages,
    sendMessage,
    retryMessage,
    deleteSentMessage,
    markThreadAsRead,
  } = useMessages(threadId);

  const peerTypingUsers = useMemo(
    () => typingUsers.filter((user) => normalize(user.userId) !== normalize(currentUser.id)),
    [currentUser.id, typingUsers]
  );

  const lastOwnMessageId = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (isOwnMessage(messages[index], currentUser)) {
        return messages[index].id;
      }
    }

    return null;
  }, [currentUser, messages]);

  const scrollToBottom = useCallback((behavior = "auto") => {
    if (!viewportRef.current) {
      return;
    }

    viewportRef.current.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior,
    });
  }, []);

  const markAsReadIfNeeded = useCallback(async () => {
    if (!messages.length) {
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const isIncoming = !isOwnMessage(lastMessage, currentUser);

    if (!isIncoming) {
      return;
    }

    if (lastReadBroadcastRef.current === lastMessage.id) {
      return;
    }

    await markThreadAsRead();
    broadcastRead(threadId, lastMessage.id);
    lastReadBroadcastRef.current = lastMessage.id;
  }, [broadcastRead, currentUser, markThreadAsRead, messages, threadId]);

  const loadOlderMessagesWithPosition = useCallback(async () => {
    if (!viewportRef.current || loadingOlderRef.current || !hasMoreMessages) {
      return;
    }

    loadingOlderRef.current = true;

    const previousHeight = viewportRef.current.scrollHeight;
    const previousTop = viewportRef.current.scrollTop;

    const loaded = await loadOlderMessages();

    if (loaded) {
      requestAnimationFrame(() => {
        if (!viewportRef.current) {
          return;
        }

        const currentHeight = viewportRef.current.scrollHeight;
        viewportRef.current.scrollTop = currentHeight - previousHeight + previousTop;
      });
    }

    loadingOlderRef.current = false;
  }, [hasMoreMessages, loadOlderMessages]);

  useEffect(() => {
    joinThread(threadId);
    clearThreadTyping(threadId);

    return () => {
      leaveThread(threadId);
      sendTypingStop(threadId);
      clearThreadTyping(threadId);
    };
  }, [clearThreadTyping, joinThread, leaveThread, sendTypingStop, threadId]);

  useEffect(() => {
    previousMessageCountRef.current = 0;
    lastReadBroadcastRef.current = null;

    void loadLatestMessages().then(() => {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    });
  }, [loadLatestMessages, scrollToBottom, threadId]);

  useEffect(() => {
    if (isMessagesLoading) {
      return;
    }

    if (!viewportRef.current) {
      return;
    }

    const previousCount = previousMessageCountRef.current;
    const currentCount = messages.length;

    if (currentCount === 0) {
      previousMessageCountRef.current = 0;
      return;
    }

    const appended = currentCount > previousCount;

    if (!appended) {
      previousMessageCountRef.current = currentCount;
      return;
    }

    const latest = messages[currentCount - 1];
    const nearBottom = isNearBottom(viewportRef.current);

    if (nearBottom || isOwnMessage(latest, currentUser)) {
      requestAnimationFrame(() => {
        scrollToBottom("smooth");
      });
      setShowNewMessageBanner(false);
    } else {
      setShowNewMessageBanner(true);
    }

    previousMessageCountRef.current = currentCount;
  }, [currentUser, isMessagesLoading, messages, scrollToBottom]);

  useEffect(() => {
    void markAsReadIfNeeded();
  }, [markAsReadIfNeeded]);

  const handleSendMessage = useCallback(
    async (content) => {
      const result = await sendMessage(content, "TEXT");

      if (result.ok && result.message) {
        broadcastNewMessage(threadId, result.message);
      }

      return result.ok;
    },
    [broadcastNewMessage, sendMessage, threadId]
  );

  const handleRetryMessage = useCallback(
    async (messageId) => {
      const result = await retryMessage(messageId);

      if (result.ok && result.message) {
        broadcastNewMessage(threadId, result.message);
      }
    },
    [broadcastNewMessage, retryMessage, threadId]
  );

  const handleDeleteMessage = useCallback(
    async (messageId) => {
      const deleted = await deleteSentMessage(messageId);

      if (deleted) {
        broadcastDeleted(threadId, messageId);
      }
    },
    [broadcastDeleted, deleteSentMessage, threadId]
  );

  const displayName = toDisplayName(thread?.otherUser);
  const avatarFallback = firstLetter(displayName);
  const applicationStatus = thread?.application?.status || "";
  const applicationStatusLabel = STATUS_LABEL[applicationStatus] || applicationStatus;

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <header className="flex min-h-14 items-center justify-between gap-3 border-b border-slate-200 px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          {onBackMobile ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-xl md:hidden"
              onClick={onBackMobile}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : null}

          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold uppercase text-slate-700">
            {thread?.otherUser?.avatarUrl ? (
              <img src={thread.otherUser.avatarUrl} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                {avatarFallback}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <Circle
                className={cn(
                  "h-2.5 w-2.5 fill-current",
                  thread?.isOnline ? "text-emerald-500" : "text-slate-300"
                )}
              />
              {thread?.isOnline ? "Đang hoạt động" : "Ngoại tuyến"}
            </p>
          </div>
        </div>
      </header>

      {thread?.application ? (
        <div className="job-context-bar border-b border-slate-200 bg-slate-50 px-3 py-2 sm:px-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-[10px] font-semibold uppercase">
              {thread?.otherUser?.avatarUrl ? (
                <img
                  src={thread.otherUser.avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                avatarFallback
              )}
            </div>

            <span>
              Về vị trí <strong>{thread.application.jobTitle || "Đang cập nhật"}</strong>
            </span>

            {applicationStatusLabel ? (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                {applicationStatusLabel}
              </span>
            ) : null}

            {thread.application.jobId ? (
              <Link
                to={`/jobs/${thread.application.jobId}`}
                className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-indigo-600 transition hover:bg-indigo-50"
              >
                Xem chi tiết
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          ref={viewportRef}
          className="custom-scrollbar flex min-h-0 flex-1 scroll-smooth flex-col gap-3 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4"
          onScroll={() => {
            if (!viewportRef.current) {
              return;
            }

            if (viewportRef.current.scrollTop < 80 && hasMoreMessages && !isLoadingOlderMessages) {
              void loadOlderMessagesWithPosition();
            }

            if (isNearBottom(viewportRef.current)) {
              setShowNewMessageBanner(false);
            }
          }}
        >
          {!isMessagesLoading && messages.length === 0 ? (
            <EmptyChat
              title="Bắt đầu cuộc trò chuyện"
              description="Hãy gửi lời chào đầu tiên để trao đổi với nhà tuyển dụng."
            />
          ) : null}

          {messages.map((message, index) => {
            const grouped = isGroupedWithPrevious(messages, index);
            const isOwn = isOwnMessage(message, currentUser);

            return (
              <div key={message.id} className={cn(grouped ? "mt-1" : "mt-2")}>
                <MessageBubble
                  message={message}
                  isOwn={isOwn}
                  showAvatar={!grouped}
                  showReadReceipt={message.id === lastOwnMessageId}
                  otherUser={thread?.otherUser}
                  onDelete={handleDeleteMessage}
                  onRetry={(messageId) => {
                    void handleRetryMessage(messageId);
                  }}
                />
              </div>
            );
          })}

          {peerTypingUsers.length > 0 ? <TypingIndicator users={peerTypingUsers} /> : null}
        </div>

        {showNewMessageBanner ? (
          <div className="pointer-events-none absolute bottom-26 left-0 right-0 z-10 flex justify-center px-3">
            <Button
              type="button"
              size="sm"
              className="pointer-events-auto h-11 rounded-full px-4 shadow-lg"
              onClick={() => {
                scrollToBottom("smooth");
                setShowNewMessageBanner(false);
              }}
            >
              Có tin nhắn mới
            </Button>
          </div>
        ) : null}

        {messagesError ? (
          <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-600">
            {messagesError}
          </div>
        ) : null}

        <MessageInput
          onSend={handleSendMessage}
          onTypingStart={() => sendTypingStart(threadId)}
          onTypingStop={() => sendTypingStop(threadId)}
          placeholder="Nhập tin nhắn..."
        />
      </div>
    </section>
  );
}

export default ChatWindow;
