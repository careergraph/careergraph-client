import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_CONFIG, SYSTEM_PROMPT } from "~/config/gemini";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);

// LocalStorage keys
const CHAT_HISTORY_KEY = "hyra_chat_history";

/**
 * Lưu lịch sử chat vào localStorage
 */
export const saveChatHistory = (messages) => {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
};

/**
 * Lấy lịch sử chat từ localStorage
 */
export const getChatHistory = () => {
  try {
    const history = localStorage.getItem(CHAT_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error loading chat history:", error);
    return [];
  }
};

/**
 * Xóa lịch sử chat
 */
export const clearChatHistory = () => {
  try {
    localStorage.removeItem(CHAT_HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing chat history:", error);
  }
};

/**
 * Gửi tin nhắn tới Gemini API và nhận phản hồi
 */
export const sendMessageToGemini = async (
  userMessage,
  conversationHistory = []
) => {
  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.model });

    // Xây dựng context từ lịch sử hội thoại
    const chatContext = conversationHistory
      .map(
        (msg) =>
          `${msg.type === "user" ? "Người dùng" : "Hyra"}: ${msg.content}`
      )
      .join("\n");

    // Tạo prompt đầy đủ
    const fullPrompt = `${SYSTEM_PROMPT}

    ${chatContext ? `LỊCH SỬ HỘI THOẠI:\n${chatContext}\n` : ""}
    Người dùng: ${userMessage}
    Hyra:`;

    console.log("Full Prompt:", fullPrompt);

    // Gọi API
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    console.log(result)

    return {
      success: true,
      message: text.trim(),
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);

    // Error handling
    let errorMessage = "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau! 🙏";

    if (error.message?.includes("API key")) {
      errorMessage = "Lỗi cấu hình API. Vui lòng liên hệ quản trị viên.";
    } else if (error.message?.includes("quota")) {
      errorMessage = "Đã hết quota API. Vui lòng thử lại sau.";
    }

    return {
      success: false,
      message: errorMessage,
      error: error.message,
    };
  }
};

/**
 * Format tin nhắn để lưu
 */
export const formatMessage = (content, type = "user") => {
  return {
    id: Date.now() + Math.random(),
    type,
    content,
    time: new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    timestamp: Date.now(),
  };
};
