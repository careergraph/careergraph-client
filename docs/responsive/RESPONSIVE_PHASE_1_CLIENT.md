# Phase 1: Foundation — Bottom Nav, Safe Area, CSS Tokens, Layout Fixes

> **Scope:** `careergraph-client`  
> **Phụ thuộc:** Không  
> **Pattern áp dụng:** 3a (Navigation), 3e (Touch), 3f (Typography), 3g (Spacing)

---

## Mục tiêu

Xây dựng nền tảng responsive cho TOÀN BỘ app:
1. Bottom Navigation cho mobile (\<768px) — **ĐÂY LÀ THAY ĐỔI LỚN NHẤT**
2. Global CSS tokens: safe-area, touch targets, input font-size 16px
3. Fix layout shell padding cho mobile
4. Safe-area-inset cho fixed elements

---

## Files in scope

### 1. `src/index.css` — Global Responsive Tokens

**Hiện trạng:**
```css
body {
    @apply bg-white text-slate-800 text-sm font-poppins antialiased;
}
button { @apply cursor-pointer; }
```

**Cần thêm:**

#### 1a. Input font-size 16px (tránh iOS auto-zoom)
```css
/* Prevent iOS Safari auto-zoom on input focus */
@media (max-width: 767px) {
  input,
  textarea,
  select,
  [contenteditable] {
    font-size: 16px !important;
  }
}
```
> **LÝ DO:** iOS Safari auto-zoom khi font-size < 16px. Đây là P0 vì ảnh hưởng MỌI form trên toàn app.

#### 1b. Touch target minimum rule
```css
/* Touch target minimum 44px trên mobile */
@media (max-width: 767px) {
  button,
  [role="button"],
  a:not(.inline-link),
  summary {
    min-height: 44px;
  }
}
```

#### 1c. Safe-area viewport meta + CSS variables
```css
/* Safe area utilities cho fixed elements */
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.safe-top {
  padding-top: env(safe-area-inset-top, 0px);
}
```

#### 1d. Typography clamp utilities
```css
/* Responsive heading scale */
.text-heading-1 {
  font-size: clamp(1.5rem, 4vw, 2rem);    /* 24px → 32px */
  line-height: 1.2;
}
.text-heading-2 {
  font-size: clamp(1.25rem, 3vw, 1.5rem);  /* 20px → 24px */
  line-height: 1.3;
}
```

#### 1e. Bottom nav spacing utility
```css
/* Bottom padding khi bottom nav hiện (mobile) */
@media (max-width: 767px) {
  .has-bottom-nav {
    padding-bottom: calc(4rem + env(safe-area-inset-bottom, 0px));
    /* 64px cho nav + safe area */
  }
}
```

#### 1f. Reduced motion (chuẩn bị cho Phase 8)
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

#### 1g. Viewport meta update
Kiểm tra `index.html` đang có:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```
> `viewport-fit=cover` **BẮT BUỘC** để safe-area CSS hoạt động trên iPhone notch.

---

### 2. `src/components/BottomNav/BottomNav.jsx` — TẠO MỚI

**Pattern:** 3a Navigation — Mobile Bottom Tab Bar

**Design specs:**
```
┌─────────────────────────────────────────┐
│                                         │
│              (main content)             │
│                                         │
├─────────────────────────────────────────┤
│  🏠        🔍        💬        👤      │
│  Trang    Việc     Tin       Hồ sơ     │
│  chủ     làm      nhắn                  │
├─────────────────────────────────────────┤
│         safe-area-inset-bottom          │
└─────────────────────────────────────────┘
```

**Specs:**
- **Chỉ hiện trên mobile** (\<768px): `md:hidden`
- **Fixed bottom:** `fixed bottom-0 left-0 right-0 z-40`
- **Height:** 64px + safe-area-inset-bottom
- **Background:** `bg-white/95 backdrop-blur-lg border-t border-slate-200`
- **Items:** Tối đa 4 items (KHÔNG 5 — candidate app cần tập trung)
- **Mỗi item:**
  - Icon: lucide-react, size 22px
  - Label: text-[11px] font-medium
  - Active state: text-indigo-600, icon filled/bold
  - Inactive: text-slate-400
  - Min touch area: 44×44px (item width ≈ 25% viewport)
- **Badge:** notification dot cho Messages (red dot 8px hoặc count)
- **Animation:** active icon slight scale `scale-105` + color transition 150ms

**Navigation items:**
| # | Icon | Label | Path | Badge |
|---|------|-------|------|-------|
| 1 | `Home` | Trang chủ | `/` | — |
| 2 | `Search` | Việc làm | `/jobs` | — |
| 3 | `MessageSquare` | Tin nhắn | `/messages` | Unread count |
| 4 | `User` | Hồ sơ | `/profile` | — |

**Active state detection:**
- Dùng `useLocation()` từ react-router
- Match exact cho `/` và `/jobs`
- Match prefix cho `/messages` (bao gồm `/messages/*`)
- Match prefix cho `/profile`, `/account`, `/jobs/applied`, `/jobs/saved`, `/employers/following`, `/interviews`

**Không hiện khi:**
- Route là `/interview/room/:roomCode` (fullscreen video)
- Route là auth pages (`/login`, `/register`, etc.)
- Viewport ≥ 768px

**Code structure:**
```jsx
// src/components/BottomNav/BottomNav.jsx
import { NavLink, useLocation } from "react-router-dom";
import { Home, Search, MessageSquare, User } from "lucide-react";
// ... (IMPLEMENTATION TRONG PHASE EXECUTION)
```

---

### 3. `src/layouts/DefaultLayout/DefaultLayout.jsx` — Layout Fixes

**Hiện trạng:**
```jsx
<div className="min-h-dvh bg-slate-50">
  <Navbar/>
  <div className={isMessagesPage ? "md:px-16 pt-[4.5rem]" : "md:px-16 pt-25"}>
    {children}
  </div>
  <Footer/>
  <ChatBotButton/>
</div>
```

**Thay đổi:**

#### 3a. Thêm mobile padding
```diff
- "md:px-16 pt-25"
+ "px-4 md:px-16 pt-25"

- "md:px-16 pt-[4.5rem]"
+ "px-4 md:px-16 pt-[4.5rem]"
```

#### 3b. Thêm bottom padding cho BottomNav
```diff
+ {/* Bottom padding để content không bị BottomNav che */}
+ <div className="md:hidden h-16" /> {/* 64px spacer */}
```

#### 3c. Import và render BottomNav
```jsx
import BottomNav from "~/components/BottomNav/BottomNav";

// Trong render, sau ChatBotButton:
<BottomNav />
```

#### 3d. Ẩn BottomNav trên certain routes
- Messages page: vẫn hiện BottomNav
- Interview room: ẩn (nhưng route này dùng Fragment layout, không DefaultLayout)
- Auth pages: dùng FooterOnly layout → không có BottomNav

#### 3e. Ẩn Footer trên mobile (optional — Footer quá dài trên mobile)
```diff
- <Footer/>
+ <Footer className="hidden md:block" /> {/* hoặc giữ Footer nhưng ensure spacing */}
```
> **QUYẾT ĐỊNH:** Giữ Footer trên mobile nhưng đảm bảo BottomNav không overlap. Footer và BottomNav cùng tồn tại — Footer là informational, BottomNav là navigational.

---

### 4. `src/layouts/FooterOnly/FooterOnly.jsx` — Mobile Padding

**Hiện trạng:**
```jsx
<div className="md:px-16 lg:px-24 xl:px-32">
  {children}
</div>
```

**Thay đổi:**
```diff
- "md:px-16 lg:px-24 xl:px-32"
+ "px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32"
```

---

### 5. `src/components/Buttons/ChatBotButton.jsx` — Safe Area

**Hiện trạng:**
```jsx
<div className="fixed bottom-6 right-6 z-50">
  <button className="w-14 h-14 ...">
```

**Thay đổi:**
```diff
- "fixed bottom-6 right-6 z-50"
+ "fixed right-6 z-50"
+ style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 5rem)" }}
```
> `5rem` = 80px = 64px (BottomNav height) + 16px gap. Trên desktop (không có BottomNav), dùng `md:bottom-6` riêng.

**Hoặc approach Tailwind thuần:**
```diff
- "fixed bottom-6 right-6 z-50"
+ "fixed bottom-24 md:bottom-6 right-6 z-50"
```
> `bottom-24` = 96px = đủ clearance cho BottomNav (64px) + safe-area + gap.

---

### 6. `src/layouts/components/Navbar/Navbar.jsx` — Safe Area + Dropdown Fix

#### 6a. Safe-area-inset-top
Nếu Navbar đang `fixed top-0`:
```diff
- "fixed top-0 left-0 right-0 z-50"
+ "fixed top-0 left-0 right-0 z-50"
+ style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
```

#### 6b. Desktop dropdown overflow protection
```diff
- "absolute left-0 top-full mt-2 w-56"
+ "absolute left-0 top-full mt-2 w-56 max-w-[calc(100vw-2rem)]"
```

#### 6c. Profile dropdown overflow
Nếu `ProfileDropdown` trong Navbar:
```diff
- "absolute right-0 mt-2 w-56"
+ "absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)]"
```

---

### 7. `index.html` — Viewport Meta Update

**Hiện trạng (verify):**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Thay đổi:**
```diff
- <meta name="viewport" content="width=device-width, initial-scale=1.0">
+ <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

---

## Không làm trong Phase 1

- ❌ Không touch page-level code (Login, Register, Jobs, etc.)
- ❌ Không thay đổi routing configuration
- ❌ Không refactor component API
- ❌ Không thêm swipe gestures
- ❌ Không đổi form input sizes (Phase 3)
- ❌ Không lazy loading images (Phase 8)
- ❌ Không touch messaging layout (Phase 6)
- ❌ Không đổi button sizes (Phase 3)

---

## QA Checklist — Phase 1

### iPhone SE (375×667) — Portrait
- [ ] Bottom nav hiển thị, 4 items aligned đều
- [ ] Bottom nav có safe-area padding (iPhone notch models)
- [ ] Tap mỗi nav item → navigate đúng route
- [ ] Active state hiện rõ (indigo color + bold)
- [ ] Messages badge hiển thị unread count
- [ ] ChatBotButton KHÔNG bị BottomNav che
- [ ] Content KHÔNG bị BottomNav che (bottom padding đủ)
- [ ] Navbar safe-area-top hoạt động
- [ ] Main content có `px-4` padding trên mobile
- [ ] Footer hiển thị phía trên BottomNav spacer
- [ ] Input focus KHÔNG trigger iOS auto-zoom (verify trên iOS Safari)

### iPad mini (768×1024) — Portrait
- [ ] Bottom nav ẨN (md:hidden)
- [ ] Desktop navigation hoạt động bình thường
- [ ] ChatBotButton vị trí bottom-6 right-6 (desktop)
- [ ] Padding layouts `md:px-16` đúng
- [ ] Dropdown menus không overflow viewport

### iPhone 15 (393×852) — Portrait
- [ ] Bottom nav render đúng
- [ ] Safe-area-inset-bottom có effect (home indicator)
- [ ] Tất cả nav items touch target ≥ 44px
- [ ] Scroll content mượt, không conflict với bottom nav

### Desktop 1440px
- [ ] KHÔNG có regression — layout giống y cũ
- [ ] Bottom nav ẨN hoàn toàn
- [ ] ChatBotButton vị trí không đổi
- [ ] Navbar dropdown menus hoạt động bình thường

### Auth pages (Login/Register trên mobile)
- [ ] BottomNav KHÔNG hiện (FooterOnly layout)
- [ ] Input focus KHÔNG auto-zoom (CSS rule đã apply)

### Interview Room
- [ ] BottomNav KHÔNG hiện (Fragment layout)
- [ ] Fullscreen video không bị ảnh hưởng

### Cross-browser
- [ ] Chrome Android
- [ ] Safari iOS (bắt buộc)
- [ ] Firefox Android
- [ ] Samsung Internet

---

## Implementation Notes

### Thứ tự implement:
1. `index.html` — viewport-fit=cover
2. `src/index.css` — CSS tokens + global rules
3. `src/components/BottomNav/BottomNav.jsx` — tạo mới
4. `src/layouts/DefaultLayout/DefaultLayout.jsx` — integrate BottomNav + padding
5. `src/layouts/FooterOnly/FooterOnly.jsx` — mobile padding
6. `src/components/Buttons/ChatBotButton.jsx` — safe-area + BottomNav clearance
7. `src/layouts/components/Navbar/Navbar.jsx` — safe-area + dropdown overflow

### Tech decisions:
- **BottomNav state:** Dùng `useLocation()` hook — KHÔNG cần Zustand cho nav state
- **Safe-area CSS:** Dùng `env()` function — browser support 95%+ (iOS 11.2+, Chrome 69+)
- **BottomNav z-index:** `z-40` — dưới modals/sheets (`z-50`) nhưng trên content
- **BottomNav animation:** KHÔNG có mount/unmount animation — luôn visible trên mobile routes
- **Badge count:** Lấy từ messaging store (Zustand) — cùng source với Navbar badge
