import { http } from "./http/request";

export const UserAPI = {
  me: () => http ("/candidates/me", {method:"GET",auth:true}),
  updateInformation(payload) {
    return http("/candidate/update-information", {
      method: "POST",
      body:payload,
    });
  },
  getFileUrl({id,type}){
    return http(`/candidates/${id}/files?type${encodeURIComponent(type)}`,{
      method: "GET",
    })
  },
  uploadFile({id, type }){
    const form = new FormData();
    form.append("type", type)
    form.append("id", id)
    return http(`/candidates/${id}/files`, {
      method: "POST",
      body: form,
    })
  }

}