import { getToken } from "~/utils/storage";

const decodeJwtClaims = (token) => {
  if (!token || typeof token !== "string") {
    return {};
  }

  const parts = token.split(".");
  if (parts.length < 2) {
    return {};
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = atob(padded);

    return JSON.parse(payload);
  } catch {
    return {};
  }
};

export const getMessagingIdentity = (user = null) => {
  const claims = decodeJwtClaims(getToken());

  const firstName = user?.firstName || claims.firstName || "";
  const lastName = user?.lastName || claims.lastName || "";
  const email = user?.email || claims.email || "";

  const displayName =
    `${firstName} ${lastName}`.trim() ||
    (email ? email.split("@")[0] : "") ||
    "Bạn";

  return {
    id:
      claims.sub ||
      user?.accountId ||
      user?.id ||
      user?.userId ||
      user?.candidateId ||
      email ||
      "",
    firstName,
    lastName,
    email,
    avatarUrl: user?.avatar || user?.avatarUrl || claims.avatarUrl || undefined,
    displayName,
  };
};

export default getMessagingIdentity;
