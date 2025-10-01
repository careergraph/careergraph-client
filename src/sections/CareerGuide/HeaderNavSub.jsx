// // src/components/HeaderNav.jsx
// import React, { useEffect, useRef, useState } from "react";

// const NAV = [
//   {
//     key: "compass",
//     label: "La Bàn Sự Nghiệp",
//     href: "/career-guide/compass",
//     children: [
//       { label: "Định hướng ngành nghề", href: "/career-guide/compass/career-orientation" },
//       { label: "Khám phá bản thân", href: "/career-guide/compass/self-discovery" },
//       { label: "Lộ trình thăng tiến", href: "/career-guide/compass/growth-roadmap" },
//     ],
//   },
//   {
//     key: "skills",
//     label: "Trạm Sạc Kỹ Năng",
//     href: "/career-guide/skills",
//     children: [
//       { label: "Kỹ năng mềm", href: "/career-guide/skills/soft-skills" },
//       { label: "Kỹ năng công việc", href: "/career-guide/skills/job-skills" },
//       { label: "Công cụ & Template", href: "/career-guide/skills/resources" },
//     ],
//   },
//   {
//     key: "talent",
//     label: "Tọa Độ Nhân Tài",
//     href: "/career-guide/talent",
//     children: [
//       { label: "Chân dung nghề", href: "/career-guide/talent/role-profiles" },
//       { label: "Câu chuyện người làm nghề", href: "/career-guide/talent/stories" },
//     ],
//   },
//   {
//     key: "office",
//     label: "Bàn Tròn Công Sở",
//     href: "/career-guide/office",
//     children: [
//       { label: "Văn hoá công sở", href: "/career-guide/office/culture" },
//       { label: "Quan hệ đồng nghiệp", href: "/career-guide/office/relationship" },
//       { label: "Quản lý & lãnh đạo", href: "/career-guide/office/leadership" },
//     ],
//   },
//   {
//     key: "kiosk",
//     label: "Kí Ốt Vui Vẻ",
//     href: "/career-guide/fun",
//     children: [
//       { label: "Meme công sở", href: "/career-guide/fun/memes" },
//       { label: "Minigame", href: "/career-guide/fun/minigame" },
//       { label: "Trắc nghiệm", href: "/career-guide/fun/quizzes" },
//     ],
//   },
//   {
//     key: "news",
//     label: "Loa tin tức",
//     href: "/career-guide/news",
//     children: [
//       { label: "Bản tin thị trường", href: "/career-guide/news/market" },
//       { label: "Tuyển dụng", href: "/career-guide/news/hiring" },
//       { label: "Sự kiện", href: "/career-guide/news/events" },
//     ],
//   },
// ];

// /* ---------------------- helpers ---------------------- */
// const useClickOutside = (ref, onClose) => {
//   useEffect(() => {
//     function onDocClick(e) {
//       if (!ref.current) return;
//       if (!ref.current.contains(e.target)) onClose?.();
//     }
//     document.addEventListener("mousedown", onDocClick);
//     return () => document.removeEventListener("mousedown", onDocClick);
//   }, [ref, onClose]);
// };

// function ChevronDown({ className = "h-4 w-4" }) {
//   return (
//     <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
//       <path
//         fillRule="evenodd"
//         d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.06 1.06l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.29a.75.75 0 01.02-1.08z"
//         clipRule="evenodd"
//       />
//     </svg>
//   );
// }

// /* ---------------------- components ---------------------- */
// const Logo = () => (
//   <a href="/" className="flex items-center gap-2">
//     <div className="text-[10px] font-bold tracking-wider text-sky-500 uppercase">
//       CẨM NANG
//     </div>
//     <div className="relative -ml-1 text-lg font-extrabold">
//       <span className="bg-gradient-to-r from-sky-500 to-violet-600 bg-clip-text text-transparent">
//         NghềNghiệp
//       </span>
//       <span className="absolute -right-2 -top-1 h-2 w-2 rounded-full bg-violet-500" />
//     </div>
//   </a>
// );

// const DesktopDropdown = ({ item, isActive }) => {
//   const [open, setOpen] = useState(false);
//   const wrapperRef = useRef(null);
//   useClickOutside(wrapperRef, () => setOpen(false));

//   return (
//     <div
//       ref={wrapperRef}
//       className="relative"
//       onMouseEnter={() => setOpen(true)}
//       onMouseLeave={() => setOpen(false)}
//     >
//       <a
//         href={item.href}
//         className={`group flex items-center gap-1 px-3 py-3 text-sm font-medium ${
//           isActive ? "text-slate-900" : "text-slate-700"
//         } hover:text-slate-900`}
//         onClick={(e) => {
//           // prevent navigating when intending to open dropdown on desktop
//           if (item.children?.length) e.preventDefault();
//           setOpen((v) => !v);
//         }}
//       >
//         {item.label}
//         {/* active/hover underline */}
//         <span
//           className={`pointer-events-none absolute inset-x-0 -bottom-[1px] h-[3px] origin-left rounded-full bg-gradient-to-r from-sky-500 to-violet-600 transition-all duration-200 ${
//             isActive || open ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
//           }`}
//         />
//       </a>

//       {item.children?.length ? (
//         <div
//           className={`absolute left-0 top-full z-30 w-72 translate-y-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5 transition ${
//             open ? "opacity-100" : "pointer-events-none opacity-0"
//           }`}
//         >
//           <ul className="p-2">
//             {item.children.map((c) => (
//               <li key={c.href}>
//                 <a
//                   href={c.href}
//                   className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
//                 >
//                   {c.label}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : null}
//     </div>
//   );
// };

// const MobileItem = ({ item }) => {
//   const [open, setOpen] = useState(false);
//   const hasChildren = item.children?.length > 0;

//   return (
//     <div className="border-b border-slate-100 last:border-b-0">
//       <button
//         className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-slate-800"
//         onClick={() => (hasChildren ? setOpen((v) => !v) : (window.location.href = item.href))}
//       >
//         <span>{item.label}</span>
//         {hasChildren ? (
//           <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
//         ) : null}
//       </button>
//       {hasChildren && open && (
//         <ul className="bg-slate-50/50 px-2 py-1">
//           {item.children.map((c) => (
//             <li key={c.href}>
//               <a
//                 href={c.href}
//                 className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-white"
//               >
//                 {c.label}
//               </a>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// /* ---------------------- Header ---------------------- */
// export default function HeaderNav({ activePath }) {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   // simple active detector (works even nếu không dùng react-router)
//   const currentPath =
//     activePath || (typeof window !== "undefined" ? window.location.pathname : "/");
//   const isActive = (href) =>
//     href === "/"
//       ? currentPath === "/"
//       : currentPath.startsWith(href.replace(/\/$/, ""));

//   return (
//     <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 mt-[-30px]">
//       <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
//         <Logo />

//         {/* desktop nav */}
//         <nav className="hidden md:flex md:items-stretch md:gap-1">
//           {NAV.map((item) => (
//             <DesktopDropdown key={item.key} item={item} isActive={isActive(item.href)} />
//           ))}
//         </nav>

//         {/* actions (optional) */}
//         {/* mobile trigger */}
//         <button
//           className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
//           aria-label="Open menu"
//           onClick={() => setMobileOpen((v) => !v)}
//         >
//           <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
//             {mobileOpen ? (
//               <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" />
//             ) : (
//               <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" />
//             )}
//           </svg>
//         </button>
//       </div>

//       {/* mobile panel */}
//       {mobileOpen && (
//         <div className="md:hidden">
//           <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-b-2xl border-t border-slate-200 bg-white shadow-lg">
//             {NAV.map((item) => (
//               <MobileItem key={item.key} item={item} />
//             ))}
//             <div className="p-3">
//               <a
//                 href="/career-guide/search"
//                 className="block rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
//               >
//                 Tìm kiếm
//               </a>
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }
