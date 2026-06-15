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
    name: "Cẩm nang",
    href: "/handbook",
    priority: "secondary",
  },
  {
    name: "Tiện ích",
    priority: "primary",
    subLinks: [
      {
        name: "Xây dựng CV",
        href: "/build-cv",
      },
      {
        name: "Mẫu CV",
        href: "/template-cv",
      },
      {
        name: "Định vị nghề nghiệp",
        href: "/personalized",
      },
    ],
  },
  {
    name: "Giới thiệu",
    href: "/about",
    priority: "secondary",
  },
];

export const primaryNavLinks = navLinks.filter((link) => link.priority !== "secondary");
export const secondaryNavLinks = navLinks.filter((link) => link.priority === "secondary");
