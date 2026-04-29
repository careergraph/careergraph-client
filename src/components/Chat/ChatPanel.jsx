/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { X, Send, Headset, Trash2, Loader2, MapPin, Building2, DollarSign, Briefcase } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import chatBotAIIcon from "~/assets/logo.svg";
import * as chatService from "~/services/chatService";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  // sendMessageToGemini,  // OLD: Direct Gemini API call
  saveChatHistory,
  clearChatHistory,
  formatMessage,
} from "~/services/geminiService";
import { toast } from "sonner";

const JobRecommendationCard = ({ job }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mt-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-3">
        <div>
          <Link
            to={`/jobs/${job.jobId}`}
            className="font-bold text-indigo-700 hover:text-indigo-900 hover:underline line-clamp-1"
            title={job.title}
          >
            {job.title}
          </Link>
          <div className="flex items-center gap-1.5 text-slate-600 text-xs mt-1">
            <Building2 className="w-3 h-3" />
            <span className="font-medium line-clamp-1">{job.company}</span>
          </div>
        </div>
        {job.relevanceScore && (
          <div className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
            {Math.round(job.relevanceScore * 100)}% phù hợp
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1.5">
        {job.location && (
          <div className="flex items-start gap-1.5 text-slate-500 text-xs">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
        )}
        {job.salary && (
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <DollarSign className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium text-slate-700">{job.salary}</span>
          </div>
        )}
      </div>

      <Link
        to={`/jobs/${job.jobId}`}
        className="block w-full mt-3 text-center bg-indigo-50 text-indigo-600 text-xs font-semibold py-2 rounded-lg hover:bg-indigo-100 transition-colors"
      >
        Xem chi tiết
      </Link>
    </div>
  );
};

export default function ChatPanel({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  // Reset conversationId khi component mount (refresh trang)
  useEffect(() => {
    setConversationId(null);
  }, []);

  // Auto scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Khi mở chat panel, hiển thị welcome message nếu chưa có messages (không gọi API)
  useEffect(() => {
    if (!isOpen) return;

    // Nếu đã có messages, không làm gì (tiếp tục cuộc trò chuyện trong cùng session)
    if (messages.length > 0) {
      return;
    }

    // Nếu chưa có messages (lần đầu mở trong session này sau khi refresh), hiển thị welcome message
    const welcomeMessage = formatMessage(
      "Xin chào! 👋 Tôi là Hyra, trợ lý tìm việc của CareerGraph. Tôi có thể giúp bạn:\n\n💼 Tìm việc làm phù hợp\n📝 Tư vấn CV\n💡 Hướng dẫn phỏng vấn\n🎯 Tư vấn nghề nghiệp\n\nBạn cần giúp gì hôm nay?",
      "bot"
    );

    setMessages([welcomeMessage]);
    saveChatHistory([welcomeMessage]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userId = localStorage.getItem("userId") || null;

    const userMessage = formatMessage(inputValue.trim(), "user");
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    // Lưu tin nhắn user vào localStorage (cache)
    saveChatHistory(updatedMessages);

    try {
      // Gọi chatService gửi message đến backend
      // userId có thể là null nếu chưa đăng nhập
      // conversationId: null lần đầu, sau đó dùng giá trị từ response
      const response = await chatService.sendMessage({
        userId,
        message: userMessage.content,
        conversationId: conversationId || null,
      });

      const {
        message: botMsg,
        conversationId: newConvId,
        relatedJobs,
      } = response;

      // Lưu conversationId từ response để dùng cho lần gửi tiếp theo
      if (newConvId) {
        setConversationId(newConvId);
      }

      // Tạo tin nhắn bot với nội dung phản hồi
      let botMessageContent =
        botMsg || "Xin lỗi, tôi không thể phản hồi lúc này.";

      const botMessage = {
        ...formatMessage(botMessageContent, "bot"),
        relatedJobs: relatedJobs || []
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch (error) {
      console.error("Error sending message:", error);

      // Xử lý lỗi chi tiết hơn
      let errorMessage =
        "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau! 🙏";

      if (error.response?.status === 401) {
        errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Máy chủ đang gặp sự cố. Vui lòng thử lại sau!";
      } else if (
        error.message?.includes("Network") ||
        error.code === "ERR_NETWORK"
      ) {
        errorMessage =
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
      }

      const errorMsg = formatMessage(errorMessage, "bot");
      const finalMessages = [...updatedMessages, errorMsg];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action) => {
    const quickMessages = {
      job: "Tôi muốn tìm việc làm phù hợp với mình",
      cv: "Bạn có thể tư vấn cho tôi về cách viết CV không?",
      career: "Tôi cần tư vấn về lộ trình nghề nghiệp",
    };
    setInputValue(quickMessages[action] || "");
  };

  const handleClearHistory = () => {
    if (confirm("Bạn có chắc muốn xóa toàn bộ lịch sử chat?")) {
      // Xóa cache local
      clearChatHistory();
      // Reset conversationId để tạo conversation mới khi gửi tin nhắn tiếp theo
      setConversationId(null);
      localStorage.removeItem("conversationId");

      // Hiển thị tin nhắn chào mừng
      const welcomeMessage = formatMessage(
        "Lịch sử đã được xóa. Bạn cần giúp gì hôm nay? 😊",
        "bot"
      );
      setMessages([welcomeMessage]);
      saveChatHistory([welcomeMessage]);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Chat Panel - Increased size */}
      <div className="fixed bottom-0 right-6 z-50 w-[480px] max-w-[calc(100vw-3rem)] h-[700px] max-h-[calc(100vh-6rem)] bg-white rounded-t-2xl shadow-2xl border-2 border-slate-200 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <img src={chatBotAIIcon} className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Hyra AI</h3>
              <p className="text-xs text-indigo-100">Trợ lý tìm việc</p>
            </div>
          </div>
          <div className="flex items-center align-baseline gap-1">
            <button
              onClick={() =>
                toast.info("CareerGraph sẽ liên hệ với bạn sớm nhất có thể!")
              }
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title="Liên hệ hỗ trợ"
            >
              <Headset className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={handleClearHistory}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title="Xóa lịch sử chat"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 py-4">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div className={`flex flex-col max-w-[85%] ${message.type === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`w-full ${message.type === "user"
                          ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm"
                          : "bg-slate-100 text-slate-800 rounded-2xl rounded-tl-sm"
                        } px-4 py-3 shadow-sm`}
                    >
                      <div className={`text-sm leading-relaxed prose ${message.type === "user" ? "prose-invert" : "prose-slate"} max-w-none`}>
                        {message.type === "user" ? (
                          <p className="whitespace-pre-wrap break-words m-0">{message.content}</p>
                        ) : (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                              ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                              ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                              a: ({ node, ...props }) => <a className="text-indigo-600 hover:underline font-medium" {...props} />,
                              strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                              table: ({ node, ...props }) => <div className="overflow-x-auto my-2"><table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg" {...props} /></div>,
                              th: ({ node, ...props }) => <th className="px-3 py-2 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200" {...props} />,
                              td: ({ node, ...props }) => <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-500 border-b border-slate-200" {...props} />,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>

                    {/* Render Related Jobs if any */}
                    {message.relatedJobs && message.relatedJobs.length > 0 && (
                      <div className="mt-2 w-full space-y-2">
                        <p className="text-xs font-semibold text-slate-500 ml-1">Việc làm đề xuất:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {message.relatedJobs.slice(0, 3).map((job, idx) => (
                            <JobRecommendationCard key={job.jobId || idx} job={job} />
                          ))}
                        </div>
                      </div>
                    )}

                    <p
                      className={`text-[10px] mt-1 px-1 ${message.type === "user"
                          ? "text-slate-400 text-right"
                          : "text-slate-400"
                        }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div
                        className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-pink-600 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t border-slate-100 flex-shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => handleQuickAction("job")}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-full whitespace-nowrap hover:bg-slate-200 transition-colors"
            >
              💼 Tìm việc làm
            </button>
            <button
              onClick={() => handleQuickAction("cv")}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-full whitespace-nowrap hover:bg-slate-200 transition-colors"
            >
              📝 Viết CV
            </button>
            <button
              onClick={() => handleQuickAction("career")}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-full whitespace-nowrap hover:bg-slate-200 transition-colors"
            >
              💡 Tư vấn nghề
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="px-4 pb-4 pt-2 border-t-2 border-slate-100 flex-shrink-0">
          <div className="flex items-start gap-2">
            <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl focus-within:border-indigo-500 transition-colors">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                disabled={isLoading}
                className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 resize-none outline-none disabled:opacity-50 px-3 py-2 min-h-[40px] max-h-[120px]"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex-shrink-0 mt-0.5"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
