import { CompanyAPI } from "./api/company";

export const CompanyService = {
  fetchCompanyDetail: async (id) => {
    try {
      const response = await CompanyAPI.getCompanyDetail(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching company detail:", error);
      throw error;
    }
  },

  fetchFollowStatus: async (id) => {
    try {
      const response = await CompanyAPI.getFollowStatus(id);
      return Boolean(response?.data ?? response);
    } catch (error) {
      console.error("Error fetching follow status:", error);
      throw error;
    }
  },

  toggleFollowCompany: async (id) => {
    try {
      const response = await CompanyAPI.toggleFollow(id);
      return Boolean(response?.data ?? response);
    } catch (error) {
      console.error("Error toggling company follow:", error);
      throw error;
    }
  },

  fetchFollowedCompanies: async () => {
    try {
      const response = await CompanyAPI.getFollowedCompanies();
      return response?.data ?? response ?? [];
    } catch (error) {
      console.error("Error fetching followed companies:", error);
      throw error;
    }
  },
};
