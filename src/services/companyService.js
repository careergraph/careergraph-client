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
};
