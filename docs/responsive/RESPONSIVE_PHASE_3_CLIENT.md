# Phase 3: Touch Targets & Input System

> **Scope:** `careergraph-client`  
> **Phụ thuộc:** Phase 1 (CSS tokens, global input font-size rule)  
> **Pattern áp dụng:** 3d (Form), 3e (Touch)  
> **Có thể chạy song song với Phase 2**

---

## Mục tiêu

Đảm bảo TOÀN BỘ interactive elements đạt minimum 44×44px touch target trên mobile và tất cả input fields an toàn với iOS auto-zoom.

---

## Files in scope

### 1. `src/components/ui/button.jsx` — Touch Target Sizes

**Hiện trạng:**
```jsx
size: {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",      // 36px ❌
  sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",  // 32px ❌
  lg: "h-10 rounded-md px-6 has-[>svg]:px-4",     // 40px ❌
  icon: "size-9",       // 36×36px ❌
  "icon-sm": "size-8",  // 32×32px ❌
  "icon-lg": "size-10", // 40×40px ❌
}
```

**Vấn đề:** TẤT CẢ sizes đều dưới 44px minimum touch target.

**Thay đổi:**
```jsx
size: {
  default: "h-10 px-4 py-2 has-[>svg]:px-3",       // 40px (desktop), CSS rule → 44px trên mobile
  sm: "h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5", // 36px (desktop), CSS rule → 44px trên mobile
  lg: "h-11 rounded-md px-6 has-[>svg]:px-4",       // 44px ✅ đạt yêu cầu
  icon: "size-10",       // 40×40px, CSS rule → 44px trên mobile
  "icon-sm": "size-9",   // 36×36px, CSS rule → 44px trên mobile
  "icon-lg": "size-11",  // 44×44px ✅
}
```

**Strategy:**
- **Desktop:** Giữ sizes compact hơn cho density (không phải every button 44px)
- **Mobile:** Global CSS rule từ Phase 1 (`min-height: 44px` cho `button, [role="button"]`) sẽ enforce minimum
- **Explicit sizes** chỉ tăng 1 step: h-9→h-10, h-8→h-9, h-10→h-11
- **Icon sizes** tăng tương ứng: size-9→size-10, size-8→size-9, size-10→size-11

**Regression risk:** MED — buttons sẽ lớn hơn 1 step trên desktop. Cần verify layouts không bị ảnh hưởng.

---

### 2. `src/components/Search/SearchBar.jsx` — Input Font Size

**Hiện trạng:**
```jsx
<input className="flex-1 h-full pr-3 outline-none text-sm" />
<SelectTrigger className="pl-10 h-11 rounded-lg text-sm" />
```

**Vấn đề:**
- `text-sm` (14px) — iOS auto-zoom
- Phase 1 global CSS `!important` rule covers this, nhưng explicit fix tốt hơn

**Thay đổi:**
```diff
- <input className="flex-1 h-full pr-3 outline-none text-sm" />
+ <input className="flex-1 h-full pr-3 outline-none text-base md:text-sm" />

- <SelectTrigger className="pl-10 h-11 rounded-lg text-sm" />
+ <SelectTrigger className="pl-10 h-11 rounded-lg text-base md:text-sm" />
```

> **LÝ DO explicit fix:** Global CSS rule dùng `!important` là safety net. Explicit `text-base md:text-sm` là clean fix. Cả hai cùng tồn tại — không conflict.

---

### 3. `src/components/Chat/ChatPanel.jsx` — Textarea Font Size

**Hiện trạng:**
```jsx
<textarea className="w-full bg-transparent text-sm ... min-h-[40px] max-h-[120px]" />
```

**Vấn đề:**
- `text-sm` (14px) — iOS auto-zoom khi focus textarea
- `min-h-[40px]` — dưới 44px

**Thay đổi:**
```diff
- <textarea className="w-full bg-transparent text-sm ... min-h-[40px] max-h-[120px]" />
+ <textarea className="w-full bg-transparent text-base md:text-sm ... min-h-11 max-h-[120px]" />
```

| Property | Before | After | Lý do |
|----------|--------|-------|-------|
| Font size | `text-sm` (14px) | `text-base md:text-sm` | 16px mobile → 14px desktop |
| Min height | `min-h-[40px]` | `min-h-11` (44px) | Touch target minimum |

---

### 4. `src/components/ProfileDashboard/Sidebar.jsx` — Toggle Switch & Menu Items

**Hiện trạng:**
```jsx
{/* Toggle switch */}
<button className="h-7 w-[47px] rounded-full ...">
  <span className="h-6 w-6 rounded-full ..." />
</button>

{/* Menu items */}
<NavLink className="... py-3 px-3 ...">
  <Icon size={20} />
  <span className="text-[15px]">Menu Item</span>
</NavLink>
```

**Vấn đề:**
- Toggle: `h-7` = 28px — **far below 44px** touch target
- Menu items: `py-3 px-3` ≈ 36-40px — borderline
- `text-[15px]` — custom size, break design system

#### 4a. Toggle switch — extend tap area
```diff
- <button className="h-7 w-[47px] rounded-full ...">
+ <button className="relative h-7 w-[47px] rounded-full ..." aria-label="Toggle">
+   {/* Extended tap area */}
+   <span className="absolute -inset-2 md:hidden" aria-hidden="true" />
    <span className="h-6 w-6 rounded-full ..." />
  </button>
```

**Giải thích:**
- Visual toggle vẫn 28×47px (KHÔNG đổi visual)
- Extended tap area: thêm 8px mỗi bên = 44×63px touch area trên mobile
- `md:hidden` — chỉ extend trên mobile
- `-inset-2` tạo invisible tap zone lớn hơn

#### 4b. Menu items — increase padding
```diff
- <NavLink className="... py-3 px-3 ...">
+ <NavLink className="... py-3.5 px-3 ...">
```

> `py-3.5` = 14px top + 14px bottom + text ~16px ≈ 44px. Minimal change.

#### 4c. Text size normalize (optional)
```diff
- <span className="text-[15px]">
+ <span className="text-sm">
```
> Từ 15px → 14px (`text-sm`). Hoặc giữ nguyên nếu visual quá khác.

---

### 5. `src/pages/AccountSettings.jsx` — Dialog Input Font Size

**Hiện trạng:**
```jsx
<input
  type="email"
  className="bg-transparent text-slate-900 placeholder-slate-400 outline-none text-sm"
/>
```

**Vấn đề:** `text-sm` (14px) trong dialog inputs

**Thay đổi:**
```diff
- className="... text-sm"
+ className="... text-base md:text-sm"
```

**Áp dụng cho TẤT CẢ inputs trong AccountSettings:**
- Email change input
- Password change inputs (current, new, confirm)
- Any other form fields

---

### 6. `src/components/ProfileMenu/ProfileDropdown.jsx` — Touch Targets

**Hiện trạng:**
```jsx
<div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg z-50 p-2">
  {/* Menu items: px-3 py-2.5 text-sm */}
</div>
```

**Vấn đề:**
- Menu items `py-2.5` ≈ 36px — dưới 44px
- `w-56` (224px) — có thể overflow trên 320px phones

**Thay đổi:**
```diff
- className="... px-3 py-2.5 text-sm ..."
+ className="... px-3 py-3 text-sm ..."

- className="absolute right-0 mt-2 w-56 ..."
+ className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] ..."
```

---

## Không làm trong Phase 3

- ❌ Không đổi button variants/colors (chỉ sizes)
- ❌ Không đổi component API/props
- ❌ Không touch page layouts
- ❌ Không touch auth pages (Phase 2)
- ❌ Không touch messaging (Phase 6)
- ❌ Không touch CV Builder (Phase 4)
- ❌ Không touch AppliedJobs/SavedJobs (Phase 5)
- ❌ Không thêm new components
- ❌ Không refactor existing components

---

## QA Checklist — Phase 3

### Touch Targets (test trên iPhone SE 375px)
- [ ] Button default → tap area ≥ 44px height
- [ ] Button sm → tap area ≥ 44px height (via CSS rule)
- [ ] Button lg → 44px height explicit
- [ ] Button icon → tap area ≥ 44px
- [ ] Button icon-sm → tap area ≥ 44px (via CSS rule)
- [ ] Button icon-lg → 44px explicit
- [ ] Sidebar toggle switch → tap area ≥ 44px (extended inset)
- [ ] Sidebar menu items → tap area ≥ 44px
- [ ] ProfileDropdown items → tap area ≥ 44px

### Input Font Sizes (test trên iOS Safari)
- [ ] SearchBar input → focus KHÔNG trigger auto-zoom
- [ ] SearchBar select → focus KHÔNG trigger auto-zoom
- [ ] ChatPanel textarea → focus KHÔNG trigger auto-zoom
- [ ] AccountSettings email input → focus KHÔNG trigger auto-zoom
- [ ] AccountSettings password inputs → focus KHÔNG trigger auto-zoom

### Desktop Regression (test trên 1440px)
- [ ] Button sizes increased by 1 step — layouts NOT broken
- [ ] SearchBar visual giống nhau (text-sm trên desktop)
- [ ] ChatPanel textarea visual giống nhau
- [ ] Sidebar items slightly taller — acceptable spacing
- [ ] ProfileDropdown items slightly taller — acceptable

### Cross-page Verification
- [ ] Home page buttons (HeroSection) → touch targets OK
- [ ] Jobs page SearchBar → no auto-zoom
- [ ] JobDetail page buttons → touch targets OK
- [ ] Profile page Sidebar → toggle + items OK
- [ ] Any page with ChatBotPanel → textarea OK

---

## Implementation Notes

### Thứ tự implement:
1. `button.jsx` — size variants (ảnh hưởng toàn app)
2. Test button changes trên 3-4 pages
3. `SearchBar.jsx` — input font-size
4. `ChatPanel.jsx` — textarea font-size
5. `Sidebar.jsx` — toggle + menu items
6. `AccountSettings.jsx` — dialog inputs
7. `ProfileDropdown.jsx` — menu items + overflow

### Risk Assessment:
- **button.jsx:** HIGH — dùng ở mọi nơi. Tăng size có thể break layout ở pages có many buttons inline. Cần visual verify.
- **SearchBar:** LOW — isolated component
- **ChatPanel:** LOW — isolated component
- **Sidebar:** MED — menu items taller → sidebar longer → scroll nếu nhiều items
- **AccountSettings:** LOW — dialog context
- **ProfileDropdown:** LOW — dropdown overlay

### Fallback:
Nếu button size increase gây regression nghiêm trọng, có thể:
1. Giữ desktop sizes nguyên, chỉ add responsive: `h-9 md:h-9` → `h-9 min-h-[44px] md:min-h-0`
2. Hoặc chỉ rely on Phase 1 global CSS rule cho mobile minimum
