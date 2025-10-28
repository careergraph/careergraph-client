import { http } from "./http/request";

export const UserAPI = {
  me: () => http ("/candidates/me", {method:"GET",auth:true}),
  updateInformation(payload) {
    return http("/candidates/update-information", {
      method: "POST",
      body:payload,
    });
  },
  getFileUrl({id,type}){
    return http(`/candidates/${id}/files?type=${encodeURIComponent(type)}`,{
      method: "GET",
    })
  },
  uploadFile({id, body }){
    return http(`/candidates/${id}/files`, {
      method: "POST",
      body
    })
  }

}