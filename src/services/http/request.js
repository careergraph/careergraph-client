//src/services/http/request.js
import { apiConfig } from "~/config";
import { getToken,removeToken, setToken } from "~/utils/storage";

const REFRESH_PATH = "/auth/refresh";

let isRefreshing = false;
let waiters = [];

async function parseJSON(res){
  const text = await res.text();
  const data = text ? JSON.parse(text): {};
  if(!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data
}

async function refreshAccessToken(){
  try{
    const res = await fetch(`${apiConfig.baseURL}${REFRESH_PATH}`,{
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json"},
    })

    const data = await parseJSON(res)
    const nextAccess = data?.data?.accessToken || data?.accessToken|| data;
    if(!nextAccess) throw new Error("Không nhận được token mới")
    setToken(nextAccess);
    return nextAccess;

  }catch(err){
    removeToken()
    throw err;
  }
}

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
  const isFormData =  typeof FormData !== 'undefined' && body instanceof FormData;
  const baseHeaders = isFormData ? {} : { "Content-Type": "application/json" };
  const doFetch = ()=> {
    const latestToken = getToken();
    return fetch(`${apiConfig.baseURL}${path}`, {
      method,
      headers: {
        ...baseHeaders,
        ...(auth && latestToken ? {Authorization: `Bearer ${latestToken}`} : {}),
        ...headers,
      },
      body: isFormData ? body : (body ? JSON.stringify(body): undefined),
      credentials: "include",
      signal,
    });
  };
  

    const res = await doFetch();
    if(res.status !=401 || !auth){
      return await parseJSON(res);
    }

    if(isRefreshing){
      return new Promise((resolve, reject) => {
        waiters.push({resolve, reject, path, method, headers, body, auth, isFormData, baseHeaders});
      })
    }
    isRefreshing = true;

    try {
      await refreshAccessToken()

      waiters.forEach(async ({resolve, reject, path, method, headers, body, auth, isFormData, baseHeaders, signal }) => {
        try {
            const retryRes = await fetch(`${apiConfig.baseURL}${path}`, {
            method: method,
            headers: {
              ...baseHeaders,
              ...(auth && getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
              ...headers,
            },
            body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
            credentials: "include",
            signal
          });
          const data = await parseJSON(retryRes);
          resolve(data)
        }
        catch (err){
          reject(err)
        }
      })
      waiters = [];
    }catch (e) {
      waiters.forEach(({ reject }) => reject(e));
      waiters = [];
      throw e;
    } finally {
      isRefreshing = false;
    }
    const retryRes = await doFetch();
    return await parseJSON(retryRes);
  
} 


