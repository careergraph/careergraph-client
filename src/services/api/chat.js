
import { apiConfig } from "~/config";
import { http } from "../http/request";

// ChatAPI chỉ gọi API, không xử lý logic, trả về promise
export const ChatAPI = {
  /**
   * Gửi tin nhắn (POST /chat/chat)
   * @param {string|null|undefined} userId - Optional, có thể null/undefined nếu chưa đăng nhập (query param)
   * @param {string} message - Nội dung tin nhắn (trong body)
   * @param {string} [conversationId] - ID conversation (trong body)
   */
  sendMessage({ userId, message, conversationId }) {
    // userId là query param
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    
    // message và conversationId nằm trong body
    const body = {
      message,
    };
    if (conversationId) {
      body.conversationId = conversationId;
    }
    
    const url = params.toString() 
      ? `${apiConfig.endpoints.chat.sendMessage}?${params.toString()}`
      : apiConfig.endpoints.chat.sendMessage;
    
    return http(url, {
      method: "POST",
      body,
    });
  },

  /**
   * Lấy tất cả hội thoại (GET /chat/conversations)
   * @param {string|null|undefined} userId - Optional, có thể null/undefined nếu chưa đăng nhập
   */
  getAllConversations(userId) {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    return http(`${apiConfig.endpoints.chat.conversations}?${params.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Lấy hội thoại gần nhất (GET /chat/lasted)
   * @param {string|null|undefined} userId - Optional, có thể null/undefined nếu chưa đăng nhập
   */
  getLastedConversation(userId) {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    return http(`${apiConfig.endpoints.chat.lasted}?${params.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Lấy lịch sử hội thoại (GET /chat/history)
   * @param {string|null|undefined} userId - Optional, có thể null/undefined nếu chưa đăng nhập
   * @param {string} conversationId
   */
  getConversationHistory({ userId, conversationId }) {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    params.append("conversationId", conversationId);
    return http(`${apiConfig.endpoints.chat.history}?${params.toString()}`, {
      method: "GET",
    });
  },
};
