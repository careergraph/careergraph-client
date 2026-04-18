import { useEffect, useMemo, useRef } from "react";
import useChatSocket from "~/features/messaging/hooks/useChatSocket";
import useThreads from "~/features/messaging/hooks/useThreads";
import { useAuthStore } from "~/stores/authStore";
import { getToken } from "~/utils/storage";

const MAX_BACKGROUND_THREADS = 100;

export function MessagingRealtimeBootstrap() {
  const { isAuthenticated } = useAuthStore();
  const token = isAuthenticated ? getToken() : null;

  const { threads } = useThreads({ autoLoad: Boolean(token), archived: false });
  const { joinThread, leaveThread } = useChatSocket(token);

  const joinedRef = useRef(new Set());

  const targetThreadIds = useMemo(() => {
    return threads
      .map((thread) => thread.threadId)
      .filter(Boolean)
      .slice(0, MAX_BACKGROUND_THREADS);
  }, [threads]);

  useEffect(() => {
    if (!token) {
      joinedRef.current.clear();
      return;
    }

    const nextIds = new Set(targetThreadIds);

    for (const threadId of nextIds) {
      if (!joinedRef.current.has(threadId)) {
        joinThread(threadId);
        joinedRef.current.add(threadId);
      }
    }

    for (const threadId of Array.from(joinedRef.current)) {
      if (!nextIds.has(threadId)) {
        leaveThread(threadId);
        joinedRef.current.delete(threadId);
      }
    }
  }, [joinThread, leaveThread, targetThreadIds, token]);

  useEffect(() => {
    return () => {
      for (const threadId of joinedRef.current) {
        leaveThread(threadId);
      }
      joinedRef.current.clear();
    };
  }, [leaveThread]);

  return null;
}

export default MessagingRealtimeBootstrap;
