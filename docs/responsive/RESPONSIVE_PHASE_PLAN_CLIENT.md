# RESPONSIVE PHASE PLAN — Client Frontend (Candidate)

> **Ngày tạo:** 2025  
> **Scope:** `careergraph-client` (React 19 + JavaScript + Tailwind v4)  
> **Tiêu chuẩn:** Production-grade, ngang tầm LinkedIn Mobile / Indeed / Glassdoor  
> **Triết lý:** Mobile-FIRST — Candidate dùng mobile là chính. Desktop là secondary.

---

## 1. Tech Stack Summary

| Mục | Giá trị |
|-----|---------|
| Framework | React 19.1.1 + JavaScript (KHÔNG TypeScript) |
| CSS | Tailwind CSS v4.1.11 (`@theme` tokens, `@custom-variant dark`) — config inline trong `index.css` |
| Component Library | Radix UI (Dialog, Select, ScrollArea, Slot) + custom UI primitives (`src/components/ui/`) |
| UI Primitives | Shadcn-style — button.jsx, select.jsx, sheet.jsx, scroll-area.jsx |
| Class Utility | clsx + tailwind-merge qua `cn()` helper |
| Icons | lucide-react 0.552 |
| Router | react-router v7.8.0 (BrowserRouter) |
| State | Zustand 5.0.8 (authStore, userStore, messaging store) |
| Real-time | socket.io-client 4.8.3 |
| PDF | @react-pdf/renderer 4.3.1 |
| Markdown | react-markdown + remark-gfm |
| Build | Vite 7.1.0, @tailwindcss/vite |
| Font | Google Fonts — Poppins + Roboto (BUG: `--font-poppins` trỏ tới Roboto) |
| CSS-in-JS | KHÔNG — chỉ Tailwind utility classes |
| PWA | KHÔNG — không có service worker, không có manifest |

### Breakpoints hiện tại (Tailwind v4 defaults — KHÔNG custom)

| Token | Giá trị | Dùng cho |
|-------|---------|----------|
| `sm` | 640px | Small tablets / landscape phones |
| `md` | 768px | Tablets (iPad mini) — **breakpoint chính đang dùng** |
| `lg` | 1024px | Small laptops / iPad Pro |
| `xl` | 1280px | Standard laptops |
| `2xl` | 1536px | Large monitors |

> **⚠️ THIẾU:** Không có breakpoint cho phone nhỏ (375px). Không có `xs` hay `2xsm`.

### Breakpoint Strategy cho responsive redesign

```
Mobile:   < 768px    → design cho 375px (iPhone standard)
Tablet:   768–1023px → design cho 834px (iPad)
Desktop:  ≥ 1024px   → design cho 1440px (standard laptop)
```

---

## 2. Layout Shell — Hiện trạng

### DefaultLayout (`src/layouts/DefaultLayout/DefaultLayout.jsx`)
- Wrapper: `min-h-dvh bg-slate-50` (dùng dvh — tốt cho mobile)
- Navbar: Fixed top, slide-out mobile menu
- Content padding: `md:px-16` — **THIẾU padding mobile base** (không có `px-4`)
- Padding top: `pt-25` (100px) hoặc `pt-[4.5rem]` (72px cho messages)
- Footer: Hiện ở tất cả trang trừ Messages
- ChatBotButton: Fixed `bottom-6 right-6`

### ProfileDashboardLayout (`src/layouts/ProfileDashboardLayout/ProfileDashboardLayout.jsx`)
- Wraps DefaultLayout
- Sidebar: `hidden lg:block lg:w-80 lg:flex-none` cho messages; `flex-1` cho các trang khác
- Content: `flex min-w-0 flex-1 lg:flex-[3]`
- Messages đặc biệt: `h-[calc(100dvh-6.5rem)] min-h-0`
- Padding: `pt-4 lg:pt-6`

### FooterOnly (`src/layouts/FooterOnly/FooterOnly.jsx`) — Auth Pages
- Padding: `md:px-16 lg:px-24 xl:px-32`
- **⚠️ THIẾU mobile padding** — không có `px-4` hoặc `px-6` base

### Navbar (`src/layouts/components/Navbar/Navbar.jsx`)
- Desktop: `hidden md:flex` nav items, hover submenus `w-56` (224px)
- Mobile: Full-screen overlay menu, translate-x animation — **tương đối tốt**
- Hamburger: hiện trên mobile (\<md)
- Font size mobile: `text-base` (16px) — **đúng**, tránh iOS zoom

### Vấn đề chính

| # | Vấn đề | Ảnh hưởng |
|---|--------|-----------|
| L1 | **KHÔNG CÓ bottom navigation** | Candidate phải scroll lên top mới navigate được — UX mobile cực kỳ tệ |
| L2 | **KHÔNG CÓ safe-area-inset** trên fixed elements | ChatBotButton, Navbar bị che bởi notch iPhone |
| L3 | **DefaultLayout thiếu mobile padding** | `md:px-16` nhưng mobile không có `px-4` → content sát cạnh |
| L4 | **FooterOnly thiếu mobile padding** | Auth pages không có horizontal padding trên mobile |
| L5 | **Navbar dropdown `w-56`** vượt viewport trên 320px phones | Overflow horizontal |
| L6 | **ChatBotButton `bottom-6 right-6`** không có safe-area | Bị home indicator che trên iPhone |

---

## 3. Full Inventory — Pages

### 3.1 Home / Landing

| Page | File | Responsive Score | Issues | Priority | Effort |
|------|------|-----------------|--------|----------|--------|
| Home (Hero + Sections) | `src/pages/Home.jsx` | ✅ GOOD | Hero section responsive tốt; flex-wrap cho job sections; typography scaling | P2 | S |

**Chi tiết:**
- HeroSection: `text-[40px]/12 md:text-[45px]/16` — fluid typography tốt
- Image: `w-5/6 max-w-lg` — responsive
- Buttons: `px-6 py-3` ≈ 44px height — touch target OK
- PersonalJobsSection / PopularJobsSection: `flex flex-wrap gap-8` — OK nhưng thiếu explicit grid
- CategorySection: Cards grid — cần verify
- TrustedCompanies: Grid logos responsive

### 3.2 Jobs

| Page | File | Responsive Score | Issues | Priority | Effort |
|------|------|-----------------|--------|----------|--------|
| Jobs (Search + List) | `src/pages/Jobs.jsx` | ✅ GOOD | Sidebar slide-in tốt; grid `grid-cols-1 md:grid-cols-[minmax(0,320px)_1fr]`; filter button mobile | P2 | S |
| Job Detail | `src/pages/JobDetail.jsx` | ✅ GOOD | Container `px-4 sm:px-6 lg:px-8`; grid 1→3 cols; error state `min-h-[400px]` chiếm mobile | P2 | S |

**Chi tiết:**
- JobsSidebar: `fixed lg:relative w-80 max-w-[95vw]` — excellent responsive pattern
- SearchBar: `h-11` inputs — **nhưng `text-sm` (14px)** → iOS auto-zoom
- JobsList: grid responsive

### 3.3 Auth Pages

| Page | File | Responsive Score | Issues | Priority | Effort |
|------|------|-----------------|--------|----------|--------|
| Login | `src/pages/Login.jsx` | 🔴 BROKEN | **h-[700px] fixed** — vỡ trên mọi mobile; `text-sm` inputs → iOS zoom; `gap-30` | P0 | M |
| Register | `src/pages/Register.jsx` | 🔴 BROKEN | Giống Login — h-[700px], text-sm inputs | P0 | M |
| ForgotPassword | `src/pages/ForgotPassword.jsx` | 🔴 BROKEN | Giống Login — h-[700px], text-sm inputs | P0 | S |
| VerifyOtp | `src/pages/VerifyOtp.jsx` | 🔴 BROKEN | Giống Login — h-[700px], text-sm inputs | P0 | S |
| ResetPassword | `src/pages/ResetPassword.jsx` | 🔴 BROKEN | Giống Login — h-[700px], text-sm inputs | P0 | S |

**Chi tiết CRITICAL:**
- Container: `flex h-[700px] w-full gap-30` — iPhone SE viewport 667px → form bị nén/overflow
- Image: `hidden lg:block w-1/2 max-h-[600px]` — ẩn mobile (tốt), nhưng container vẫn 700px
- ALL inputs: `text-sm` (14px) → **iOS Safari auto-zoom khi focus**
- Input height: `h-12` (48px) — touch target OK
- GoogleLogin widget: width-384 — cần kiểm tra overflow

### 3.4 Profile & Dashboard

| Page | File | Responsive Score | Issues | Priority | Effort |
|------|------|-----------------|--------|----------|--------|
| Profile | `src/pages/Profile.jsx` | ✅ GOOD | Single column `flex-1 px-6`; cards stack vertically | P2 | S |
| AccountSettings | `src/pages/AccountSettings.jsx` | ⚠️ PARTIAL | Dialog inputs `text-sm` → iOS zoom; buttons `px-4 py-2` nhỏ | P1 | S |

### 3.5 Applied / Saved Jobs

| Page | File | Responsive Score | Issues | Priority | Effort |
|------|------|-----------------|--------|----------|--------|
| AppliedJobs | `src/pages/AppliedJobs.jsx` | ⚠️ PARTIAL | Custom Select `min-w-[220px]` overflow mobile; `text-sm` inputs; save button 36-40px | P1 | M |
| SavedJobs | `src/pages/SavedJobs.jsx` | ⚠️ PARTIAL | Empty state `w-[360px]` overflow; save button `p-2` + icon 22px = ~36px; `text-[17px]`/`text-[13px]` custom sizes | P1 | S |
| FollowingCompanies | `src/pages/FollowingCompanies.jsx` | ✅ GOOD | Container `px-4 sm:px-6 lg:px-8`; grid `1→2→3` cols; empty states responsive | P3 | S |

### 3.6 CV Builder

| Page | File | Responsive Score | Issues | Priority | Effort |
|------|------|-----------------|--------|----------|--------|
| CVBuilder | `src/pages/CVBuilder.jsx` | 🔴 BROKEN | **h-[900px]** PDF preview — 2.4x mobile viewport; form `text-sm` inputs | P0 | L |
| CVTemplates | `src/pages/CVTemplates.jsx` | ✅ GOOD | Grid `1→2→3` cols; fluid typography `text-4xl md:text-5xl`; responsive padding | P3 | S |

### 3.7 Messaging

| Page | File | Responsive Score | Issues | Priority | Effort |
|------|------|-----------------|--------|----------|--------|
| MessagesPage | `src/features/messaging/pages/MessagesPage.jsx` | ⚠️ PARTIAL | Sidebar `w-full md:w-80 xl:w-96`; toggle system cần rework; thiếu explicit mobile styling | P0 | L |
| ChatWindow | `src/features/messaging/components/ChatWindow.jsx` | ⚠️ PARTIAL | Limited responsive breakpoints; relies on parent sizing | P1 | M |
| MessageInput | `src/features/messaging/components/MessageInput.jsx` | ⭐ EXCELLENT | Safe-area + keyboard detection; `min-h-11` (44px); `hidden sm:inline` text toggle | — | — |
| MessageBubble | `src/features/messaging/components/MessageBubble.jsx` | ✅ GOOD | `max-w-[85%] sm:max-w-[82%]` responsive widths | P2 | S |
| ThreadCard | `src/features/messaging/components/ThreadCard.jsx` | ✅ GOOD | `min-h-22` (88px); avatar `h-11 w-11` (44px); truncation/clamp | P2 | S |

### 3.8 Interview

| Page | File | Responsive Score | Issues | Priority | Effort |
|------|------|-----------------|--------|----------|--------|
| MyInterviews | `src/pages/MyInterviews.jsx` | ⚠️ PARTIAL | Filter `h-10 min-w-[200px]`; button touch targets 40px; empty state `w-[260px]`; `text-sm` inputs | P1 | M |
| InterviewRoom | `src/pages/InterviewRoom.jsx` | ⚠️ PARTIAL | Fullscreen overlays OK; button `px-4 py-2.5` ~40px; no safe-area; no landscape handling | P1 | L |

### 3.9 Career Guide

| Page | File | Responsive Score | Issues | Priority | Effort |
|------|------|-----------------|--------|----------|--------|
| CareerGuide | `src/pages/CareerGuide.jsx` | ⚠️ PARTIAL | Depends on child sections | P2 | S |
| CareerGuideDetail | `src/pages/CareerGuide/Detail/CareerGuideDetail.jsx` | ⭐ EXCELLENT | Grid `1→12` cols + responsive ordering; `px-4 sm:px-6 lg:px-8`; prose styling | — | — |

### 3.10 Other

| Page | File | Responsive Score | Issues | Priority | Effort |
|------|------|-----------------|--------|----------|--------|
| About | `src/pages/About.jsx` | ⓘ BASIC | Wrapper component | P3 | S |
| CompanyDetail | `src/pages/CompanyDetail.jsx` | ✅ GOOD | Standard container + 1→3 grid | P3 | S |
| NotFound | `src/pages/NotFound.jsx` | ✅ GOOD | Giữ nguyên làm reference | — | — |

---

## 4. Full Inventory — Shared Components

### 4.1 UI Primitives (`src/components/ui/`)

| Component | File | Responsive Score | Issues | Priority | Effort |
|-----------|------|-----------------|--------|----------|--------|
| button.jsx | `ui/button.jsx` | ⚠️ PARTIAL | **Tất cả sizes dưới 44px:** default h-9 (36px), sm h-8 (32px), lg h-10 (40px), icon 36px | P0 | S |
| select.jsx | `ui/select.jsx` | ✅ GOOD | Radix-based, custom styling | P2 | S |
| sheet.jsx | `ui/sheet.jsx` | ✅ GOOD | `w-3/4 sm:max-w-sm`; side-aware animations | — | — |
| scroll-area.jsx | `ui/scroll-area.jsx` | ✅ GOOD | `w-full` responsive; `touch-none` for scrollbar | — | — |

### 4.2 Buttons

| Component | File | Issues | Priority | Effort |
|-----------|------|--------|----------|--------|
| ChatBotButton | `src/components/Buttons/ChatBotButton.jsx` | `w-14 h-14` (56px) — touch OK; **NHƯNG `bottom-6 right-6` KHÔNG CÓ safe-area** | P0 | S |

### 4.3 Cards

| Component | File | Issues | Priority | Effort |
|-----------|------|--------|----------|--------|
| JobsCardCommon | `src/components/Cards/JobsCardCommon.jsx` | `max-w-[300px]`; image `size-14` (56px); NO lazy loading; badge `text-[10px]` | P1 | S |
| CategoryCard | `src/components/Cards/CategoryCard.jsx` | `max-w-80`; `max-h-40 w-1/4` image | P2 | S |

### 4.4 Search

| Component | File | Issues | Priority | Effort |
|-----------|------|--------|----------|--------|
| SearchBar | `src/components/Search/SearchBar.jsx` | `h-11` (44px) — touch OK; **`text-sm` (14px) inputs → iOS zoom**; `sm:flex-row` responsive | P0 | S |

### 4.5 Chat Panel

| Component | File | Issues | Priority | Effort |
|-----------|------|--------|----------|--------|
| ChatPanel | `src/components/Chat/ChatPanel.jsx` | `w-[480px] max-w-[calc(100vw-3rem)] h-[700px] max-h-[calc(100vh-6rem)]` — calc viewport-aware tốt; **textarea `text-sm` → iOS zoom** | P1 | S |

### 4.6 Profile Dashboard

| Component | File | Issues | Priority | Effort |
|-----------|------|--------|----------|--------|
| Sidebar | `src/components/ProfileDashboard/Sidebar.jsx` | Toggle `h-7 w-[47px]` = 28px — **dưới 44px touch target**; menu items `py-3 px-3` ≈ 36-44px; `text-[15px]` custom | P1 | S |
| ProfileCard | `src/components/ProfileDashboard/ProfileCard/ProfileCard.jsx` | Form modal inputs — cần verify `text-sm` | P2 | S |

### 4.7 Navigation

| Component | File | Issues | Priority | Effort |
|-----------|------|--------|----------|--------|
| Breadcrumbs | `src/components/Navigate/Breadcrumbs.jsx` | `text-sm` (14px) — OK cho breadcrumbs | — | — |

### 4.8 Notifications

| Component | File | Issues | Priority | Effort |
|-----------|------|--------|----------|--------|
| NotificationDropdown | `src/features/notifications/components/NotificationDropdown.jsx` | `w-[360px] max-w-[calc(100vw-1rem)]` — **tốt**, viewport-aware | P2 | S |

### 4.9 Profile Menu

| Component | File | Issues | Priority | Effort |
|-----------|------|--------|----------|--------|
| ProfileDropdown | `src/components/ProfileMenu/ProfileDropdown.jsx` | `w-56` (224px) absolute — cần verify không overflow trên 320px phones | P2 | S |

---

## 5. Responsive Audit Score

| Category | Total | Mobile-Ready | Partial | Not Ready / Broken |
|----------|-------|-------------|---------|-----------|
| Layouts | 4 | 1 | 2 | 1 |
| Auth Pages | 5 | 0 | 0 | **5** |
| Core Pages (Jobs, Home) | 4 | 3 | 1 | 0 |
| Profile/Dashboard Pages | 5 | 2 | 2 | 1 |
| Messaging | 5 | 3 | 2 | 0 |
| Interview | 2 | 0 | 2 | 0 |
| Content Pages | 4 | 3 | 1 | 0 |
| UI Primitives | 4 | 2 | 2 | 0 |
| Shared Components | 7 | 1 | 4 | 2 |
| **TOTAL** | **40** | **15 (38%)** | **16 (40%)** | **9 (23%)** |

### 🔴 CRITICAL Mobile Issues — Phải fix ngay

| # | Issue | Impact | Files |
|---|-------|--------|-------|
| C1 | **KHÔNG CÓ Bottom Navigation** | Candidate KHÔNG thể navigate nhanh trên mobile — phải scroll lên top | Global |
| C2 | **Auth pages h-[700px] fixed** | Form vỡ trên tất cả mobile (iPhone SE 667px chiều cao) | 5 auth pages |
| C3 | **ALL inputs text-sm (14px)** | iOS Safari auto-zoom khi focus — UX cực kỳ jarring | ~15+ files |
| C4 | **CV Builder h-[900px] fixed** | PDF preview chiếm 2.4x viewport trên mobile | CVBuilder.jsx |
| C5 | **Button sizes dưới 44px** | Touch target quá nhỏ: default 36px, sm 32px, lg 40px | button.jsx + toàn app |
| C6 | **KHÔNG CÓ safe-area-inset** trên fixed elements | ChatBotButton, Navbar bị che bởi iPhone notch/home indicator | ChatBotButton, Navbar |
| C7 | **KHÔNG CÓ image lazy loading** | Tất cả images load eager — chậm trên mobile 4G | Toàn app |
| C8 | **KHÔNG CÓ swipe gestures** | Thiếu native mobile feel: swipe back, swipe dismiss | Toàn app |

### Good Patterns (giữ nguyên làm reference)

- `MessageInput.jsx` — ⭐ safe-area + keyboard detection, 44px touch target, text toggle
- `CareerGuideDetail.jsx` — ⭐ 12-col grid responsive, ordering, prose styling
- `JobsSidebar.jsx` — ⭐ fixed/relative toggle, max-w-[95vw], translate-x animation
- `HeroSection.jsx` — fluid typography `text-[40px]/12 md:text-[45px]/16`
- `NotificationDropdown.jsx` — `max-w-[calc(100vw-1rem)]` viewport-aware
- `ChatPanel.jsx` — `max-w-[calc(100vw-3rem)] max-h-[calc(100vh-6rem)]` viewport-aware
- `sheet.jsx` — side-aware, `w-3/4 sm:max-w-sm`
- `FollowingCompanies.jsx` — container + grid `1→2→3` cols + empty states

---

## 6. Phase Breakdown

### Phase 1: Foundation — Bottom Nav, Safe Area, CSS Tokens, Layout Fixes
**Thời gian:** 3 ngày  
**Phụ thuộc:** Không  
**Chi tiết:** [RESPONSIVE_PHASE_1_CLIENT.md](./RESPONSIVE_PHASE_1_CLIENT.md)

**Files in scope:**
1. `src/index.css` — thêm responsive tokens: touch target utilities, typography clamp, safe-area rules, input font-size 16px global
2. `src/components/BottomNav/BottomNav.jsx` — **TẠO MỚI**: Bottom navigation bar cho mobile (<768px)
3. `src/layouts/DefaultLayout/DefaultLayout.jsx` — thêm mobile padding `px-4`, render BottomNav, safe-area aware padding
4. `src/layouts/FooterOnly/FooterOnly.jsx` — thêm mobile padding base
5. `src/components/Buttons/ChatBotButton.jsx` — thêm `safe-area-inset-bottom`
6. `src/layouts/components/Navbar/Navbar.jsx` — safe-area-inset-top, fix dropdown `w-56` overflow

**Không làm:**
- Không touch page-level code
- Không thay đổi routing
- Không refactor component API
- Không thêm swipe gestures

---

### Phase 2: Auth Pages — Fix Broken Mobile Layouts
**Thời gian:** 2 ngày  
**Phụ thuộc:** Phase 1 (CSS tokens, input font-size fix)  
**Chi tiết:** [RESPONSIVE_PHASE_2_CLIENT.md](./RESPONSIVE_PHASE_2_CLIENT.md)

**Files in scope:**
1. `src/pages/Login.jsx` — xóa `h-[700px]` → flex-col responsive, input `text-base` (16px)
2. `src/pages/Register.jsx` — giống Login
3. `src/pages/ForgotPassword.jsx` — giống Login
4. `src/pages/VerifyOtp.jsx` — giống Login
5. `src/pages/ResetPassword.jsx` — giống Login

**Không làm:**
- Không thay đổi validation logic
- Không thay đổi API calls
- Không redesign visual

---

### Phase 3: Touch Targets & Input System
**Thời gian:** 2 ngày  
**Phụ thuộc:** Phase 1 (CSS tokens)  
**Chi tiết:** [RESPONSIVE_PHASE_3_CLIENT.md](./RESPONSIVE_PHASE_3_CLIENT.md)

**Files in scope:**
1. `src/components/ui/button.jsx` — tăng sizes: default h-10 (40px→mobile 44px via CSS), sm h-9, lg h-11
2. `src/components/Search/SearchBar.jsx` — input `text-base` trên mobile
3. `src/components/Chat/ChatPanel.jsx` — textarea `text-base` trên mobile
4. `src/components/ProfileDashboard/Sidebar.jsx` — toggle switch 44px touch area, menu items padding
5. `src/pages/AccountSettings.jsx` — dialog input `text-base`

**Không làm:**
- Không đổi button variants/colors
- Không đổi component API
- Không touch page layouts

---

### Phase 4: CV Builder — Mobile PDF Experience
**Thời gian:** 2 ngày  
**Phụ thuộc:** Phase 1, Phase 3  
**Chi tiết:** [RESPONSIVE_PHASE_4_CLIENT.md](./RESPONSIVE_PHASE_4_CLIENT.md)

**Files in scope:**
1. `src/pages/CVBuilder.jsx` — xóa `h-[900px]` → responsive height; mobile: tab toggle editor ↔ preview
2. CV Editor form inputs — `text-base` trên mobile
3. PDF Preview wrapper — responsive height `h-[50vh] lg:h-[900px]`

**Không làm:**
- Không đổi PDF rendering logic
- Không đổi CV template components
- Không touch CVTemplates page (đã tốt)

---

### Phase 5: Applied Jobs, Saved Jobs, Interviews — Card & List Fixes
**Thời gian:** 2 ngày  
**Phụ thuộc:** Phase 1, Phase 3  
**Chi tiết:** [RESPONSIVE_PHASE_5_CLIENT.md](./RESPONSIVE_PHASE_5_CLIENT.md)

**Files in scope:**
1. `src/pages/AppliedJobs.jsx` — custom Select responsive width; save button 44px; fix custom font sizes
2. `src/pages/SavedJobs.jsx` — empty state responsive image; save button 44px; normalize font sizes
3. `src/pages/MyInterviews.jsx` — filter dropdown responsive; touch targets 44px; empty state image responsive
4. `src/components/Cards/JobsCardCommon.jsx` — image lazy loading; responsive max-width

**Không làm:**
- Không đổi sort/filter logic
- Không đổi API calls
- Không redesign card visual

---

### Phase 6: Messaging — Chat Mobile UX
**Thời gian:** 3 ngày  
**Phụ thuộc:** Phase 1 (bottom nav, safe-area)  
**Chi tiết:** [RESPONSIVE_PHASE_6_CLIENT.md](./RESPONSIVE_PHASE_6_CLIENT.md)

**Files in scope:**
1. `src/features/messaging/pages/MessagesPage.jsx` — mobile: full-screen toggle inbox ↔ chat (không side-by-side)
2. `src/features/messaging/components/ChatWindow.jsx` — full-width trên mobile, responsive message layout
3. `src/features/messaging/components/MessageBubble.jsx` — thêm breakpoints
4. `src/components/ProfileDashboard/Sidebar.jsx` — messages page: hide sidebar trên mobile

**Không làm:**
- Không touch MessageInput (đã excellent)
- Không thay đổi socket logic
- Không đổi ThreadCard (đã tốt)

---

### Phase 7: Interview Room — Mobile Video Experience
**Thời gian:** 2 ngày  
**Phụ thuộc:** Phase 1  
**Chi tiết:** [RESPONSIVE_PHASE_7_CLIENT.md](./RESPONSIVE_PHASE_7_CLIENT.md)

**Files in scope:**
1. `src/pages/InterviewRoom.jsx` — mobile video layout (portrait), touch-sized controls, safe-area, landscape support
2. `src/pages/MyInterviews.jsx` — modal responsive (đã fix cơ bản ở Phase 5)

**Không làm:**
- Không đổi WebRTC logic
- Không đổi socket connections
- Không touch interview scoring

---

### Phase 8: Polish — Lazy Loading, Performance, Reduced Motion
**Thời gian:** 2 ngày  
**Phụ thuộc:** Tất cả phases trước  
**Chi tiết:** [RESPONSIVE_PHASE_8_CLIENT.md](./RESPONSIVE_PHASE_8_CLIENT.md)

**Files in scope:**
1. Toàn bộ `<img>` tags → thêm `loading="lazy"` cho below-fold images
2. `src/index.css` — thêm `prefers-reduced-motion` respect
3. `src/components/Cards/JobsCardCommon.jsx` — lazy loading
4. Empty state images — responsive widths (`max-w-full`)
5. Font loading optimization: `font-display: swap`
6. Fix font variable bug: `--font-poppins: "Roboto"` → `"Poppins"`

**Không làm:**
- Không thêm service worker / PWA
- Không thêm swipe gestures (riêng phase nếu cần)
- Không đổi business logic

---

## 7. Phase Dependencies Visualization

```
Phase 1 (Foundation) ─────┬──── Phase 2 (Auth Pages)
                          │
                          ├──── Phase 3 (Touch Targets) ────┬── Phase 4 (CV Builder)
                          │                                  │
                          │                                  └── Phase 5 (Lists/Cards)
                          │
                          ├──── Phase 6 (Messaging)
                          │
                          └──── Phase 7 (Interview Room)
                                        │
                                        └──────────────────────── Phase 8 (Polish)
```

> **Phase 2 + Phase 3** có thể chạy song song  
> **Phase 4 + Phase 5 + Phase 6 + Phase 7** có thể chạy song song (sau Phase 3)  
> **Phase 8** chạy cuối cùng

---

## 8. QA Test Matrix — Devices bắt buộc test

| Device | Viewport | Orientation | Priority |
|--------|----------|-------------|----------|
| iPhone SE (3rd gen) | 375×667 | Portrait | **P0** — target design |
| iPhone 15 | 393×852 | Portrait | **P0** |
| iPhone 15 Pro Max | 430×932 | Portrait | P1 |
| iPad mini | 768×1024 | Portrait + Landscape | P1 |
| Samsung Galaxy S24 | 360×780 | Portrait | P1 |
| Pixel 7 | 412×915 | Portrait | P2 |
| MacBook 14" | 1512×982 | Landscape | P2 — regression check |

### Test Checklist mỗi phase

- [ ] Bottom nav visible + functional trên mobile (<768px)
- [ ] No horizontal scroll trên bất kỳ page nào
- [ ] All inputs: focus KHÔNG trigger iOS auto-zoom
- [ ] All buttons: touch target ≥ 44×44px
- [ ] Safe-area: fixed elements không bị notch/home indicator che
- [ ] Images: lazy loading cho below-fold
- [ ] Modals/dialogs: hiển thị đúng, không overflow
- [ ] Text: readable, không bị clip, không overflow container
- [ ] Navigation: có thể đến mọi trang từ mobile mà không scroll lên top
