//D:\DaiHoc\DoAn\careergraph-client\src\services\api\user\user.js
import { apiConfig } from "~/config";
import { http } from "../http/request";
import { toast } from "sonner";

export const UserAPI = {

  updateJobCriteria(payload){
    return http(`${apiConfig.endpoints.user.updateJobFindCriteria}`, {
      method: "PUT",
      body: payload
    })
  },
  async me () {
    try{
      const data = await http (apiConfig.endpoints.user.me, {method:"GET",auth:true});
      // if (data?.data?.candidateId){
      //   try {
      //     const avatarRes = await UserAPI.getFileUrlByType({id:data.data.candidateId, type:"AVATAR"});
      //     if (avatarRes?.data?.length > 0) {
      //       data.data.avatarUrl = avatarRes.data || null;
      //    }
      //   }catch{
      //     toast("Lỗi lấy đại diện")
      //   }
      // }
      return data;
    }catch{
      toast("Lỗi lấy thông tin người dùng")
      return null;
    }
  },
  updateInfo(payload) {
    return http(apiConfig.endpoints.user.updateInfo, {
      method: "PUT",
      body:payload,
    });
  },
  getFileUrlByType({id,type}){
    return http(`${apiConfig.endpoints.user.empty}/${id}/files?type=${encodeURIComponent(type)}`,{
      method: "GET",
    })
  },
  uploadCandidateFile({id, body }){
    return http(`${apiConfig.endpoints.user.empty}/${id}/files`, {
      method: "POST",
      body
    })
  },
  addExperience(payload){
     return http(apiConfig.endpoints.user.experience, {
      method: "POST",
      body:payload,
    });
  },
  updateExperience({experienceId, payload}){
    return http(`${apiConfig.endpoints.user.experience}/${experienceId}`, {
      method: "PUT",
      body:payload,
    });
  },
  removeExperience(experienceId){
    return http(`${apiConfig.endpoints.user.experience}/${experienceId}`, {
      method: "DELETE",
    });
  },
  addEducation(payload){
     return http(apiConfig.endpoints.user.education, {
      method: "POST",
      body:payload,
    });
  },
  updateEducation({educationId, payload}){
    return http(`${apiConfig.endpoints.user.education}/${educationId}`, {
      method: "PUT",
      body:payload,
    });
  },
  removeEducation(educationId){
    return http(`${apiConfig.endpoints.user.education}/${educationId}`, {
      method: "DELETE",
    });
  },

  replaceSkillsForUser(payload){
    return http(`${apiConfig.endpoints.user.skill}`, {
      method: "PUT",
      body:payload,
    });
  }
  
};
