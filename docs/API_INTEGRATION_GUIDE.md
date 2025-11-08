# Hướng Dẫn Integrate API - JobDetail Page

## 📋 Tổng Quan

File này giải thích chi tiết cách integrate API Get Job Detail vào trang JobDetail. 
Bạn có thể áp dụng pattern này cho các trang khác.

---

## 🏗️ Kiến Trúc Tổng Thể

```
┌─────────────────┐
│  JobDetail.jsx  │ ← Component chính (UI Layer)
└────────┬────────┘
         │ gọi
         ↓
┌─────────────────┐
│  JobService.js  │ ← Business Logic Layer
└────────┬────────┘
         │ gọi
         ↓
┌─────────────────┐
│   JobAPI.js     │ ← API Layer (HTTP requests)
└────────┬────────┘
         │ gọi
         ↓
┌─────────────────┐
│   http/request  │ ← HTTP Client (axios wrapper)
└────────┬────────┘
         │
         ↓
    Backend API
```

---

## 📝 BƯỚC 1: Setup API Endpoint

### File: `src/config/index.js`

```javascript
export const apiConfig = {
  baseURL: "http://localhost:8080/careergraph/api/v1",
  endpoints: {
    jobs: {
      detail: "/jobs/:id",  // ← Endpoint cho job detail
    },
  },
};
```

**Giải thích:**
- `:id` là dynamic parameter, sẽ được replace bằng job ID thực tế
- VD: `/jobs/7a430bd1-95cd-4ee0-9ae8-f461a8487be6`

---

## 📝 BƯỚC 2: Tạo API Function

### File: `src/services/api/job.js`

```javascript
export const JobAPI = {
  /**
   * Gọi API lấy chi tiết việc làm theo id
   * @param {string} id - Job ID
   * @param {object} options - Options (signal để cancel request)
   * @returns {Promise} Response từ API
   */
  getJobDetail(id, { signal } = {}) {
    // Validate input
    if (!id) {
      return Promise.reject(new Error("Job id is required"));
    }

    // Replace :id trong endpoint bằng id thực tế
    const path = apiConfig.endpoints.jobs.detail.replace(":id", id);
    // VD: "/jobs/:id" → "/jobs/7a430bd1-..."

    // Gọi HTTP request
    return http(path, {
      method: "GET",        // HTTP method
      auth: false,          // Không cần authentication
      signal,               // AbortSignal để cancel request
    });
  },
};
```

**Giải thích:**
- `signal`: Dùng để hủy request khi component unmount (tránh memory leak)
- `auth: false`: API này public, không cần JWT token
- Return Promise → có thể dùng async/await

---

## 📝 BƯỚC 3: Tạo Service Layer

### File: `src/services/jobService.js`

```javascript
/**
 * Gọi API chi tiết và trả về job đã chuẩn hoá
 * @param {string} id - Job ID
 * @param {object} options - Options
 * @returns {Promise<object|null>} Job object hoặc null nếu lỗi
 */
const fetchJobDetail = async (id, options = {}) => {
  if (!id) return null;

  try {
    // 1. Gọi API
    const response = await JobAPI.getJobDetail(id, options);
    
    // 2. Unwrap data từ response
    // Response có dạng: { status: "OK", data: {...} }
    // Cần extract ra object job bên trong
    const rawJob = unwrapJobDetail(response);
    
    if (!rawJob) return null;
    
    // 3. Normalize data
    // Convert data từ backend sang format chuẩn của frontend
    return normalizeJob(rawJob);
    
  } catch (error) {
    // Bỏ qua lỗi khi request bị cancel
    if (error?.code === "ERR_CANCELED") {
      return null;
    }
    
    console.error(`Không thể lấy chi tiết việc làm (${id}):`, error);
    return null;
  }
};

export const JobService = {
  fetchJobDetail(id, options) {
    return fetchJobDetail(id, options);
  },
};
```

**Tại sao cần Service Layer?**
- **Separation of Concerns**: Tách logic business ra khỏi component
- **Reusability**: Có thể dùng lại ở nhiều component
- **Data Normalization**: Chuẩn hóa data trước khi đưa vào UI
- **Error Handling**: Xử lý lỗi tập trung

---

## 📝 BƯỚC 4: Data Normalization

### File: `src/utils/jobFormat.js`

```javascript
/**
 * Chuẩn hóa job object từ backend sang format frontend
 * @param {object} job - Raw job data từ API
 * @returns {object} Normalized job object
 */
const normalizeJob = (job = {}) => {
  return {
    // ID: Lấy từ nhiều field có thể, fallback về random UUID
    id: normalizeId(job),
    
    // Title: Lấy từ title hoặc name, fallback về "Đang cập nhật"
    title: safeText(job.title || job.name) || "Đang cập nhật",
    
    // Company name
    company: safeText(job.company || job.companyName) || "Đang cập nhật",
    
    // Location: Format từ specific/district/city/state
    location: formatLocation(job),
    
    // Salary: Format từ salaryRange hoặc min/max
    salaryRange: formatSalary(job),
    
    // Experience: Parse min/max/level
    experience: normalizeExperience(job),
    
    // Arrays: Convert sang mảng string sạch
    responsibilities: toCleanArray(job.responsibilities),
    qualifications: toCleanArray(job.qualifications),
    
    // Contact info
    contact: {
      email: safeText(job.contactEmail),
      phone: safeText(job.contactPhone),
    },
    
    // ... các field khác
  };
};
```

**Tại sao cần Normalize?**
- Backend có thể trả về nhiều format khác nhau
- Frontend cần format nhất quán để render UI
- Dễ debug và maintain hơn

---

## 📝 BƯỚC 5: Integrate vào Component

### File: `src/pages/JobDetail.jsx`

```javascript
export default function JobDetailPage() {
  // 1. Lấy ID từ URL
  const { id } = useParams();
  
  // 2. Khai báo state
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 3. useEffect để gọi API
  useEffect(() => {
    // AbortController để cancel request khi unmount
    const controller = new AbortController();
    
    const loadJobDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Gọi API thông qua Service
        const data = await JobService.fetchJobDetail(id, {
          signal: controller.signal,
        });
        
        if (!data) {
          throw new Error("Không tìm thấy thông tin công việc");
        }
        
        setJob(data);
      } catch (err) {
        // Bỏ qua nếu request bị cancel
        if (err.name === "AbortError" || err?.code === "ERR_CANCELED") {
          return;
        }
        
        console.error("Lỗi:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadJobDetail();
    
    // Cleanup: Cancel request khi unmount
    return () => {
      controller.abort();
    };
  }, [id]); // Re-run khi id thay đổi
  
  // 4. Render các trạng thái
  if (loading) return <LoadingUI />;
  if (error) return <ErrorUI error={error} />;
  if (!job) return <NotFoundUI />;
  
  // 5. Render UI với data
  return <JobDetailUI job={job} />;
}
```

---

## 🔄 Flow Hoàn Chỉnh

```
User vào trang /job/abc123
        ↓
useParams() lấy id = "abc123"
        ↓
useEffect() chạy
        ↓
JobService.fetchJobDetail("abc123")
        ↓
JobAPI.getJobDetail("abc123")
        ↓
http.get("/jobs/abc123")
        ↓
Backend API trả về response
        ↓
unwrapJobDetail(response) → rawJob
        ↓
normalizeJob(rawJob) → normalizedJob
        ↓
setJob(normalizedJob)
        ↓
Component re-render với data mới
```

---

## 🛠️ Các Pattern Quan Trọng

### 1. **AbortController Pattern**
```javascript
const controller = new AbortController();

// Pass signal vào fetch
fetch(url, { signal: controller.signal });

// Cancel khi unmount
return () => controller.abort();
```

**Tại sao?** Tránh memory leak khi user chuyển trang nhanh.

---

### 2. **Try-Catch-Finally Pattern**
```javascript
try {
  setLoading(true);
  const data = await fetchData();
  setData(data);
} catch (error) {
  setError(error);
} finally {
  setLoading(false); // Luôn chạy
}
```

**Tại sao?** Đảm bảo loading state được set đúng.

---

### 3. **Null Safety Pattern**
```javascript
// Thay vì:
const name = job.company.name; // ❌ Crash nếu company null

// Dùng optional chaining:
const name = job?.company?.name || "Default"; // ✅ Safe
```

---

### 4. **Early Return Pattern**
```javascript
if (loading) return <Loading />;
if (error) return <Error />;
if (!data) return <NotFound />;

// Main render ở dưới
return <MainUI />;
```

**Tại sao?** Code dễ đọc, tránh nested if-else.

---

## 📊 Response Structure

### Backend Response
```json
{
  "status": "OK",
  "message": "Job retrieved successfully",
  "data": {
    "id": "7a430bd1-95cd-4ee0-9ae8-f461a8487be6",
    "title": "Senior Java Developer",
    "description": "We are looking for...",
    "responsibilities": ["Design APIs", "Collaborate"],
    "qualifications": ["Bachelor's degree", "3+ years"],
    "minExperience": 3,
    "maxExperience": 6,
    "salaryRange": "30,000,000 - 45,000,000 VND",
    "contactEmail": "hr@techcorp.vn",
    "contactPhone": "0987654321",
    ...
  }
}
```

### After Normalization
```javascript
{
  id: "7a430bd1-95cd-4ee0-9ae8-f461a8487be6",
  title: "Senior Java Developer",
  company: "Tech Corp",
  location: "TP. Hồ Chí Minh",
  salaryRange: "30,000,000 - 45,000,000 VND",
  experience: {
    min: 3,
    max: 6,
    level: "SENIOR"
  },
  responsibilities: ["Design APIs", "Collaborate"],
  qualifications: ["Bachelor's degree", "3+ years"],
  contact: {
    email: "hr@techcorp.vn",
    phone: "0987654321"
  },
  ...
}
```

---

## 🎯 Áp Dụng Cho API Khác

### Ví dụ: Get User Profile

1. **Config endpoint:**
```javascript
// src/config/index.js
user: {
  profile: "/users/:id"
}
```

2. **API function:**
```javascript
// src/services/api/user.js
export const UserAPI = {
  getUserProfile(id, { signal } = {}) {
    const path = apiConfig.endpoints.user.profile.replace(":id", id);
    return http(path, {
      method: "GET",
      auth: true, // ← Cần authentication
      signal,
    });
  },
};
```

3. **Service:**
```javascript
// src/services/userService.js
export const UserService = {
  async fetchUserProfile(id, options = {}) {
    try {
      const response = await UserAPI.getUserProfile(id, options);
      const rawUser = unwrapUserData(response);
      return normalizeUser(rawUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },
};
```

4. **Component:**
```javascript
// src/pages/UserProfile.jsx
const { id } = useParams();
const [user, setUser] = useState(null);

useEffect(() => {
  const controller = new AbortController();
  
  const loadUser = async () => {
    const data = await UserService.fetchUserProfile(id, {
      signal: controller.signal,
    });
    setUser(data);
  };
  
  loadUser();
  return () => controller.abort();
}, [id]);
```

---

## ⚠️ Common Mistakes

### ❌ Không cleanup
```javascript
useEffect(() => {
  fetchData();
  // Missing cleanup!
}, []);
```

### ✅ Đúng cách
```javascript
useEffect(() => {
  const controller = new AbortController();
  fetchData({ signal: controller.signal });
  return () => controller.abort(); // ← Cleanup
}, []);
```

---

### ❌ Quên handle loading/error states
```javascript
const [data, setData] = useState(null);

useEffect(() => {
  fetchData().then(setData);
}, []);

return <div>{data.title}</div>; // ❌ Crash nếu data null
```

### ✅ Đúng cách
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  fetchData()
    .then(setData)
    .finally(() => setLoading(false));
}, []);

if (loading) return <Loading />;
if (!data) return <NotFound />;

return <div>{data.title}</div>; // ✅ Safe
```

---

## 📚 Tài Liệu Tham Khảo

- **React Hooks:** https://react.dev/reference/react
- **AbortController:** https://developer.mozilla.org/en-US/docs/Web/API/AbortController
- **Optional Chaining:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining

---

## 🎓 Bài Tập Thực Hành

### Bài 1: Integrate API Get All Companies
- Endpoint: `GET /companies`
- Tạo CompanyService.fetchAllCompanies()
- Hiển thị list companies với loading/error states

### Bài 2: Integrate API Search Jobs
- Endpoint: `GET /jobs/search?keyword=...`
- Tạo JobService.searchJobs(keyword)
- Implement debounce search input

### Bài 3: Integrate API Apply Job
- Endpoint: `POST /jobs/:id/apply`
- Tạo JobService.applyJob(jobId, cvData)
- Handle success/error toast notifications

---

**Chúc bạn học tốt! 🚀**
