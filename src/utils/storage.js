let memoryAccessToken = null; // giảm rủi ro XSS khi trang sống

export function setToken(token) {
  memoryAccessToken = token;
  // localStorage.setItem("authToken", token); // nếu bạn muốn auto-login sau reload
}

export function getToken() {
  // Ưu tiên in-memory nếu có (mới nhất)
  return memoryAccessToken 
  // || localStorage.getItem("authToken");
}

export function removeToken() {
  memoryAccessToken = null;
  // localStorage.removeItem("authToken");
}
// 🟢 Lưu thông tin xác thực OTP vào localStorage
export function setVerifyCurrent(data) {
  try {
    localStorage.setItem("verifyCurrent", JSON.stringify(data));
  } catch (err) {
    console.error("Lỗi khi lưu verifyCurrent:", err);
  }
}

// 🟢 Lấy thông tin đã lưu
export function getVerifyCurrent() {
  try {
    const raw = localStorage.getItem("verifyCurrent");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Lỗi khi đọc verifyCurrent:", err);
    return null;
  }
}

// 🟢 Xóa thông tin
export function removeVerifyCurrent() {
  try {
    localStorage.removeItem("verifyCurrent");
  } catch (err) {
    console.error("Lỗi khi xóa verifyCurrent:", err);
  }
}
