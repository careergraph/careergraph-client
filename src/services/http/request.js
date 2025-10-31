// src/services/http/request.js
import axios from "axios";
import { apiConfig } from "~/config";
import { getToken, removeToken, setToken } from "~/utils/storage";

const REFRESH_PATH = "/auth/refresh";

// ====== STATE DÙNG CHUNG ======
let isRefreshing = false;
let waiters = []; // { resolve, reject, config }

// Hàm cho các request đang chờ refresh: gọi lại request gốc sau khi có token mới
function processQueue(error, newAccessToken = null) {
  waiters.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
      return;
    }
    // gắn token mới vô header Authorization rồi call lại
    if (newAccessToken) {
      config.headers.Authorization = `Bearer ${newAccessToken}`;
    }
    resolve(instance(config));
  });
  waiters = [];
}

// Tạo axios instance riêng để dễ kiểm soát
const instance = axios.create({
  baseURL: apiConfig.baseURL,
  withCredentials: true, // tương đương credentials: "include"
  headers: {
    "Content-Type": "application/json",
  },
});

// ================== REFRESH TOKEN FLOW ==================
export async function refreshAccessToken() {
  try {
    // gọi endpoint refresh, KHÔNG gửi Authorization cũ
    const res = await instance.post(
      REFRESH_PATH,
      {},
      {
        // override config cho chắc
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          // KHÔNG đính kèm Bearer cũ
          Authorization: undefined,
        },
      }
    );

    // chuẩn hóa data trả về để lấy token
    const data = res?.data || {};
    const nextAccess =
      data?.data?.accessToken || data?.accessToken || data.accessToken;

    if (!nextAccess) {
      throw new Error("Không nhận được token mới");
    }

    // lưu token mới
    setToken(nextAccess);

    return nextAccess;
  } catch (err) {
    removeToken();
    throw err;
  }
}

// ================== REQUEST INTERCEPTOR ==================
//
// Mục tiêu:
// - Cho phép gọi http(path, {auth:false}) => không gắn Bearer
// - Nếu body là FormData => đừng set Content-Type thủ công
//
// Ta sẽ gắn custom field vào config trước khi gọi axios (ở hàm http phía dưới),
// rồi interceptor đọc field đó.
instance.interceptors.request.use(
  (config) => {
    const { auth = true, isFormData = false } = config.custom || {};

    // Nếu có token và auth=true => gắn Authorization
    if (auth) {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Nếu body là FormData => xoá Content-Type mặc định để browser tự set boundary
    if (isFormData) {
      if (config.headers && config.headers["Content-Type"]) {
        delete config.headers["Content-Type"];
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================== RESPONSE INTERCEPTOR ==================
//
// Mục tiêu:
// - Nếu 401 -> thực hiện refresh token (chỉ 1 lần đồng thời), rồi retry
// - Các request khác chờ bằng queue
//
instance.interceptors.response.use(
  (response) => {
    // response OK => trả thẳng data ở dạng đồng nhất
    // parseJSON() của bạn cũ basically trả res.json() và throw nếu !ok,
    // nên ở đây ta normalize: chỉ return data (và để caller tự xử lý)
    return response.data ?? {};
  },
  async (error) => {
    const originalConfig = error.config;

    // Nếu không có response (network error v.v.)
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Nếu không phải 401 hoặc request đó không cần auth => quăng lỗi luôn
    const needsAuth = originalConfig?.custom?.auth !== false;
    if (status !== 401 || !needsAuth) {
      return Promise.reject(error);
    }

    // Tránh vòng lặp vô hạn: nếu config này đã retry rồi thì thôi
    if (originalConfig._retry) {
      return Promise.reject(error);
    }
    originalConfig._retry = true;

    // Nếu đang refresh rồi: return promise chờ token mới
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waiters.push({ resolve, reject, config: originalConfig });
      });
    }

    // Chúng ta sẽ là request đầu tiên cố refresh
    isRefreshing = true;

    try {
      const newAccessToken = await refreshAccessToken();

      // Sau khi refresh xong: xử lý tất cả thằng đang chờ
      processQueue(null, newAccessToken);

      // Gắn token mới vô header request ban đầu rồi gọi lại
      originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;

      return instance(originalConfig);
    } catch (refreshErr) {
      // Refresh FAIL: báo lỗi cho tất cả thằng chờ
      processQueue(refreshErr, null);
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

// ================== PUBLIC HELPER ==================
//
// Giữ nguyên API giống hàm http(path, {method, headers, body, auth, signal})
//
export async function http(
  path,
  {
    method = "GET",
    headers = {},
    body,
    auth = true,
    signal,
  } = {}
) {
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  // axios dùng `data` cho body, `params` cho query string
  // ở đây path đã bao gồm query (nếu có), nên ta dùng `data`
  //
  // parseJSON() cũ:
  // - nếu !res.ok => throw Error
  // interceptors.response ở trên đã làm việc tương tự:
  // - axios sẽ throw nếu status >=400
  // - nếu ok thì trả .data
  //
  // => ở đây chỉ cần return instance(...)
  return instance({
    url: path,
    method,
    headers,
    data: body,
    signal,
    // custom metadata cho interceptor request
    custom: {
      auth,
      isFormData,
    },
  });
}

// Nếu bạn muốn export sẵn instance để xài ở chỗ đặc biệt (upload raw, v.v.)
export { instance };
