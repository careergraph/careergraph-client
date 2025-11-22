import { apiConfig } from "~/config";
import { http } from "../http/request";

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, value);
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const MediaAPI = {
  upload({ file, ownerType, idd, fileType }) {
    if (!file) {
      return Promise.reject(new Error("Missing file to upload"));
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("ownerType", ownerType ?? "candidate");
    if (idd) formData.append("idd", idd);
    if (fileType) formData.append("fileType", fileType);

    return http(apiConfig.endpoints.media.upload, {
      method: "POST",
      body: formData,
    });
  },

  list({ ownerType, idd, fileType }) {
    const query = buildQuery({ ownerType, idd, fileType });
    return http(`${apiConfig.endpoints.media.list}${query}`, {
      method: "GET",
    });
  },

  delete({ publicId }) {
    const url = `${apiConfig.endpoints.media.base}?publicId=${encodeURIComponent(
      publicId
    )}`;

    return http(url, {
      method: "DELETE",
    });
  },
};
