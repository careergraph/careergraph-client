// src/services/locationService.js
import { LocationAPI } from "./api/location";

/**
 * Normalize một province object từ API công khai
 * API trả về format: { code: 1, name: "Thành phố Hà Nội", ... }
 */
const normalizeProvince = (province) => {
  if (!province) return null;

  return {
    id: String(province.code),
    code: String(province.code),
    name: province.name || "",
    // Rút gọn tên (bỏ "Thành phố", "Tỉnh")
    shortName: province.name
      ?.replace(/^(Thành phố|Tỉnh)\s+/i, "")
      .trim() || province.name,
  };
};

/**
 * Normalize một district object từ API công khai
 */
const normalizeDistrict = (district) => {
  if (!district) return null;

  return {
    id: String(district.code),
    code: String(district.code),
    name: district.name || "",
    shortName: district.name
      ?.replace(/^(Quận|Huyện|Thành phố|Thị xã)\s+/i, "")
      .trim() || district.name,
  };
};

/**
 * Service xử lý location với API bên ngoài
 */
export const LocationService = {
  /**
   * Lấy danh sách tỉnh thành từ API công khai
   * @returns {Promise<Array>} Mảng các tỉnh thành đã normalize
   */
  async fetchProvinces() {
    try {
      const provinces = await LocationAPI.getProvinces();

      if (!Array.isArray(provinces)) {
        return [];
      }

      return provinces.map(normalizeProvince).filter(Boolean);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tỉnh thành:", error);
      return [];
    }
  },

  /**
   * Lấy danh sách quận/huyện theo tỉnh từ API công khai
   * @param {string} provinceCode - Mã code của tỉnh
   * @returns {Promise<Array>} Mảng các quận/huyện đã normalize
   */
  async fetchDistricts(provinceCode) {
    if (!provinceCode) return [];

    try {
      const data = await LocationAPI.getDistricts(provinceCode);
      const districts = data?.districts || [];

      if (!Array.isArray(districts)) {
        return [];
      }

      return districts.map(normalizeDistrict).filter(Boolean);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quận/huyện:", error);
      return [];
    }
  },

  /**
   * Lấy danh sách phường/xã theo quận/huyện từ API công khai
   * @param {string} districtCode - Mã code của quận/huyện
   * @returns {Promise<Array>} Mảng các phường/xã đã normalize
   */
  async fetchWards(districtCode) {
    if (!districtCode) return [];

    try {
      const data = await LocationAPI.getWards(districtCode);
      const wards = data?.wards || [];

      if (!Array.isArray(wards)) {
        return [];
      }

      return wards.map((ward) => ({
        id: String(ward.code),
        code: String(ward.code),
        name: ward.name || "",
        shortName: ward.name
          ?.replace(/^(Phường|Xã|Thị trấn)\s+/i, "")
          .trim() || ward.name,
      })).filter(Boolean);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phường/xã:", error);
      return [];
    }
  },
};
