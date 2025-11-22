import { ChatAPI } from "./api/chat";

/**
 * Gửi tin nhắn đến AI chatbot
 * @param {Object} params
 * @param {string} params.userId - ID của user
 * @param {string} params.message - Nội dung tin nhắn
 * @param {string} [params.conversationId] - ID của conversation (optional, nếu không có sẽ tạo mới)
 * @returns {Promise<Object>} { message: string, conversationId: string, relatedJobs: Array }
 */
export async function sendMessage({ userId, message, conversationId }) {
  try {
    const response = await ChatAPI.sendMessage({
      userId,
      message,
      conversationId,
    });

    // Backend trả về RestResponse<ChatResponse>
    const chatResponse = response?.data || response;

    // Chuẩn hóa tên field từ snake_case sang camelCase
    const relatedJobs = (
      chatResponse.related_jobs ||
      chatResponse.relatedJobs ||
      []
    ).map((job) => ({
      jobId: job.job_id || job.jobId,
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      salary: job.salary || "",
      description: job.description || "",
      requirements: job.requirements || [],
      relevanceScore: job.relevance_score || job.relevanceScore || 0,
    }));

    return {
      message: chatResponse.message || "",
      conversationId:
        chatResponse.conversation_id || chatResponse.conversationId || null,
      relatedJobs,
    };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

/**
 * Lấy tất cả các conversation của user
 * @param {string} userId - ID của user
 * @returns {Promise<Array>} Danh sách ChatConversation
 */
export async function getAllConversations(userId) {
  try {
    const response = await ChatAPI.getAllConversations(userId);

    // Backend trả về RestResponse<List<ChatConversation>>
    const conversations = response?.data || response || [];

    // Đảm bảo trả về array
    if (!Array.isArray(conversations)) {
      return [];
    }

    // Chuẩn hóa dữ liệu (nếu cần)
    return conversations.map((conv) => ({
      id: conv.id,
      conversationId: conv.id, // Alias để dễ sử dụng
      title: conv.title || "Cuộc trò chuyện mới",
      lastMessageAt: conv.last_message_at || conv.lastMessageAt,
      totalMessages: conv.total_messages || conv.totalMessages || 0,
      partyType: conv.party_type || conv.partyType,
      partyId: conv.party_id || conv.partyId,
      messages: conv.messages || [],
      createdAt: conv.created_date || conv.createdDate,
      updatedAt: conv.updated_date || conv.updatedDate,
    }));
  } catch (error) {
    console.error("Error getting all conversations:", error);
    throw error;
  }
}

/**
 * Lấy conversation gần nhất của user
 * @param {string} userId - ID của user
 * @returns {Promise<Object|null>} ChatConversation hoặc null nếu không có
 */
export async function getLastedConversation(userId) {
  try {
    const response = await ChatAPI.getLastedConversation(userId);

    // Backend trả về RestResponse<ChatConversation>
    const conversation = response?.data || response;

    // Nếu không có conversation, trả về null
    if (!conversation || !conversation.id) {
      return null;
    }

    // Chuẩn hóa dữ liệu
    return {
      id: conversation.id,
      conversationId: conversation.id,
      title: conversation.title || "Cuộc trò chuyện mới",
      lastMessageAt: conversation.last_message_at || conversation.lastMessageAt,
      totalMessages:
        conversation.total_messages || conversation.totalMessages || 0,
      partyType: conversation.party_type || conversation.partyType,
      partyId: conversation.party_id || conversation.partyId,
      messages: conversation.messages || [],
      createdAt: conversation.created_date || conversation.createdDate,
      updatedAt: conversation.updated_date || conversation.updatedDate,
    };
  } catch (error) {
    console.error("Error getting lasted conversation:", error);
    throw error;
  }
}

/**
 * Lấy lịch sử tin nhắn của một conversation
 * @param {Object} params
 * @param {string} params.userId - ID của user
 * @param {string} params.conversationId - ID của conversation
 * @returns {Promise<Array>} Danh sách ChatMessage
 */
export async function getConversationHistory({ userId, conversationId }) {
  try {
    const response = await ChatAPI.getConversationHistory({
      userId,
      conversationId,
    });

    // Backend trả về RestResponse<List<ChatMessage>>
    const messages = response?.data || response || [];

    // Đảm bảo trả về array
    if (!Array.isArray(messages)) {
      return [];
    }

    // Chuẩn hóa dữ liệu
    return messages.map((msg) => ({
      id: msg.id,
      role: msg.role || "USER", // "USER" hoặc "ASSISTANT"
      content: msg.content || "",
      relatedJobIds: msg.related_job_ids || msg.relatedJobIds || [],
      metadata: msg.metadata || {},
      conversationId:
        msg.chat_conversation_id || msg.chatConversation?.id || conversationId,
      createdAt: msg.created_date || msg.createdDate,
      updatedAt: msg.updated_date || msg.updatedDate,
    }));
  } catch (error) {
    console.error("Error getting conversation history:", error);
    throw error;
  }
}
