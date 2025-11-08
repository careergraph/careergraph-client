// src/services/api/location.js

/**
 * API bên ngoài để lấy danh sách tỉnh thành Việt Nam
 * Sử dụng API công khai: https://provinces.open-api.vn/api/
 */
export const LocationAPI = {
  /**
   * Lấy danh sách tất cả tỉnh thành từ API công khai
   * @returns {Promise<Array>} Danh sách tỉnh thành
   */
  async getProvinces() {
    try {
      const response = await fetch('https://provinces.open-api.vn/api/p/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching provinces:", error);
      throw error;
    }
  },

  /**
   * Lấy danh sách quận/huyện theo tỉnh từ API công khai
   * @param {string} provinceCode - Mã code của tỉnh
   * @returns {Promise<Object>} Thông tin tỉnh kèm danh sách quận/huyện
   */
  async getDistricts(provinceCode) {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching districts:", error);
      throw error;
    }
  },

  /**
   * Lấy danh sách phường/xã theo quận/huyện từ API công khai
   * @param {string} districtCode - Mã code của quận/huyện
   * @returns {Promise<Object>} Thông tin quận/huyện kèm danh sách phường/xã
   */
  async getWards(districtCode) {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching wards:", error);
      throw error;
    }
  },
};
