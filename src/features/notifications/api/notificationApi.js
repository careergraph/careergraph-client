import { http } from "~/services/http/request";

const DEFAULT_NOTIFICATION_PAGE_SIZE = 20;

const isRecord = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toStringSafe = (value, fallback = "") =>
  typeof value === "string" ? value : fallback;

const toNumberSafe = (value, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const toBooleanSafe = (value, fallback = false) =>
  typeof value === "boolean" ? value : fallback;

const unwrapEnvelope = (payload) => {
  let current = payload;
  let depth = 0;

  while (isRecord(current) && "data" in current && depth < 5) {
    const next = current.data;

    if (typeof next === "undefined" || next === null) {
      break;
    }

    current = next;
    depth += 1;
  }

  return current;
};

const normalizeNotification = (payload) => {
  const source = isRecord(payload) ? payload : {};
  const read =
    typeof source.read === "boolean"
      ? source.read
      : toBooleanSafe(source.isRead);

  return {
    id: toStringSafe(source.id, `notification-${Date.now()}`),
    type: toStringSafe(source.type, "GENERAL"),
    title: toStringSafe(source.title, "Thông báo mới"),
    body: toStringSafe(source.body, "Bạn có một thông báo mới."),
    data: isRecord(source.data) ? source.data : undefined,
    createdAt: toStringSafe(source.createdAt, new Date().toISOString()),
    read,
  };
};

const countUnread = (notifications) =>
  notifications.reduce((total, notification) => total + (notification.read ? 0 : 1), 0);

const normalizeNotificationPage = (payload) => {
  const source = isRecord(payload) ? payload : {};
  const rawNotifications = Array.isArray(source.notifications)
    ? source.notifications
    : Array.isArray(source.content)
      ? source.content
      : [];

  const notifications = rawNotifications.map((item) => normalizeNotification(item));

  const hasMoreFromPage = (() => {
    const size = toNumberSafe(source.size, DEFAULT_NOTIFICATION_PAGE_SIZE);
    const totalElements = toNumberSafe(source.totalElements, notifications.length);
    const totalPages = toNumberSafe(
      source.totalPages,
      size > 0 ? Math.ceil(totalElements / size) : 1
    );
    const pageNumber = toNumberSafe(source.number, 0);
    const isLast = toBooleanSafe(source.last, pageNumber >= totalPages - 1);

    return !isLast && pageNumber + 1 < totalPages;
  })();

  return {
    notifications,
    totalUnread: toNumberSafe(source.totalUnread, countUnread(notifications)),
    hasMore: toBooleanSafe(source.hasMore, hasMoreFromPage),
  };
};

const getNotifications = async (
  page = 0,
  size = DEFAULT_NOTIFICATION_PAGE_SIZE
) => {
  const response = await http(`/notifications?page=${page}&size=${size}`, {
    method: "GET",
    auth: true,
  });

  const unwrapped = unwrapEnvelope(response);
  return normalizeNotificationPage(unwrapped);
};

const markAsRead = async (notificationId) => {
  await http(`/notifications/${notificationId}/read`, {
    method: "POST",
    auth: true,
  });
};

const markAllAsRead = async () => {
  await http("/notifications/read-all", {
    method: "POST",
    auth: true,
  });
};

const getUnreadCount = async () => {
  const response = await http("/notifications/unread-count", {
    method: "GET",
    auth: true,
  });

  const unwrapped = unwrapEnvelope(response);

  if (isRecord(unwrapped) && typeof unwrapped.count === "number") {
    return unwrapped.count;
  }

  return 0;
};

export const notificationApi = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};

export default notificationApi;
