import { apiConfig } from "~/config";
import { http } from "../http/request";

export const SkillAPI = {

  getLookupSkills(query){
    return http(`${apiConfig.endpoints.skill.lookup}?query=${encodeURIComponent(query)}`, {
      method: "GET",
    })
  },

}