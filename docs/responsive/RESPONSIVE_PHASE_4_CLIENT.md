# Phase 4: CV Builder — Mobile PDF Experience

> **Scope:** `careergraph-client`  
> **Phụ thuộc:** Phase 1 (CSS tokens), Phase 3 (input font-size fixes)  
> **Pattern áp dụng:** 3d (Form), 3g (Spacing), Custom (tab toggle)

---

## Mục tiêu

Fix CV Builder page — hiện tại `h-[900px]` PDF preview tạo 2.4x viewport height trên mobile. Redesign thành tab-toggle editor ↔ preview trên mobile.

---

## Files in scope

### 1. `src/pages/CVBuilder.jsx`

**Hiện trạng (BROKEN):**
```jsx
<main className="mx-auto max-w-[1600px] space-y-8 px-4 pb-20 pt-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div>
      <CVEditor {...} />
    </div>
    <div className="h-[900px] lg:sticky lg:top-24">
      <PdfPreview {...} />
    </div>
  </div>
</main>
```

**Vấn đề:**
1. `h-[900px]` — PDF preview chiếm 900px trên mobile (viewport ~667px = 1.35x)
2. Grid `grid-cols-1 lg:grid-cols-2` — mobile stack editor rồi preview 900px phía dưới
3. User phải scroll 900px qua preview để thấy anything below
4. Form inputs trong CVEditor — `text-sm` (Phase 1/3 sẽ fix)

**Thay đổi — Mobile Tab Toggle:**

```
MOBILE (<768px):                        DESKTOP (≥1024px):
┌─────────────────────┐                 ┌──────────────────────────┐
│ [✏️ Editor] [📄 PDF] │ ← tab bar     │  ┌──────┐   ┌──────────┐│
│─────────────────────│                 │  │Editor│   │PDF       ││
│                     │                 │  │      │   │Preview   ││
│  (CVEditor)         │                 │  │      │   │sticky    ││
│  hoặc               │                 │  │      │   │h-[900px] ││
│  (PdfPreview)       │                 │  │      │   │          ││
│                     │                 │  └──────┘   └──────────┘│
└─────────────────────┘                 └──────────────────────────┘
```

**Design specs cho mobile tab toggle:**

```jsx
// State
const [activeTab, setActiveTab] = useState("editor"); // "editor" | "preview"

// Tab bar (chỉ hiện trên mobile)
<div className="flex gap-1 rounded-xl bg-slate-100 p-1 lg:hidden">
  <button
    onClick={() => setActiveTab("editor")}
    className={cn(
      "flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors",
      activeTab === "editor"
        ? "bg-white text-indigo-600 shadow-sm"
        : "text-slate-500 hover:text-slate-700"
    )}
  >
    ✏️ Soạn CV
  </button>
  <button
    onClick={() => setActiveTab("preview")}
    className={cn(
      "flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors",
      activeTab === "preview"
        ? "bg-white text-indigo-600 shadow-sm"
        : "text-slate-500 hover:text-slate-700"
    )}
  >
    📄 Xem trước
  </button>
</div>
```

**Layout thay đổi:**
```diff
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
-   <div>
+   <div className={cn(activeTab === "editor" ? "block" : "hidden lg:block")}>
      <CVEditor {...} />
    </div>
-   <div className="h-[900px] lg:sticky lg:top-24">
+   <div className={cn(
+     "lg:sticky lg:top-24",
+     activeTab === "preview" ? "block" : "hidden lg:block",
+     "h-[calc(100dvh-12rem)] lg:h-[900px]"
+   )}>
      <PdfPreview {...} />
    </div>
  </div>
```

**Chi tiết thay đổi:**

| Property | Before | After | Lý do |
|----------|--------|-------|-------|
| PDF preview height | `h-[900px]` | `h-[calc(100dvh-12rem)] lg:h-[900px]` | Mobile: viewport - navbar - tabs - padding. Desktop: giữ nguyên |
| Editor visibility | Luôn hiện | `activeTab === "editor" ? "block" : "hidden lg:block"` | Mobile: toggle; Desktop: luôn hiện |
| Preview visibility | Luôn hiện | `activeTab === "preview" ? "block" : "hidden lg:block"` | Mobile: toggle; Desktop: luôn hiện |
| Tab bar | Không có | `lg:hidden` tab switcher | Mobile only |

**Tính toán height mobile:**
- Viewport: 100dvh (~667px iPhone SE)
- Navbar: ~4.5rem (72px)
- Tab bar: ~3rem (48px)
- Padding: ~2rem (32px)
- Safe area bottom: ~2.5rem (40px)
- **Available:** 100dvh - 12rem ≈ 475px — đủ cho PDF preview scroll

---

### 2. CV Editor Form Inputs

CVEditor component (nếu có internal form inputs):
- Phase 1 global CSS rule covers `font-size: 16px` trên mobile
- Phase 3 covers explicit `text-base md:text-sm` nếu cần
- **Không cần thay đổi thêm** trong Phase 4 — shared fixes đã cover

---

## Không làm trong Phase 4

- ❌ Không đổi PDF rendering logic (@react-pdf/renderer)
- ❌ Không đổi CV template components
- ❌ Không touch CVTemplates page (đã tốt — grid `1→2→3` cols)
- ❌ Không đổi CV data model/API
- ❌ Không thêm swipe giữa editor ↔ preview (simple tab toggle đủ)
- ❌ Không đổi PDF export functionality
- ❌ Không touch textarea min-h/max-h (Phase 3 xử lý)

---

## QA Checklist — Phase 4

### iPhone SE (375×667)
- [ ] Tab bar hiện 2 tabs: "Soạn CV" và "Xem trước"
- [ ] Default tab = "Soạn CV" → CVEditor hiện, PdfPreview ẩn
- [ ] Tap "Xem trước" → PdfPreview hiện, CVEditor ẩn
- [ ] PdfPreview height ≈ viewport - 12rem — KHÔNG overflow
- [ ] PdfPreview scrollable nếu PDF cao hơn container
- [ ] Switching tabs KHÔNG mất form data (state giữ nguyên)
- [ ] Tab bar touch targets ≥ 44px height
- [ ] NO horizontal scroll
- [ ] Form inputs KHÔNG trigger iOS auto-zoom

### iPad (768×1024)
- [ ] Tab bar ẩn (`lg:hidden` — nhưng iPad dưới lg)
- [ ] Verify behavior: iPad 768px < lg (1024px) → tab bar VẪN HIỆN trên tablet
- [ ] Toggle hoạt động đúng trên tablet
- [ ] Preview height responsive

### Desktop (1440px)
- [ ] Tab bar ẨN hoàn toàn
- [ ] Side-by-side layout: Editor left, Preview right
- [ ] Preview sticky `top-24`
- [ ] Preview height `h-[900px]` — giữ nguyên
- [ ] KHÔNG regression visual

### Form Data Persistence
- [ ] Fill form → switch to preview → switch back → data vẫn còn
- [ ] Edit form → preview updates real-time (nếu có live preview)

---

## Implementation Notes

### State management:
- `activeTab` local state (`useState`) — KHÔNG cần Zustand
- KHÔNG dùng URL params (#editor / #preview) — quá phức tạp cho benefit nhỏ

### Animation (optional):
- Tab content switch: NO animation — instant switch
- Tab indicator: transition-colors 150ms (đã có trong className)

### Breakpoint choice:
- `lg:hidden` cho tab bar = 1024px
- Trên tablet (768-1023px): tab bar VẪN hiện — acceptable vì tablet single-column PDF preview cũng hẹp
- Nếu muốn tablet hiện side-by-side: đổi `lg:` → `md:` — nhưng 768px width / 2 = 384px mỗi bên → quá hẹp cho editor
- **QUYẾT ĐỊNH:** Giữ `lg:` — tablet dùng tab toggle giống mobile
