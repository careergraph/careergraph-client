import { apiConfig } from "~/config";
import { http } from "../http/request";

export const CompanyAPI = {


  getLookupCompany(query){
    return http(`${apiConfig.endpoints.company.lookup}?query=${encodeURIComponent(query)}`, {
      method: "GET",
    })
  },

}