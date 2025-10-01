import { MapPin, Briefcase, GraduationCap, Calendar, Heart, Building2 } from "lucide-react";
import Breadcrumbs from "~/components/Navigate/Breadcrumbs";
import JobHeader from "~/sections/JobDetail/JobHeader";
import CompanyCard from "~/sections/JobDetail/CompanyCard";
import SimilarJobsList from "~/sections/JobDetail/SimilarJobsList";
import JobSections from "~/sections/JobDetail/JobSections";

const job = {
  title: "Nam Nhân Viên Kế Toán Văn Phòng (Quận Gò Vấp)",
  salary: "7 - 10 triệu",
  location: "TP.HCM",
  exp: "Không yêu cầu",
  level: "Cao đẳng",
  deadline: "20/09/2025",
};

const company = {
  name: "Công Ty Cổ Phần Xây Dựng - Dịch Vụ - Thương Mại Huy Đồng",
  address: "23 Đường số 3, KDC Cityland, Phường 10, Quận Gò Vấp, TP Hồ Chí Minh",
  size: "10 - 150 nhân viên",
  logo: "https://placehold.co/64x64?text=Logo",
  link: "#",
};

const similarJobs = [
  {
    id: "1",
    title: "Nhân Viên Kế Toán - Nam",
    company: "Công Ty CP Nha Khoa Bình An",
    salary: "8 - 12 triệu",
    location: "TP.HCM",
    days: "Còn 7 ngày",
    logo: "https://placehold.co/40x40?text=BA",
  },
  {
    id: "2",
    title: "Nhân Viên Nữ Kế Toán Nội Bộ (Quận Gò Vấp)",
    company: "Công Ty TNHH Nội Thất Tân Á",
    salary: "12 - 15 triệu",
    location: "TP.HCM",
    days: "Còn 10 ngày",
    logo: "https://placehold.co/40x40?text=TA",
  },
  {
    id: "3",
    title: "Nhân Viên Kế Toán - Gò Vấp Đi Làm Ngay",
    company: "Công Ty TNHH Thương Mại Dịch Vụ X",
    salary: "9 - 12 triệu",
    location: "TP.HCM",
    days: "Còn 33 ngày",
    logo: "https://placehold.co/40x40?text=X",
  },
];

const sectionsFromDB = [
  {
    key: "desc",
    items: [
      "Thực hiện việc lập hóa đơn và xử lý sai sót phát sinh.",
      "Đối chiếu kiểm tra chứng từ mua bán hàng hoá, xuất – nhập hoá đơn GTGT.",
      "Kiểm soát và thanh toán công nợ.",
      "Quản lý theo dõi báo cáo xuất, nhập, tồn kho.",
      "Lưu trữ chứng từ, hồ sơ kế toán.",
      "Soạn thảo văn bản hành chính và các công việc khác do cấp trên giao.",
      "Làm việc T2 - T6, T7 làm việc buổi sáng."
    ]
  },
  {
    key: "requirements",
    items: [
      "Nam tốt nghiệp Cao đẳng hoặc Đại học chuyên ngành Kế toán.",
      "Nắm vững nguyên lý kế toán – thuế; cẩn thận, trung thực.",
      "Kỹ năng trình bày & giao tiếp mạch lạc; biết quản lý thời gian."
    ]
  },
  {
    key: "benefits",
    items: [
      `Thu nhập ${job.salary} (trao đổi khi phỏng vấn).`,
      "Được đào tạo trong quá trình làm việc, môi trường thân thiện.",
      "Chế độ BHXH/BHYT/BHTN theo Luật Lao động, nghỉ lễ tết."
    ]
  }
];

export default function JobDetailPage() {

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-1 mt-2">
      <Breadcrumbs
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Việc làm", href: "/jobs" },
          { label: "Kế Toán", href: "/jobs?category=ke-toan" },
          { label: job.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <JobHeader
            title={job.title}
            highlights={[
              { icon: <Briefcase size={14} />, label: "Mức lương", value: job.salary },
              { icon: <MapPin size={18} />, label: "Khu vực tuyển", value: job.location },
              { icon: <Calendar size={18} />, label: "Kinh nghiệm", value: job.exp },
              { icon: <GraduationCap size={18} />, label: "Trình độ", value: job.level },
            ]}
            extra={
              <div className="text-sm text-slate-500">
                Hạn nộp hồ sơ: <span className="font-medium">{job.deadline}</span> • Lấy hồ sơ đầu tiên nộp tops!
              </div>
            }
          />

            <JobSections sections={sectionsFromDB} />
        </div>

        <aside className="lg:col-span-1 space-y-6">
          <CompanyCard
            logo={company.logo}
            name={company.name}
            address={company.address}
            size={company.size}
            link={company.link}
            icon={<Building2 size={18} />}
          />
          <SimilarJobsList title="Việc làm tương tự cho bạn" items={similarJobs} />
        </aside>
      </div>
    </div>
  );
}
