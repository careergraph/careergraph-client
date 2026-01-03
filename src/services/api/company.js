import { apiConfig } from "~/config";
import { http } from "../http/request";

export const CompanyAPI = {


  getLookupCompany(query){
    return http(`${apiConfig.endpoints.company.lookup}?query=${encodeURIComponent(query)}`, {
      method: "GET",
    })
  },

  getCompanyDetail(id) {
    const url = apiConfig.endpoints.company.detail.replace(":id", id);
    return http(url, {
      method: "GET",
    });
  },

}