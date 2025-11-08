import { apiConfig } from "~/config";
import { http } from "../http/request";

export const EducationAPI = {

  getLookupUniversities(query){
    return http(`${apiConfig.endpoints.education.lookup}?query=${encodeURIComponent(query)}`, {
      method: "GET",
    })
  },

}