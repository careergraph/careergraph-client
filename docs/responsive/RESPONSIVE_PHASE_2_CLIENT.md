# Phase 2: Auth Pages — Fix Broken Mobile Layouts

> **Scope:** `careergraph-client`  
> **Phụ thuộc:** Phase 1 (CSS tokens, input font-size 16px global rule)  
> **Pattern áp dụng:** 3d (Form), 3g (Spacing)

---

## Mục tiêu

Fix 5 auth pages đang **hoàn toàn broken trên mobile** do `h-[700px]` fixed container:
- iPhone SE viewport height: 667px → form bị nén vào 667px container mà layout kỳ vọng 700px
- iPhone 12 landscape: ~380px height → form không thể render
- Tất cả inputs `text-sm` (14px) → iOS auto-zoom (đã fix global ở Phase 1)

---

## Files in scope

### 1. `src/pages/Login.jsx`

**Hiện trạng (BROKEN):**
```jsx
<div className="flex h-[700px] w-full gap-30">
  <div className="hidden lg:block w-1/2">
    <img className="object-contain max-h-[600px] w-auto" src={aiFeatureLoginImg} />
  </div>
  <div className="w-full lg:w-1/2 px-10">
    {/* Login form */}
    <input className="... text-sm ..." />
  </div>
</div>
```

**Vấn đề:**
1. `h-[700px]` — fixed height, vỡ trên mọi mobile
2. `gap-30` — 120px gap giữa image và form (quá lớn, có thể là bug)
3. `px-10` — 40px padding cả 2 bên, trên mobile 375px → content chỉ còn 295px
4. `text-sm` trên inputs — iOS auto-zoom (Phase 1 CSS fix sẽ override)
5. Image `max-h-[600px]` — không cần khi image hidden trên mobile

**Thay đổi:**
```diff
- <div className="flex h-[700px] w-full gap-30">
-   <div className="hidden lg:block w-1/2">
-     <img className="object-contain max-h-[600px] w-auto" src={aiFeatureLoginImg} />
+ <div className="flex flex-col lg:flex-row min-h-[calc(100dvh-5rem)] w-full lg:gap-16">
+   <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
+     <img className="object-contain max-h-[70vh] w-auto" src={aiFeatureLoginImg} />
    </div>
-   <div className="w-full lg:w-1/2 px-10">
+   <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 sm:px-10 py-8 lg:py-0">
```

**Chi tiết thay đổi:**

| Property | Before | After | Lý do |
|----------|--------|-------|-------|
| Container direction | `flex` (horizontal) | `flex flex-col lg:flex-row` | Mobile: stack dọc |
| Container height | `h-[700px]` (fixed) | `min-h-[calc(100dvh-5rem)]` | Dùng viewport dynamic height, trừ navbar |
| Gap | `gap-30` (120px) | `lg:gap-16` (64px) | Hợp lý hơn, chỉ trên desktop |
| Image wrapper | `hidden lg:block w-1/2` | `hidden lg:flex lg:w-1/2 items-center justify-center` | Center image |
| Image height | `max-h-[600px]` | `max-h-[70vh]` | Responsive theo viewport |
| Form wrapper | `w-full lg:w-1/2 px-10` | `w-full lg:w-1/2 px-6 sm:px-10 py-8 lg:py-0` | Responsive padding |
| Form padding | `px-10` everywhere | `px-6 sm:px-10` | Mobile: 24px, tablet+: 40px |
| Vertical padding | None | `py-8 lg:py-0` | Mobile: breathing room; desktop: center tự nhiên |

**Inputs — CSS global rule từ Phase 1 sẽ force `font-size: 16px` trên mobile.** 
Tuy nhiên, NẾU muốn explicit trong component:
```diff
- className="... text-sm ..."
+ className="... text-base md:text-sm ..."
```
> **QUYẾT ĐỊNH:** Dựa vào global CSS rule từ Phase 1. Không đổi class trên từng input trong auth pages — sẽ tạo inconsistency. Global rule `!important` đảm bảo 16px trên mobile.

---

### 2. `src/pages/Register.jsx`

**Hiện trạng (BROKEN) — giống Login:**
```jsx
<div className="flex h-[700px] w-full gap-30">
  <div className="hidden lg:block w-1/2">...</div>
  <div className="w-full lg:w-1/2 px-10">
    {/* Register form — nhiều fields hơn Login */}
  </div>
</div>
```

**Thay đổi — GIỐNG Login:**
```diff
- <div className="flex h-[700px] w-full gap-30">
+ <div className="flex flex-col lg:flex-row min-h-[calc(100dvh-5rem)] w-full lg:gap-16">

- <div className="hidden lg:block w-1/2">
+ <div className="hidden lg:flex lg:w-1/2 items-center justify-center">

- <img className="object-contain max-h-[600px] w-auto" ...>
+ <img className="object-contain max-h-[70vh] w-auto" ...>

- <div className="w-full lg:w-1/2 px-10">
+ <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 sm:px-10 py-8 lg:py-0">
```

**Đặc biệt cho Register:**
- Register có nhiều fields hơn (firstName, lastName, email, password, confirmPassword)
- Trên mobile 375px, form CẦN scroll → `min-h` thay vì `h` fixed đảm bảo scroll hoạt động
- Name fields (firstName + lastName) nếu đang inline → mobile nên stack:
```diff
- <div className="flex gap-4">
+ <div className="flex flex-col sm:flex-row gap-4">
    <input placeholder="First name" />
    <input placeholder="Last name" />
  </div>
```

---

### 3. `src/pages/ForgotPassword.jsx`

**Hiện trạng (BROKEN):**
```jsx
<div className="flex h-[700px] w-full gap-30">
  {/* Same pattern */}
</div>
```

**Thay đổi — GIỐNG Login pattern.** 

Form đơn giản hơn (chỉ 1 email input) → ít rủi ro overflow, nhưng `h-[700px]` vẫn phải fix.

---

### 4. `src/pages/VerifyOtp.jsx`

**Hiện trạng (BROKEN):**
```jsx
<div className="flex h-[700px] w-full gap-30">
  {/* Same pattern */}
</div>
```

**Thay đổi — GIỐNG Login pattern.**

OTP input đặc biệt:
- Nếu dùng individual digit inputs (4-6 ô) → đảm bảo mỗi ô ≥ 44px width + height
- Input `type="tel"` hoặc `inputMode="numeric"` → mobile keyboard hiện numpad
- Font-size trên OTP inputs phải ≥ 16px (Phase 1 CSS rule covers)

---

### 5. `src/pages/ResetPassword.jsx`

**Hiện trạng (BROKEN):**
```jsx
<div className="flex h-[700px] w-full gap-30">
  {/* Same pattern */}
</div>
```

**Thay đổi — GIỐNG Login pattern.**

---

## Pattern chung cho tất cả auth pages

### Before (BROKEN):
```
┌─────────────────────────────────────────────┐
│          h-[700px] container                │
│                                             │
│  ┌──────────┐  gap-30  ┌──────────────┐    │
│  │  Image   │ (120px)  │   Form       │    │
│  │  (hidden │          │   px-10      │    │
│  │  mobile) │          │   text-sm    │    │
│  └──────────┘          └──────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### After (RESPONSIVE):
```
MOBILE (< 768px):                    DESKTOP (≥ 1024px):
┌───────────────────┐                ┌──────────────────────────┐
│    px-6 py-8      │                │  ┌────────┐  gap-16  ┌──┤
│                   │                │  │ Image  │          │Fo│
│  ┌─────────────┐  │                │  │ center │          │rm│
│  │ Form        │  │                │  │ max-h  │          │  │
│  │ full width  │  │                │  │ 70vh   │          │  │
│  │ text-base   │  │                │  └────────┘          └──┤
│  │ (scrolls)   │  │                │    min-h-[calc(100dvh)] │
│  └─────────────┘  │                └──────────────────────────┘
│                   │
│  min-h-[calc...]  │
└───────────────────┘
```

---

## Không làm trong Phase 2

- ❌ Không đổi validation logic
- ❌ Không đổi API calls (login, register, etc.)
- ❌ Không đổi Google OAuth integration
- ❌ Không redesign visual (colors, shadows, borders)
- ❌ Không thêm social login buttons mới
- ❌ Không refactor form components
- ❌ Không touch Layout components (đã fix ở Phase 1)
- ❌ Không đổi routing/redirect logic
- ❌ Không thêm animation (chỉ fix layout)

---

## QA Checklist — Phase 2

### iPhone SE (375×667) — Portrait
- [ ] Login page: form hiển thị đầy đủ, KHÔNG bị cắt
- [ ] Login page: scroll hoạt động nếu form cao hơn viewport
- [ ] Register page: tất cả 5 fields + buttons visible
- [ ] Register page: firstName/lastName stack dọc trên mobile
- [ ] ForgotPassword: form center, KHÔNG bị nén
- [ ] VerifyOtp: OTP inputs ≥ 44px, numpad hiện
- [ ] ResetPassword: form center, KHÔNG bị nén
- [ ] ALL: Input focus KHÔNG trigger iOS auto-zoom
- [ ] ALL: Google Login button KHÔNG overflow viewport
- [ ] ALL: `px-6` padding trên mobile — content KHÔNG sát cạnh

### iPhone 15 (393×852) — Portrait
- [ ] ALL auth pages render hoàn hảo
- [ ] Form content centered vertically khi viewport đủ cao
- [ ] No horizontal overflow

### iPhone (any) — Landscape
- [ ] ALL auth pages: scroll works, form accessible
- [ ] Image vẫn hidden (lg:block)
- [ ] Form KHÔNG bị nén trong viewport thấp

### iPad (768×1024)
- [ ] Image vẫn hidden (chỉ hiện ≥ lg = 1024px)
- [ ] Form full-width, centered
- [ ] Padding `sm:px-10` đúng

### Desktop (1440px)
- [ ] Image hiện 50% left
- [ ] Form hiện 50% right
- [ ] Gap 64px giữa image và form
- [ ] Image max-height 70vh responsive
- [ ] Layout giống y hiện tại (chỉ khác gap giảm từ 120px → 64px)
- [ ] KHÔNG có regression visual

### Cross-browser
- [ ] Safari iOS — CRITICAL: verify không auto-zoom
- [ ] Chrome Android
- [ ] Firefox mobile (optional)

---

## Implementation Notes

### Thứ tự implement:
1. Login.jsx — template đầu tiên, validate pattern
2. Register.jsx — thêm name field stacking
3. ForgotPassword.jsx — simple, copy pattern
4. VerifyOtp.jsx — copy pattern + verify OTP input sizing
5. ResetPassword.jsx — copy pattern

### Risk:
- **GoogleLogin widget width:** Có thể cần `max-w-full` wrapper nếu widget render > viewport width
- **Password visibility toggle:** Nếu có icon bên trong input, touch target phải ≥ 44px
- **Error messages:** Khi invalid input hiện error text → form cao hơn → scroll nên hoạt động (min-h thay vì h fixed)

### Testing tip:
```bash
# Chrome DevTools → Toggle device toolbar → iPhone SE
# Focus vào input field → verify KHÔNG zoom in
# Nếu zoom in → Phase 1 CSS rule chưa hoạt động
```
