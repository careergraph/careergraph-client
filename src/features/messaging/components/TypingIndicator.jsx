const getTypingText = (users) => {
  if (users.length === 0) {
    return "";
  }

  if (users.length === 1) {
    return `${users[0].displayName || "Nhà tuyển dụng"} đang nhập`;
  }

  return `${users.length} người đang nhập`;
};

export function TypingIndicator({ users = [] }) {
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100/95 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm">
      <div className="flex items-center gap-1">
        <span className="typing-dot h-2 w-2 rounded-full bg-indigo-500" />
        <span className="typing-dot h-2 w-2 rounded-full bg-indigo-500" />
        <span className="typing-dot h-2 w-2 rounded-full bg-indigo-500" />
      </div>
      <span>{getTypingText(users)}...</span>
    </div>
  );
}

export default TypingIndicator;
