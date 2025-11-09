import {
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Building2,
} from "lucide-react";
import JobHeader from "~/sections/JobDetail/JobHeader";
import CompanyCard from "~/sections/JobDetail/CompanyCard";
import SimilarJobsList from "~/sections/JobDetail/SimilarJobsList";
import CtaBanner from "~/sections/JobDetail/CtaBanner";
import JobSections from "~/sections/JobDetail/JobSections";
import LoadingSpinner from "~/components/Feedback/LoadingSpinner";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { JobService } from "~/services/jobService";
import ApplyDialog from "~/sections/JobDetail/ApplyDialog";

// ==================== HELPER FUNCTIONS ====================

/**
 * Trích xuất tên thành phố từ địa chỉ đầy đủ
 * VD: "123 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh" → "TP. Hồ Chí Minh"
 */
const extractCityName = (fullAddress) => {
  if (!fullAddress) return "Đang cập nhật";
  const parts = fullAddress.split(",");
  return parts[parts.length - 1]?.trim() || fullAddress;
};

/**
 * Format kinh nghiệm làm việc
 * - Ưu tiên hiển thị level (FRESHER, JUNIOR, SENIOR...)
 * - Nếu không có level, hiển thị số năm (min-max hoặc min+)
 * - Trả về "Không yêu cầu" nếu không có thông tin
 */
const formatExperience = (experienceData) => {
  const { min, max, level } = experienceData || {};

  // Mapping level sang tiếng Việt
  if (level) {
    const LEVEL_LABELS = {
      FRESHER: "Fresher",
      JUNIOR: "Junior",
      MIDDLE: "Middle",
      SENIOR: "Senior",
      LEADER: "Leader",
    };
    return LEVEL_LABELS[level] || level;
  }

  // Hiển thị range năm kinh nghiệm
  if (min !== null && max !== null) {
    return `${min} - ${max} năm`;
  }

  // Chỉ có minimum
  if (min !== null) {
    return `${min}+ năm`;
  }

  return "Không yêu cầu";
};

/**
 * Format trình độ học vấn
 * Mapping các giá trị enum sang tiếng Việt
 */
const formatEducation = (educationLevel) => {
  if (!educationLevel) return "Không yêu cầu";

  const EDUCATION_LABELS = {
    HIGH_SCHOOL: "Trung học",
    ASSOCIATE_DEGREE: "Cao đẳng",
    BACHELORS_DEGREE: "Đại học",
    MASTERS_DEGREE: "Thạc sĩ",
    DOCTORATE: "Tiến sĩ",
    OTHER: "Khác",
  };

  return EDUCATION_LABELS[educationLevel] || educationLevel;
};

/**
 * Format ngày đăng tin thành dạng tương đối
 * VD: "hôm nay", "2 ngày trước", "3 tuần trước"
 */
const formatPostedDate = (dateString) => {
  if (!dateString) return null;

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = Math.abs(now - date);
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "hôm nay";
  if (diffDays === 1) return "hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;

  return date.toLocaleDateString("vi-VN");
};

/**
 * Format deadline thành định dạng ngày/tháng/năm
 */
const formatDeadline = (dateString) => {
  if (!dateString) return "Đang cập nhật";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

/**
 * Tạo danh sách các section hiển thị (mô tả, yêu cầu, quyền lợi...)
 * Tự động lọc bỏ các section không có dữ liệu
 */
const buildJobSections = (job) => {
  const sections = [
    // Mô tả công việc
    job.description && {
      key: "desc",
      items: [job.description],
    },
    // Trách nhiệm (nếu có riêng)
    job.responsibilities?.length > 0 && {
      key: "responsibilities",
      items: job.responsibilities,
    },
    // Yêu cầu công việc
    job.qualifications?.length > 0 && {
      key: "requirements",
      items: job.qualifications,
    },
    // Yêu cầu tối thiểu (nếu khác với yêu cầu chung)
    job.minimumQualifications?.length > 0 &&
      job.minimumQualifications !== job.qualifications && {
        key: "qualifications",
        items: job.minimumQualifications,
      },
    // Quyền lợi
    job.benefits?.length > 0 && {
      key: "benefits",
      items: job.benefits,
    },
  ].filter(Boolean); // Loại bỏ các giá trị null/undefined

  // Fallback nếu không có section nào
  if (sections.length === 0) {
    return [
      {
        key: "desc",
        items: ["Đang cập nhật thông tin công việc..."],
      },
    ];
  }

  return sections;
};

/**
 * Tạo danh sách tags (nhãn) từ thông tin job
 */
const buildTags = (job) => {
  return [
    job.department, // Phòng ban
    job.jobCategory, // Danh mục công việc
    job.remoteJob && "Remote", // Remote nếu có
  ].filter(Boolean);
};

/**
 * Tạo object thông tin công ty để hiển thị trong sidebar
 */
const buildCompanyInfo = (job) => {
  return {
    name: job.companyName || "Đang cập nhật",
    address: job.address || job.location || "Đang cập nhật",
    size: job.companySize || "Đang cập nhật",
    logo: job.companyAvatar || "https://placehold.co/64x64?text=Logo",
    link: "#", // TODO: Lấy từ API khi có
  };
};

// ==================== MAIN COMPONENT ====================
export default function JobDetailPage() {
  // Lấy job ID từ URL parameters
  const { id } = useParams();

  // State management
  const [job, setJob] = useState(null); // Dữ liệu job
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Lỗi nếu có

  // ==================== STATE MANAGEMENT ====================
  // State cho danh sách việc làm của công ty
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loadingCompanyJobs, setLoadingCompanyJobs] = useState(false);

  // State cho danh sách việc làm tương tự
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loadingSimilarJobs, setLoadingSimilarJobs] = useState(false);

  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  // ==================== LOAD DỮ LIỆU TỪ API ====================
  useEffect(() => {
    let isMounted = true;

    // Hàm gọi API lấy jobs của công ty
    const fetchCompanyJobs = async (companyId) => {
      try {
        setLoadingCompanyJobs(true);
        const response = await JobService.fetchJobsByCompany(companyId, { size: 5 });
        if (!isMounted) return;
        setCompanyJobs(response.jobs);
      } catch (err) {
        console.error("Error loading company jobs:", err);
        if (!isMounted) return;
        setCompanyJobs([]);
      } finally {
        if (isMounted) {
          setLoadingCompanyJobs(false);
        }
      }
    };

    // Hàm gọi API lấy jobs tương tự
    const fetchSimilarJobs = async (jobId) => {
      try {
        setLoadingSimilarJobs(true);
        const response = await JobService.fetchSimilarJobs(jobId, { size: 5 });
        if (!isMounted) return;
        setSimilarJobs(response.jobs);
      } catch (err) {
        console.error("Error loading similar jobs:", err);
        if (!isMounted) return;
        setSimilarJobs([]);
      } finally {
        if (isMounted) {
          setLoadingSimilarJobs(false);
        }
      }
    };

    // Hàm chính load job detail
    const fetchJobData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Gọi API lấy chi tiết job
        const data = await JobService.fetchJobDetail(id);

        if (!isMounted) return; // Don't update if unmounted

        if (!data) {
          throw new Error("Không tìm thấy thông tin công việc");
        }

        setJob(data);

        // ==================== GỌI 2 API BỔ SUNG ====================
        // Sau khi có thông tin job, gọi thêm 2 API:

        // 1️⃣ API lấy các job khác của công ty (dựa vào companyId)
        if (data.companyId) {
          fetchCompanyJobs(data.companyId);
        }

        // 2️⃣ API lấy các job tương tự (dựa vào jobId)
        fetchSimilarJobs(id);

      } catch (err) {
        if (!isMounted) return;
        console.error("Error loading job detail:", err);
        setError(err.message || "Đã có lỗi xảy ra");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJobData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [id]); // Chỉ depend vào id, không cần functions!

  // ==================== SCROLL TO TOP KHI VÀO TRANG ====================
  // Đảm bảo luôn scroll về đầu trang khi xem chi tiết job
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // ==================== RENDER: LOADING STATE ====================
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 mt-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner
            message="Đang tải thông tin công việc..."
            variant="inline"
            size="lg"
          />
        </div>
      </div>
    );
  }

  // ==================== RENDER: ERROR STATE ====================
  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 mt-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-red-500">
              <svg
                className="h-full w-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Không thể tải thông tin công việc
            </h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER: EMPTY STATE ====================
  if (!job) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 mt-2">
        <div className="text-center">
          <p className="text-slate-600">Không tìm thấy thông tin công việc</p>
        </div>
      </div>
    );
  }

  // ==================== CHUẨN BỊ DỮ LIỆU HIỂN THỊ ====================
  const cityName = extractCityName(job.location);
  const experienceText = formatExperience(job.experience);
  const educationText = formatEducation(job.education);
  const postedDateText = formatPostedDate(job.postedDate);
  const deadlineText = formatDeadline(job.expiryDate);
  const sections = buildJobSections(job);
  const tags = buildTags(job);
  const company = buildCompanyInfo(job);

  // Highlights - các thông tin nổi bật hiển thị dưới tiêu đề
  const highlights = [
    {
      icon: <Briefcase size={18} />,
      label: "Mức lương",
      value: job.salaryRange || "Thỏa thuận",
    },
    {
      icon: <MapPin size={18} />,
      label: "Khu vực",
      value: cityName,
    },
    {
      icon: <Calendar size={18} />,
      label: "Kinh nghiệm",
      value: experienceText,
    },
    {
      icon: <GraduationCap size={18} />,
      label: "Trình độ",
      value: educationText,
    },
  ];

  // Stats - thống kê (views, applicants, dates)
  const stats = {
    views: job.views || 0,
    applicants: job.applicants || 0,
    postedDate: postedDateText,
    deadline: deadlineText,
  };

  // ==================== RENDER: SUCCESS STATE ====================
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-1 mt-2">
      {/* 2-column layout: Nội dung chính (2/3) + Sidebar (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI - Nội dung chính */}
        <div className="lg:col-span-2">
          {/* Header: Tiêu đề + highlights + stats + tags */}
          <JobHeader
            title={job.title}
            highlights={highlights}
            stats={stats}
            tags={tags}
            onApply={() => setIsApplyDialogOpen(true)}
          />

          {/* Sections: Mô tả, yêu cầu, quyền lợi */}
          <JobSections sections={sections} />
        </div>

        {/* CỘT PHẢI - Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Thông tin công ty */}
          <CompanyCard
            logo={company.logo}
            name={company.name}
            address={company.address}
            size={company.size}
            link={company.link}
            icon={<Building2 size={18} />}
          />

          {/* Việc làm công ty đang tuyển */}
          <SimilarJobsList
            title="Việc làm công ty đang tuyển"
            items={loadingCompanyJobs ? [] : companyJobs}
            icon={<Building2 size={16} />}
            emptyMessage={
              loadingCompanyJobs
                ? "Đang tải..."
                : "Công ty chưa có tin tuyển dụng khác"
            }
          />

          {/* Việc làm tương tự */}
          <SimilarJobsList
            title="Việc làm tương tự"
            items={loadingSimilarJobs ? [] : similarJobs}
            icon={<Briefcase size={16} />}
            emptyMessage={
              loadingSimilarJobs
                ? "Đang tải..."
                : "Chưa có việc làm tương tự"
            }
          />
        </aside>
      </div>

      {/* ---------- Promotional CTA (full width, above footer) ---------- */}
      <CtaBanner job={job} />

      <ApplyDialog
        open={isApplyDialogOpen}
        onClose={() => setIsApplyDialogOpen(false)}
        jobId={id}
        jobTitle={job.title}
        coverLetterRequired={Boolean(job.applicationRequirements?.coverLetter)}
      />
    </div>
  );
}
