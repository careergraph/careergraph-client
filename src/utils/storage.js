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

export function setEmailVerifyCurrent(email){
  localStorage.setItem("emailVerifyCurrent", email)
}
export function getEmailVerifyCurrent(){
  return {
    email: localStorage.getItem("emailVerifyCurrent"),
  }
  
}
export function removeEmailVerifyCurrent(){
  localStorage.removeItem("emailVerifyCurrent")
}