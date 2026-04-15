import { MessageCircleMore } from "lucide-react";

export function EmptyChat({
  title = "Chọn cuộc trò chuyện để bắt đầu",
  description = "Bạn có thể nhắn tin trực tiếp với nhà tuyển dụng trong quá trình ứng tuyển.",
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
        <MessageCircleMore className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default EmptyChat;
