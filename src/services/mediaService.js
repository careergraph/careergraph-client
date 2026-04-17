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

    const url = data?.filePath || data?.url;
    if (!url) {
      throw new Error("Không nhận được đường dẫn CV từ máy chủ");
    }

    return {
      id: data?.id,
      publicId: data?.publicId,
      url,
      fileName: data?.fileName || data?.originalFileName || data?.name || "CV",
      originalFileName: data?.originalFileName || data?.fileName || data?.name || "CV",
      name: data?.fileName || data?.originalFileName || data?.name || "CV",
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
      publicId: record?.publicId,
      url: record?.filePath || record?.url,
      fileName: record?.fileName || record?.originalFileName || record?.name || "CV",
      originalFileName: record?.originalFileName || record?.fileName || record?.name || "CV",
      name: record?.fileName || record?.originalFileName || record?.name || "CV",
      uploadedAt: record?.createdAt, 
    })).filter((item) => Boolean(item.url));
  },

   async deleteResume({ publicId }) {
    if (!publicId) throw new Error("Missing publicId to delete");

    const resp = await MediaAPI.delete({ publicId });
    const data = resp?.data ?? resp;

    return data; // { publicId: "...", deleted: true/false }
  },

  async renameResume({ fileId, newName }) {
    if (!fileId) throw new Error("Missing fileId to rename");
    if (!newName || !newName.trim()) throw new Error("Tên CV không được để trống");

    const resp = await MediaAPI.rename({ fileId, newName: newName.trim() });
    const data = resp?.data ?? resp;

    return {
      id: data?.id,
      publicId: data?.publicId,
      url: data?.filePath || data?.url,
      fileName: data?.fileName || data?.name || newName.trim(),
      originalFileName: data?.originalFileName || newName.trim(),
      name: data?.fileName || data?.name || newName.trim(),
      uploadedAt: data?.createdAt,
    };
  },

  
};
