export const defaultCvData = {
  personal: {
    fullName: "Nguyễn Thị Minh Anh",
    headline: "Product Designer",
    summary:
      "Nhà thiết kế sản phẩm tập trung vào trải nghiệm người dùng, có hơn 5 năm kinh nghiệm xây dựng sản phẩm SaaS trong lĩnh vực giáo dục và nhân sự.",
    location: "Hà Nội, Việt Nam",
  },
  contact: {
    email: "minhanh.nguyen@email.com",
    phone: "+84 912 345 678",
    website: "www.minhanh.design",
    linkedin: "linkedin.com/in/minhanh",
  },
  experience: [
    {
      id: "exp-1",
      role: "Lead Product Designer",
      company: "Harvard Innovation Labs",
      location: "Boston, MA",
      startDate: "2022",
      endDate: "Hiện tại",
      bulletPoints: [
        "Dẫn dắt nhóm 4 designer xây dựng hệ sinh thái công cụ tuyển dụng cho hơn 120 trường đại học.",
        "Tăng tỷ lệ chuyển đổi ứng viên trên nền tảng thêm 32% thông qua cải tiến luồng ứng tuyển.",
      ],
    },
    {
      id: "exp-2",
      role: "Senior UX Designer",
      company: "CareerGraph",
      location: "TP. Hồ Chí Minh",
      startDate: "2019",
      endDate: "2022",
      bulletPoints: [
        "Thiết kế hệ thống quản lý CV giúp hơn 50.000 người dùng tối ưu hóa thông tin nghề nghiệp.",
        "Phối hợp với các nhóm sản phẩm để triển khai thư viện thành phần UI thống nhất.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "Harvard University",
      degree: "Master of Design Engineering",
      startDate: "2017",
      endDate: "2019",
    },
    {
      id: "edu-2",
      school: "Đại học Kiến trúc Hà Nội",
      degree: "Bachelor of Industrial Design",
      startDate: "2012",
      endDate: "2016",
    },
  ],
  skills: [
    { id: "skill-1", name: "Design Systems" },
    { id: "skill-2", name: "UX Research" },
    { id: "skill-3", name: "Interaction Design" },
    { id: "skill-4", name: "Prototyping" },
    { id: "skill-5", name: "Figma" },
    { id: "skill-6", name: "DesignOps" },
  ],
  languages: [
    { id: "lang-1", name: "Tiếng Việt" },
    { id: "lang-2", name: "Tiếng Anh" },
  ],
  awards: [
    {
      id: "award-1",
      title: "Top 10 Product Innovators",
      issuer: "Behance Vietnam",
      year: "2023",
    },
  ],
};

export const defaultSectionsVisibility = {
  summary: true,
  languages: true,
  awards: true,
};
