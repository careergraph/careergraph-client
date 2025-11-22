import { MediaAPI } from "./api/media";

const ACCEPTED_RESUME_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

export const MediaService = {
  ACCEPTED_MIME_TYPES: ACCEPTED_RESUME_TYPES,

  async uploadResume({ file, candidateId }) {
    if (!file) {
      throw new Error("Chưa chọn tệp CV");
    }

    const response = await MediaAPI.upload({
      file,
      ownerType: "candidate",
      idd: candidateId,
      fileType: "RESUME",
    });

    const data = response?.data ?? response;
    // const url = data?.url || data?.secureUrl;

    // if (!url) {
    //   throw new Error("Không nhận được đường dẫn CV từ máy chủ");
    // }

    return {
      id: data?.id,
      url: data?.filePath || data?.url,
      name: data?.publicId?.split("/")?.pop() || data?.fileName || data?.url?.split("/")?.pop() || "CV",
      uploadedAt: data?.createdAt, 
    };
  },

  async listResumes({ candidateId }) {
    if (!candidateId) return [];

    const response = await MediaAPI.list({
      ownerType: "candidate",
      idd: candidateId,
      fileType: "RESUME",
    });

    const records = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];

    return records.map((record, index) => ({
      id: record?.id || `${record?.url || "resume"}-${index}`,
      url: record?.filePath || record?.url,
      name: record?.publicId?.split("/")?.pop() || record?.fileName || record?.url?.split("/")?.pop() || "CV",
      uploadedAt: record?.createdAt, 
    })).filter((item) => Boolean(item.url));
  },

   async deleteResume({ publicId }) {
    if (!publicId) throw new Error("Missing publicId to delete");

    const resp = await MediaAPI.delete({ publicId });
    const data = resp?.data ?? resp;

    return data; // { publicId: "...", deleted: true/false }
  },

  
};
