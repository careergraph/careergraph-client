import { http } from "~/services/http/request";

const DEFAULT_THREAD_PAGE_SIZE = 20;
const DEFAULT_MESSAGE_PAGE_SIZE = 30;

const isRecord = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toStringSafe = (value, fallback = "") =>
  typeof value === "string" ? value : fallback;

const toNumberSafe = (value, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const toBooleanSafe = (value, fallback = false) =>
  typeof value === "boolean" ? value : fallback;

const HAS_TIMEZONE_SUFFIX = /(?:[zZ]|[+-]\d{2}(?::?\d{2})?)$/;

const normalizeIsoTimestamp = (value, fallback = "") => {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  const withSeparator = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  const withZone = HAS_TIMEZONE_SUFFIX.test(withSeparator)
    ? withSeparator
    : `${withSeparator}Z`;
  const millisNormalized = withZone.replace(/\.(\d{3})\d+/, ".$1");

  const parsed = new Date(millisNormalized);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return parsed.toISOString();
};

const normalizeIsoTimestampOrNull = (value) => {
  const normalized = normalizeIsoTimestamp(value, "");
  return normalized || null;
};

const unwrapEnvelope = (payload) => {
  if (isRecord(payload) && "data" in payload) {
    return payload.data;
  }

  return payload;
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

const normalizeUserSummary = (payload) => {
  const source = isRecord(payload) ? payload : {};

  const displayName = toStringSafe(
    source.displayName,
    toStringSafe(source.senderName)
  );
  const { firstName: fallbackFirstName, lastName: fallbackLastName } =
    splitDisplayName(displayName);

  const firstName = toStringSafe(source.firstName, fallbackFirstName);
  const lastName = toStringSafe(source.lastName, fallbackLastName);

  const fullName = `${firstName} ${lastName}`.trim();
  const resolvedDisplayName =
    displayName.trim() ||
    fullName ||
    toStringSafe(source.email).split("@")[0] ||
    "HR";

  return {
    id: toStringSafe(source.id, toStringSafe(source.userId, toStringSafe(source.senderId))),
    firstName,
    lastName,
    email: toStringSafe(source.email),
    avatarUrl:
      toStringSafe(source.avatarUrl, toStringSafe(source.avatar, toStringSafe(source.senderAvatar))) ||
      undefined,
    displayName: resolvedDisplayName,
  };
};

const normalizeThreadSummary = (payload) => {
  const source = isRecord(payload) ? payload : {};

  const partyPayload = isRecord(source.otherUser)
    ? source.otherUser
    : isRecord(source.otherParty)
      ? source.otherParty
      : {};

  const otherUser = normalizeUserSummary(partyPayload);

  const application = isRecord(source.application)
    ? {
        id: toStringSafe(source.application.id),
        jobId: toStringSafe(source.application.jobId),
        jobTitle: toStringSafe(source.application.jobTitle),
        status: toStringSafe(
          source.application.status,
          toStringSafe(source.application.currentStage)
        ),
      }
    : undefined;

  const normalizeThreadJob = (jobPayload) => {
    const jobSource = isRecord(jobPayload) ? jobPayload : {};

    return {
      jobId: toStringSafe(jobSource.jobId),
      jobTitle: toStringSafe(jobSource.jobTitle),
      jobStatus: toStringSafe(jobSource.jobStatus),
      unreadCount: toNumberSafe(jobSource.unreadCount),
      lastMessageAt: normalizeIsoTimestampOrNull(jobSource.lastMessageAt),
      hasMessages: toBooleanSafe(jobSource.hasMessages),
    };
  };

  const jobs = Array.isArray(source.jobs)
    ? source.jobs.map((job) => normalizeThreadJob(job)).filter((job) => Boolean(job.jobId))
    : [];

  const primaryJob = isRecord(source.primaryJob)
    ? normalizeThreadJob(source.primaryJob)
    : undefined;

  return {
    threadId: toStringSafe(source.threadId),
    otherUser,
    application,
    jobs,
    primaryJob,
    lastMessagePreview: toStringSafe(source.lastMessagePreview),
    lastMessageAt: normalizeIsoTimestampOrNull(source.lastMessageAt),
    unreadCount: toNumberSafe(source.unreadCount),
    isOnline: toBooleanSafe(source.isOnline, toBooleanSafe(source.online)),
    isArchived: toBooleanSafe(source.isArchived, toBooleanSafe(source.archived)),
    isBlocked: toBooleanSafe(source.isBlocked, toBooleanSafe(source.blocked)),
  };
};

const normalizeMessage = (payload, fallbackThreadId = "") => {
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
    threadId: toStringSafe(source.threadId, fallbackThreadId),
    sender: normalizeUserSummary(senderPayload),
    content: toStringSafe(source.content),
    contentType: toStringSafe(source.contentType, "TEXT"),
    fileUrl: toStringSafe(source.fileUrl) || undefined,
    fileName: toStringSafe(source.fileName) || undefined,
    fileSize:
      typeof source.fileSize === "number" && Number.isFinite(source.fileSize)
        ? source.fileSize
        : undefined,
    deleted: toBooleanSafe(source.deleted),
    jobContext: isRecord(source.jobContext)
      ? {
          jobId: toStringSafe(source.jobContext.jobId),
          jobTitle: toStringSafe(source.jobContext.jobTitle),
          jobStatus: toStringSafe(source.jobContext.jobStatus),
        }
      : null,
    createdAt: normalizeIsoTimestamp(source.createdAt, new Date().toISOString()),
    isRead: toBooleanSafe(source.isRead, toBooleanSafe(source.read)),
    readAt: normalizeIsoTimestamp(source.readAt, "") || undefined,
    localStatus: "sent",
  };
};

const normalizePageResponse = (payload, mapper, pageSizeFallback) => {
  const source = isRecord(payload) ? payload : {};
  const contentRaw = Array.isArray(source.content) ? source.content : [];

  const size = toNumberSafe(source.size, pageSizeFallback);
  const totalElements = toNumberSafe(source.totalElements, contentRaw.length);
  const totalPages = toNumberSafe(
    source.totalPages,
    size > 0 ? Math.ceil(totalElements / size) : 1
  );
  const pageNumber = toNumberSafe(source.number, 0);

  return {
    content: contentRaw.map((item) => mapper(item)),
    totalElements,
    totalPages,
    size,
    number: pageNumber,
    first: toBooleanSafe(source.first, pageNumber <= 0),
    last: toBooleanSafe(source.last, pageNumber >= totalPages - 1),
    empty: toBooleanSafe(source.empty, contentRaw.length === 0),
  };
};

const getThreads = async (
  page = 0,
  size = DEFAULT_THREAD_PAGE_SIZE,
  archived = false
) => {
  const response = await http(
    `/messages/threads?page=${page}&size=${size}&archived=${archived}`,
    {
      method: "GET",
      auth: true,
    }
  );

  const unwrapped = unwrapEnvelope(response);
  return normalizePageResponse(unwrapped, normalizeThreadSummary, size);
};

const getThread = async (threadId) => {
  const response = await http(`/messages/threads/${threadId}`, {
    method: "GET",
    auth: true,
  });

  const unwrapped = unwrapEnvelope(response);
  return normalizeThreadSummary(unwrapped);
};

const getOrCreateThread = async ({ candidateId, companyId, applicationId } = {}) => {
  const response = await http("/messages/threads", {
    method: "POST",
    auth: true,
    body: {
      candidateId,
      companyId,
      applicationId,
    },
  });

  const unwrapped = unwrapEnvelope(response);
  return normalizeThreadSummary(unwrapped);
};

const getMessages = async (
  threadId,
  jobId = null,
  page = 0,
  size = DEFAULT_MESSAGE_PAGE_SIZE
) => {
  const query = new URLSearchParams({ page: String(page), size: String(size) });
  if (jobId) {
    query.set("jobId", jobId);
  }

  const response = await http(
    `/messages/threads/${threadId}/messages?${query.toString()}`,
    {
      method: "GET",
      auth: true,
    }
  );

  const unwrapped = unwrapEnvelope(response);
  return normalizePageResponse(
    unwrapped,
    (item) => normalizeMessage(item, threadId),
    size
  );
};

const sendMessage = async (
  threadId,
  content,
  contentType = "TEXT",
  jobContextId = null
) => {
  const body = {
    content,
    contentType,
    ...(jobContextId ? { jobContextId } : {}),
  };

  const response = await http(`/messages/threads/${threadId}/messages`, {
    method: "POST",
    auth: true,
    body,
  });

  const unwrapped = unwrapEnvelope(response);
  return normalizeMessage(unwrapped, threadId);
};

const getThreadJobs = async (threadId) => {
  const response = await http(`/messages/threads/${threadId}/jobs`, {
    method: "GET",
    auth: true,
  });

  const unwrapped = unwrapEnvelope(response);
  const list = Array.isArray(unwrapped) ? unwrapped : [];

  return list
    .map((item) => {
      const source = isRecord(item) ? item : {};
      return {
        jobId: toStringSafe(source.jobId),
        jobTitle: toStringSafe(source.jobTitle),
        jobStatus: toStringSafe(source.jobStatus),
        unreadCount: toNumberSafe(source.unreadCount),
        lastMessageAt: normalizeIsoTimestampOrNull(source.lastMessageAt),
        hasMessages: toBooleanSafe(source.hasMessages),
      };
    })
    .filter((job) => Boolean(job.jobId));
};

const markThreadAsRead = async (threadId) => {
  await http(`/messages/threads/${threadId}/read`, {
    method: "POST",
    auth: true,
  });
};

const unsendMessage = async (messageId) => {
  await http(`/messages/${messageId}/unsend`, {
    method: "DELETE",
    auth: true,
  });
};

const deleteMessage = async (messageId) => {
  await http(`/messages/${messageId}`, {
    method: "DELETE",
    auth: true,
  });
};

const getUnreadCount = async () => {
  const response = await http("/messages/unread-count", {
    method: "GET",
    auth: true,
  });

  const unwrapped = unwrapEnvelope(response);

  if (isRecord(unwrapped) && typeof unwrapped.count === "number") {
    return unwrapped.count;
  }

  return 0;
};

export const messagingApi = {
  getThreads,
  getThread,
  getOrCreateThread,
  getMessages,
  sendMessage,
  getThreadJobs,
  markThreadAsRead,
  unsendMessage,
  deleteMessage,
  getUnreadCount,
};

export default messagingApi;
