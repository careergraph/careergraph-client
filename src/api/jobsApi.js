// src/api/jobsApi.js
// Hàm gọi API lấy danh sách jobs từ backend
import { apiConfig } from "../config";

// Get all jobs with paging
export async function getJobs({ page = 0, size = 10 }) {
  const url = `${apiConfig.baseURL}${apiConfig.endpoints.jobs.list}?page=${page}&size=${size}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // để gửi cookie nếu cần
  });
  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return response.json();
}

// Get all catogories of job
export async function getJobCategories() {
  const url = `${apiConfig.baseURL}${apiConfig.endpoints.jobs.categories}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // để gửi cookie nếu cần
  });
  if (!response.ok) {
    throw new Error("Failed to fetch job categories");
  }
  return response.json();
}
