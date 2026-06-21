export const navLinks = [
  {
    name: "Trang chủ",
    href: "/home",
    priority: "primary",
  },
  {
    name: "Việc làm",
    href: "/jobs",
    priority: "primary",
  },
  {
    name: "Tạo CV",
    href: "/template-cv",
    priority: "primary",
  },
  {
    name: "NTD bạn quan tâm",
    href: "/employers/following",
    priority: "secondary",
  },
  // {
  //   name: "Cẩm nang",
  //   href: "/handbook",
  //   priority: "secondary",
  // },
  {
    name: "Giới thiệu",
    href: "/about",
    priority: "secondary",
  },
  {
    name: "Điều khoản",
    href: "",
    priority: "secondary",
  },
];

export const primaryNavLinks = navLinks.filter(
  (link) => link.priority !== "secondary",
);
export const secondaryNavLinks = navLinks.filter(
  (link) => link.priority === "secondary",
);
