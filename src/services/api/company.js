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

  getFollowStatus(id) {
    const url = apiConfig.endpoints.company.followStatus.replace(":id", id);
    return http(url, {
      method: "GET",
    });
  },

  toggleFollow(id) {
    const url = apiConfig.endpoints.company.follow.replace(":id", id);
    return http(url, {
      method: "PUT",
    });
  },

  getFollowedCompanies() {
    return http(apiConfig.endpoints.company.following, {
      method: "GET",
    });
  },

}