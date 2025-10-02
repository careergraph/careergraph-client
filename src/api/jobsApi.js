// src/api/jobsApi.js
import axios from "axios";
import { apiConfig } from "../config";

// Tạo instance axios để tái sử dụng
const api = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // tương đương credentials: "include"
});

// Get all jobs with paging
export async function getJobs({ page = 0, size = 10 }) {
  try {
    const response = await api.get(apiConfig.endpoints.jobs.list, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw new Error("Failed to fetch jobs");
  }
}

// Get all categories of job
export async function getJobCategories() {
  try {
    const response = await api.get(apiConfig.endpoints.jobs.categories);
    return response.data;
  } catch (error) {
    console.error("Error fetching job categories:", error);
    throw new Error("Failed to fetch job categories");
  }
}

// Get popular jobs
export async function getPopularJobs() {
  try {
    const response = await api.get(apiConfig.endpoints.jobs.popular);
    return response.data;
  } catch (error) {
    console.error("Error fetching popular jobs:", error);
    throw new Error("Failed to fetch popular jobs");
  }
}

// Get personalized jobs: dựa vào profile user (cần token)
export async function getPersonalizedJobs({ token }) {
  try {
    const response = await api.get(apiConfig.endpoints.jobs.personalized, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching personalized jobs:", error);
    throw new Error("Failed to fetch personalized jobs");
  }
}
