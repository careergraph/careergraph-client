# Phase 5: Applied Jobs, Saved Jobs, Interviews — Card & List Fixes

> **Scope:** `careergraph-client`  
> **Phụ thuộc:** Phase 1 (CSS tokens, safe-area), Phase 3 (touch targets, input sizes)  
> **Pattern áp dụng:** 3b (Table→Card), 3e (Touch), 3g (Spacing)  
> **Có thể chạy song song với Phase 4, 6, 7**

---

## Mục tiêu

Fix responsive issues trên 4 list/card pages quan trọng nhất cho candidate:
1. Custom Select dropdowns overflow mobile viewport
2. Save/action buttons dưới 44px touch target
3. Empty state images overflow
4. Custom font sizes (`text-[17px]`, `text-[13px]`) cần normalize
5. Image lazy loading (chuẩn bị cho Phase 8 nhưng fix sẵn critical images)

---

## Files in scope

### 1. `src/pages/AppliedJobs.jsx`

**Hiện trạng:**
```jsx
{/* Custom Select */}
<button className="flex h-10 min-w-[220px] items-center justify-between rounded-xl 
  border border-slate-200 bg-white px-4 text-sm text-slate-700">
  Sort/Filter
</button>

{/* Job card */}
<div className="flex items-start gap-4 ...">
  <img className="size-[64px]" ... />
  <div className="min-w-0 grow">
    <h3 className="text-[17px]">Job Title</h3>
    <p className="text-[13px]">Meta info</p>
  </div>
  <button className="rounded-full p-2">
    <Heart size={22} /> {/* ~36px total touch area */}
  </button>
</div>
```

**Vấn đề:**
1. `min-w-[220px]` — trên 375px viewport với padding, button overflow
2. `h-10` (40px) — dưới 44px
3. `text-sm` — iOS auto-zoom (covered by Phase 1/3)
4. `text-[17px]`, `text-[13px]` — custom sizes, break system
5. Heart button `p-2` + icon 22px = 38px — dưới 44px

**Thay đổi:**

#### 1a. Custom Select responsive
```diff
- <button className="flex h-10 min-w-[220px] ..."
+ <button className="flex h-11 w-full sm:w-auto sm:min-w-[220px] ..."
```
- Mobile: `w-full` (full width, không overflow)
- Tablet+: `sm:min-w-[220px]` (giữ nguyên min-width)
- Height: `h-10` → `h-11` (44px touch target)

#### 1b. Font sizes normalize
```diff
- <h3 className="text-[17px]">
+ <h3 className="text-base">   {/* 16px — standard */}

- <p className="text-[13px]">
+ <p className="text-sm">      {/* 14px — standard */}
```

#### 1c. Save button touch target
```diff
- <button className="rounded-full p-2">
-   <Heart size={22} />
+ <button className="rounded-full p-2.5">
+   <Heart size={20} />
```
- `p-2.5` (10px) + icon 20px + 10px = 40px visual
- Phase 1 global CSS rule ensures 44px min-height trên mobile

**Hoặc explicit approach:**
```diff
- <button className="rounded-full p-2">
+ <button className="relative rounded-full p-2">
+   <span className="absolute -inset-1.5 md:hidden" aria-hidden="true" />
    <Heart size={22} />
  </button>
```

---

### 2. `src/pages/SavedJobs.jsx`

**Hiện trạng:**
```jsx
{/* Job card */}
<div className="flex items-start gap-4 rounded-xl border bg-white p-4">
  <div className="size-[64px]">
    <img src={avatarSrc} className="w-16 h-16 rounded-lg" />
  </div>
  <div className="min-w-0 grow">
    <h3 className="text-[17px]">Job Title</h3>
    <p className="text-[13px]">Meta</p>
  </div>
  <button className="rounded-full p-2">
    <Heart size={22} />
  </button>
</div>

{/* Empty state */}
<img src={noDataImg} className="w-[360px] h-auto opacity-95" />
```

**Vấn đề:**
1. `text-[17px]`, `text-[13px]` — custom sizes
2. Heart button touch area ~36-38px
3. Empty state `w-[360px]` — overflow trên phones \<360px

**Thay đổi:**

#### 2a. Font sizes (giống AppliedJobs)
```diff
- <h3 className="text-[17px]">
+ <h3 className="text-base">

- <p className="text-[13px]">
+ <p className="text-sm">
```

#### 2b. Save button (giống AppliedJobs pattern)
```diff
- <button className="rounded-full p-2">
+ <button className="relative rounded-full p-2">
+   <span className="absolute -inset-1.5 md:hidden" aria-hidden="true" />
```

#### 2c. Empty state image responsive
```diff
- <img src={noDataImg} className="w-[360px] h-auto opacity-95" />
+ <img src={noDataImg} className="w-full max-w-[360px] h-auto opacity-95" />
```
- `w-full` — co theo container trên mobile
- `max-w-[360px]` — giới hạn trên desktop

---

### 3. `src/pages/MyInterviews.jsx`

**Hiện trạng:**
```jsx
{/* Filter dropdown */}
<button className="flex h-10 min-w-[200px] items-center justify-between rounded-xl 
  border border-slate-200 bg-white px-4 text-sm">

{/* Interview card */}
<div className="rounded-2xl bg-white p-4 shadow-sm">
  <h3 className="text-base">Interview Title</h3>
  <p className="text-[13px]">Date/time</p>
  {/* Action buttons: size={16}, size={14} icons */}
</div>

{/* Empty state */}
<img className="w-[260px] h-auto opacity-90" />

{/* Modal */}
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
  <div className="w-full max-w-md rounded-2xl bg-white p-6">
```

**Vấn đề:**
1. `min-w-[200px]` + `h-10` — overflow + dưới 44px
2. `text-[13px]` — custom size
3. Action icon buttons `size={14}`, `size={16}` — quá nhỏ
4. Empty state `w-[260px]` — overflow trên phones rất nhỏ
5. Modal inputs `text-sm` (Phase 1/3 covers)

**Thay đổi:**

#### 3a. Filter dropdown
```diff
- <button className="flex h-10 min-w-[200px] ..."
+ <button className="flex h-11 w-full sm:w-auto sm:min-w-[200px] ..."
```

#### 3b. Font sizes
```diff
- <p className="text-[13px]">
+ <p className="text-sm">
```

#### 3c. Action button icons
```diff
- <button className="..."><MessageSquare size={14} /></button>
+ <button className="... p-2"><MessageSquare size={18} /></button>
```
- Tăng icon size: 14→18px
- Thêm `p-2` padding = 8+18+8 = 34px visual, Phase 1 CSS ensures 44px touch

#### 3d. Empty state image
```diff
- <img className="w-[260px] h-auto opacity-90" />
+ <img className="w-full max-w-[260px] h-auto opacity-90" />
```

#### 3e. Modal mobile adjustment (optional)
```diff
- <div className="w-full max-w-md rounded-2xl bg-white p-6">
+ <div className="w-full max-w-md rounded-2xl bg-white p-4 sm:p-6 mx-4 sm:mx-auto">
```
- `p-4 sm:p-6` — giảm padding trên mobile
- `mx-4 sm:mx-auto` — margin trên mobile để không sát cạnh

---

### 4. `src/components/Cards/JobsCardCommon.jsx`

**Hiện trạng:**
```jsx
<div className="max-w-[300px] rounded-lg shadow p-4">
  <div className="size-14"> {/* 56px */}
    <img src={job.companyAvatar} className="size-full object-cover" />
  </div>
  <h2 className="text-base font-semibold">{title}</h2>
  <p className="text-xs text-slate-500">{summary}</p>
  <div className="text-[10px]">{badge}</div>
</div>
```

**Vấn đề:**
1. `max-w-[300px]` — có thể narrow trên mobile khi parent allows full width
2. NO `loading="lazy"` trên image
3. `text-[10px]` — nhỏ nhưng OK cho badge

**Thay đổi:**

#### 4a. Image lazy loading
```diff
- <img src={job.companyAvatar} className="size-full object-cover" />
+ <img src={job.companyAvatar} className="size-full object-cover" loading="lazy" />
```

#### 4b. Card width (optional — depends on parent grid)
```diff
- className="max-w-[300px] ..."
+ className="max-w-[300px] w-full ..."
```
- Thêm `w-full` để card fill parent container trên mobile grid

---

## Không làm trong Phase 5

- ❌ Không đổi sort/filter logic
- ❌ Không đổi API calls
- ❌ Không redesign card visual (colors, shadows, borders)
- ❌ Không touch FollowingCompanies (đã GOOD)
- ❌ Không touch SearchBar (Phase 3)
- ❌ Không touch messaging pages (Phase 6)
- ❌ Không thêm pull-to-refresh / infinite scroll
- ❌ Không đổi custom Select dropdown component logic (chỉ sizing)

---

## QA Checklist — Phase 5

### iPhone SE (375×667) — Portrait
- [ ] AppliedJobs: filter dropdown `w-full` — KHÔNG overflow
- [ ] AppliedJobs: filter dropdown touch target 44px
- [ ] AppliedJobs: save button touch area ≥ 44px
- [ ] AppliedJobs: font sizes standard (`text-base`, `text-sm`)
- [ ] SavedJobs: empty state image fits within viewport width
- [ ] SavedJobs: save button touch area ≥ 44px
- [ ] SavedJobs: card layout KHÔNG overflow
- [ ] MyInterviews: filter dropdown `w-full` — KHÔNG overflow
- [ ] MyInterviews: action buttons touch area ≥ 44px
- [ ] MyInterviews: empty state image fits viewport
- [ ] MyInterviews: reschedule modal KHÔNG sát cạnh, có margin
- [ ] JobsCardCommon: image has `loading="lazy"` attribute

### iPad (768×1024)
- [ ] Filter dropdowns: `sm:min-w-[200-220px]` — proper width
- [ ] Cards display correctly trong grid
- [ ] Empty states centered

### Desktop (1440px)
- [ ] AppliedJobs layout giống nhau (font-size changes minimal)
- [ ] SavedJobs layout giống nhau
- [ ] MyInterviews layout giống nhau
- [ ] Card widths `max-w-[300px]` preserved

### Cross-device
- [ ] Samsung Galaxy (360px width) — narrowest common Android
- [ ] Filter dropdowns fit 360px with padding
- [ ] Empty state images fit 360px

---

## Implementation Notes

### Thứ tự implement:
1. `JobsCardCommon.jsx` — lazy loading (simplest)
2. `AppliedJobs.jsx` — custom select + font sizes + button
3. `SavedJobs.jsx` — copy patterns from AppliedJobs
4. `MyInterviews.jsx` — same patterns + modal adjustment

### Custom Select component notes:
- Custom select renders via `createPortal` to body
- Portal positioning: `getBoundingClientRect()` — will adapt to new button size
- Dropdown width matches trigger width — `w-full` trigger → full-width dropdown trên mobile
- **Verify:** dropdown `max-h-60` (240px) adequate trên mobile viewport

### Font size impact:
- `text-[17px]` → `text-base` (16px): giảm 1px — barely noticeable
- `text-[13px]` → `text-sm` (14px): tăng 1px — slightly more readable
- **Risk:** Rất thấp, visual change minimal
