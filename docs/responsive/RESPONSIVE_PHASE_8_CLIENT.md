# Phase 8: Polish — Lazy Loading, Performance, Reduced Motion

> **Scope:** `careergraph-client`  
> **Phụ thuộc:** Tất cả phases trước (1-7)  
> **Pattern áp dụng:** Performance Checklist (Bước 5 từ RESPONSIVE_REDESIGN_PRODUCTION.md)

---

## Mục tiêu

Performance polish và quality-of-life fixes sau khi responsive layout hoàn chỉnh:
1. Image lazy loading toàn bộ app
2. Font loading optimization
3. Reduced motion support
4. Fix font variable bug
5. Empty state images responsive
6. Final accessibility pass

---

## Files in scope

### 1. Image Lazy Loading — Toàn bộ `<img>` tags

**Hiện trạng:** KHÔNG có bất kỳ `loading="lazy"` nào trong codebase (trừ Phase 5 fix JobsCardCommon).

**Strategy:**
- **Above-fold images** (NO lazy):`HeroSection` hero image, Navbar logo
- **Below-fold images** (ADD lazy): Company avatars, job logos, profile photos, empty states, footer assets, career guide images

**Files cần thêm `loading="lazy"`:**

| File | Image Element | Action |
|------|---------------|--------|
| `src/sections/Home/TrustedCompanies.jsx` | Company logos | Thêm `loading="lazy"` |
| `src/sections/Home/PersonalJobsSection.jsx` | Job card images (via JobCardPersonal) | Verify child component |
| `src/sections/Home/PopularJobsSection.jsx` | Job card images (via JobsCardCommon) | ✅ Phase 5 đã fix |
| `src/sections/Home/TestimonialsSection.jsx` | User avatars | Thêm `loading="lazy"` |
| `src/sections/Home/CategorySection.jsx` | Category images | Thêm `loading="lazy"` |
| `src/pages/JobDetail.jsx` | Company logo, similar jobs | Thêm `loading="lazy"` |
| `src/pages/CompanyDetail.jsx` | Company banner, logo | Banner: NO (above-fold), logo: YES |
| `src/pages/CareerGuide/*.jsx` | Article thumbnails | Thêm `loading="lazy"` |
| `src/components/ProfileDashboard/ProfileCard/ProfileCard.jsx` | User avatar | Thêm `loading="lazy"` |
| `src/pages/AppliedJobs.jsx` | Company logos | Thêm `loading="lazy"` |
| `src/pages/SavedJobs.jsx` | Company logos | Thêm `loading="lazy"` |
| `src/pages/FollowingCompanies.jsx` | Company logos | Thêm `loading="lazy"` |

**Implementation:**
```diff
- <img src={logo} alt="Company" />
+ <img src={logo} alt="Company" loading="lazy" />
```

**KHÔNG thêm lazy cho:**
- `HeroSection.jsx` hero image — above-fold, cần load ngay
- Navbar logo — above-fold
- Auth page decorative images — already `hidden lg:block`, mobile không load

---

### 2. Font Loading Optimization

**Hiện trạng (index.css):**
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;...0,900;1,100;...1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;...&display=swap');
```

**Vấn đề:**
1. Load TẤT CẢ weights (100-900) cho cả Poppins VÀ Roboto — nặng
2. `display=swap` — tốt, đã có
3. Load qua `@import` trong CSS — blocking render

**Thay đổi:**

#### 2a. Giảm font weights
```diff
- @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
+ @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

- @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,200;...&display=swap');
+ @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
```

**Weights giữ lại:**
- **Poppins:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Roboto:** 400 (normal), 500 (medium), 700 (bold)
- **Bỏ:** 100, 200, 300, 800, 900 — không dùng trong app
- **Bỏ italic:** Không thấy dùng `italic` variant nào trong codebase

**Impact:** ~60-70% giảm font download size.

#### 2b. Preload critical font (index.html)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```
> Verify nếu đã có trong index.html. Nếu chưa → thêm.

---

### 3. Fix Font Variable Bug

**Hiện trạng (index.css):**
```css
@theme {
    --font-poppins: "Roboto", sans-serif;
}
```

**Bug:** Variable tên `--font-poppins` nhưng value là `"Roboto"`.

**Thay đổi — 2 options:**

**Option A:** Fix value (nếu app muốn dùng Poppins)
```diff
- --font-poppins: "Roboto", sans-serif;
+ --font-poppins: "Poppins", sans-serif;
```

**Option B:** Fix variable name (nếu app muốn dùng Roboto)
```diff
- --font-poppins: "Roboto", sans-serif;
+ --font-roboto: "Roboto", sans-serif;
```
→ Và đổi `font-poppins` → `font-roboto` ở body class.

**QUYẾT ĐỊNH:** Cần verify visual hiện tại dùng font nào. Nếu Roboto đang render → Option A sẽ change visual. Nếu Poppins import nhưng không dùng → remove Poppins import.

> **Recommendation:** Giữ Roboto (hiện tại đang render), rename variable:
```diff
@theme {
-   --font-poppins: "Roboto", sans-serif;
+   --font-sans: "Roboto", "Poppins", sans-serif;
}
```
```diff
body {
-   @apply bg-white text-slate-800 text-sm font-poppins antialiased;
+   @apply bg-white text-slate-800 text-sm font-sans antialiased;
}
```

---

### 4. `prefers-reduced-motion` Support

**Thêm vào `src/index.css`:**
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

**Ảnh hưởng components:**
- Navbar mobile menu slide animation → instant
- ChatBotButton glow animation → disabled
- JobsSidebar translate-x animation → instant
- ChatPanel slide-in animation → instant
- Sheet animations → instant
- Marquee/carousel animations → stopped

---

### 5. Empty State Images — Final Responsive Pass

Verify tất cả empty state images đã có `max-w-full`:

| File | Image | Current | Target |
|------|-------|---------|--------|
| `AppliedJobs.jsx` | No applications | `w-[260px]` | `w-full max-w-[260px]` |
| `SavedJobs.jsx` | No saved jobs | `w-[360px]` (Phase 5 đã fix) | ✅ `w-full max-w-[360px]` |
| `MyInterviews.jsx` | No interviews | `w-[260px]` (Phase 5 đã fix) | ✅ `w-full max-w-[260px]` |
| `FollowingCompanies.jsx` | No companies | Verify | Verify — may already be responsive |
| `MessagesPage.jsx` | No messages | Verify | Add `max-w-full` if needed |

---

### 6. Accessibility Final Pass

#### 6a. Focus-visible styles
```css
/* Add to index.css */
:focus-visible {
  outline: 2px solid oklch(0.546 0.245 262.881); /* indigo-600 */
  outline-offset: 2px;
}

/* Remove focus ring for mouse clicks */
:focus:not(:focus-visible) {
  outline: none;
}
```

#### 6b. Skip to content link
Thêm vào `DefaultLayout.jsx`:
```jsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
>
  Skip to content
</a>
```

Và thêm `id="main-content"` vào main content div.

---

## Không làm trong Phase 8

- ❌ Không thêm service worker / PWA
- ❌ Không thêm swipe gestures
- ❌ Không đổi business logic
- ❌ Không refactor components
- ❌ Không thêm skeleton loading states (separate feature)
- ❌ Không setup image CDN / srcset
- ❌ Không add code splitting (already handled by Vite)
- ❌ Không touch analytics/tracking

---

## QA Checklist — Phase 8

### Performance (Lighthouse Mobile)
- [ ] Performance score > 80
- [ ] Accessibility score > 90
- [ ] LCP < 2.5s (Largest Contentful Paint)
- [ ] CLS < 0.1 (Cumulative Layout Shift)
- [ ] FID < 100ms (First Input Delay)
- [ ] Below-fold images: network tab shows `loading="lazy"` attribute
- [ ] Above-fold images: load immediately (no lazy)

### Font Loading
- [ ] Poppins/Roboto load with only needed weights (4-5 max)
- [ ] `font-display: swap` in Google Fonts URL
- [ ] `preconnect` to fonts.googleapis.com
- [ ] No FOUT (Flash of Unstyled Text) longer than 200ms
- [ ] Font variable correctly mapped to displayed font

### Reduced Motion
- [ ] Enable "Reduce motion" in OS settings
- [ ] ChatBotButton glow animation: stopped
- [ ] Navbar mobile menu: instant appear (no slide)
- [ ] ChatPanel: instant appear (no slide)
- [ ] Sheet: instant open/close
- [ ] Page transitions: no animation

### Accessibility
- [ ] Tab through entire page: focus ring visible on all interactive elements
- [ ] Focus ring color: indigo, 2px offset
- [ ] Mouse click: no focus ring (only focus-visible)
- [ ] Skip to content link: visible on Tab, functional

### Empty States
- [ ] ALL empty state images: responsive (max-w-full)
- [ ] No horizontal scroll from oversized images on any page

### Cross-browser Final
- [ ] Safari iOS 16+ — all features working
- [ ] Chrome Android — all features working
- [ ] Firefox Android — reduced motion + lazy loading
- [ ] Samsung Internet — lazy loading

---

## Implementation Notes

### Thứ tự implement:
1. Font variable bug fix + weight reduction (index.css + index.html)
2. `prefers-reduced-motion` rule (index.css)
3. Focus-visible styles (index.css)
4. Image lazy loading audit (all files)
5. Empty state images final check
6. Skip to content link (DefaultLayout)
7. Lighthouse audit + fix any remaining issues

### Risk:
- **Font change:** Nếu fix `--font-poppins` → actual font change → toàn app visual change. Test carefully.
- **Font weight removal:** App có dùng font-weight 300 (light) hoặc 800 (extrabold)?
  - Search codebase cho: `font-light`, `font-thin`, `font-extralight`, `font-extrabold`, `font-black`
  - Nếu có → giữ weight tương ứng
  - `font-extrabold` (800) thấy trong Sidebar — **giữ weight 800 cho Poppins**
- **Lazy loading:** Nếu thêm lazy vào above-fold images → LCP tệ hơn. Chỉ thêm cho below-fold.
- **Reduced motion:** Some users expect subtle animations — `0.01ms` quá aggressive? Option: `200ms` thay vì kill hoàn toàn.

### Priority nếu thiếu thời gian:
1. Image lazy loading — biggest perf win
2. Font weight reduction — second biggest
3. Reduced motion — accessibility compliance
4. Focus-visible — accessibility compliance
5. Font variable fix — correctness
6. Skip to content — nice-to-have
