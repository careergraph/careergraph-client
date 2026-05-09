const pad2 = (value) => String(value).padStart(2, "0");

export const formatDateYMD = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${d.getFullYear()}/${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}`;
};

export const formatDateTimeYMDHM = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${formatDateYMD(d)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

export const formatTimeHM = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};
