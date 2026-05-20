# TASK: Responsive Redesign — Production Enterprise Standard
> **Tiêu chuẩn:** Ngang tầm Figma app, Linear, GitHub — không phải "thêm breakpoint cho xong"  
> **Scope:** HR FE (React TS) + Client FE (React JS)  
> **Agent phải là:** Senior Frontend Engineer có chiều sâu về responsive UX, không chỉ là người thêm CSS

---

## 🎯 Triết lý responsive production-grade

### Không phải "shrink desktop xuống mobile"
Mobile là trải nghiệm riêng biệt với interaction model khác:
- Desktop: hover, click chính xác, keyboard, nhiều màn hình
- Mobile: thumb zone, swipe, tap không chính xác, 1 màn hình, mạng chậm hơn

### Breakpoint strategy
```
Mobile:  320px – 767px   → design cho 375px (iPhone standard)
Tablet:  768px – 1023px  → design cho 834px (iPad)
Desktop: 1024px+          → design cho 1440px (standard laptop)
```

### Thứ tự ưu tiên fix
```
1. Navigation & Layout shell → ảnh hưởng toàn bộ app
2. Common components (Table, Modal, Form, Card) → dùng ở nhiều nơi
3. High-traffic pages (Dashboard, Jobs list, Applications) → user thấy nhiều nhất  
4. Secondary pages → theo thứ tự traffic
5. Admin/rare pages → last hoặc skip nếu không cần mobile
```

---

## 📋 BƯỚC 1 — Audit toàn bộ source (output ra file plan)

Agent đọc toàn bộ source và tạo inventory đầy đủ.

### 1a. Tech stack check
```
Đọc và ghi rõ:
- CSS framework: Tailwind / CSS Modules / Styled-components / SASS?
- Breakpoints hiện tại: custom hay framework default?
- Component library: Ant Design / MUI / Shadcn / Custom?
- Icon library: Lucide / Heroicons / FontAwesome?
- Router: v5 / v6?
- Có CSS-in-JS không?
- Font loading strategy: Google Fonts / local?
```

### 1b. Scan pages — ghi đủ thông tin
Với TỪNG page/route, ghi:
```
Page: /dashboard (DashboardPage.tsx)
  Layout: 4-column metric grid + 2-column charts
  Navigation context: sidebar left (240px fixed)
  Current responsive: không có breakpoint nào
  Issues:
    - Sidebar đè lên content trên màn 1024px
    - Metric cards chỉ hiện 2 trên iPhone 375px (vỡ grid)
    - Charts bị clip, không responsive
    - Header bị overflow trên 375px
  Mobile UX need: bottom nav + collapsible sidebar + single column
  Effort: Large (2 ngày)
  Priority: P0 — trang đầu tiên HR thấy
```

### 1c. Scan components — chú ý đặc biệt:
```
Các component thường gặp vấn đề nhất:
- DataTable / Table: nhiều cột → mobile cần card view hoặc horizontal scroll + sticky first col
- Modal / Drawer: full-screen trên mobile, không popup nhỏ giữa màn
- Form: label và input phải stack dọc trên mobile, không inline
- Dropdown / Select: native select trên mobile hoặc bottom sheet
- Tabs: scroll horizontally nếu nhiều tab, không bị clip
- DatePicker: bottom sheet trên mobile
- Sidebar navigation: drawer (slide from left) trên mobile
- Header/Navbar: hamburger menu trên mobile
- Kanban board: scroll ngang hoặc single column trên mobile
- Chat layout: full screen switch giữa list và chat
```

---

## 📋 BƯỚC 2 — Chia Phase (agent tự quyết định số phase)

**Quy tắc chia:**
- Phase 1 LUÔN là Foundation (navigation, layout shell, breakpoint tokens)
- Mỗi phase ≤ 4–5 components/pages lớn
- Shared components phải fix trước pages dùng chúng
- P0 pages → phases đầu, P2 pages → phases cuối

**Template mỗi phase:**
```
Phase N: [Tên]
Thời gian: X ngày
Phụ thuộc: Phase N-1 phải done
Files in scope: [list cụ thể]
Không làm: [list rõ những gì KHÔNG thuộc phase này]
DoD (Definition of Done):
  - [ ] checklist 1
  - [ ] checklist 2
```

---

## 📋 BƯỚC 3 — Design Patterns bắt buộc

Agent PHẢI implement đúng các pattern sau, không được tự ý dùng pattern khác:

### 3a. Navigation Pattern

**Desktop (≥ 1024px):**
```
Layout: Fixed sidebar 240px + main content
Sidebar: Logo + Nav items + User info
Active state: background highlight + left border indicator
```

**Tablet (768–1023px):**
```
Layout: Sidebar collapse xuống 64px (icon only) + main content
Sidebar: chỉ hiện icon, hover tooltip hiện label
Toggle button để expand về 240px
```

**Mobile (< 768px):**
```
Layout: Full screen content + Bottom navigation bar
Sidebar: ẩn hoàn toàn
Bottom nav: max 5 items (icon + label), badge cho notification
Hamburger → drawer slide from left (overlay) cho secondary nav
```

```typescript
// Navigation component structure:

// useSidebar hook
const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);     // mobile drawer
  const [isCollapsed, setIsCollapsed] = useState(false); // tablet collapse
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  
  return { isOpen, setIsOpen, isCollapsed, setIsCollapsed, isMobile, isTablet };
};

// Render logic:
// isMobile → BottomNav + MobileDrawer
// isTablet → CollapsedSidebar (icon only)
// desktop → FullSidebar
```

### 3b. Table / Data Grid Pattern

**Desktop:** Full table với tất cả cột, sort, filter

**Tablet:** Ẩn 1–2 cột ít quan trọng nhất, còn lại giữ nguyên

**Mobile → Card List View (KHÔNG dùng horizontal scroll cho data tables)**
```typescript
// TableOrCards component
const TableOrCards = ({ data, columns, ...props }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  if (isMobile) {
    return (
      <div className="card-list">
        {data.map(row => (
          <MobileCard key={row.id} row={row} columns={columns} />
        ))}
      </div>
    );
  }
  
  return <Table data={data} columns={columns} {...props} />;
};

// MobileCard: hiện primary info lớn + secondary info nhỏ + action buttons
// Layout:
// ┌─────────────────────────────────────┐
// │ [Avatar] Tên Ứng Viên               │ ← primary
// │          Frontend Developer · HCM   │ ← secondary
// │          ─────────────────────────  │
// │          Trạng thái: [Đang xem xét] │ ← badge
// │          Ứng tuyển: 15/03/2024      │ ← metadata
// │                          [Xem] [...] │ ← actions
// └─────────────────────────────────────┘
```

### 3c. Modal / Sheet Pattern

**Desktop:** Modal center màn hình, max-width 560px, backdrop blur

**Mobile → Bottom Sheet (KHÔNG dùng modal nhỏ giữa màn)**
```typescript
const ModalOrSheet: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
        {children}
      </BottomSheet>
    );
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </Modal>
  );
};

// BottomSheet:
// - Slide up from bottom
// - Drag handle ở trên cùng
// - max-height: 90vh, overflow-y: auto
// - Close khi swipe down hoặc click backdrop
// - animation: translateY(100%) → translateY(0)
```

### 3d. Form Pattern

**Desktop:** Label bên trái (width 120px) + Input bên phải, hoặc Label trên + Input dưới

**Mobile → LUÔN Label trên + Input dưới, full width**
```css
/* Form layout responsive */
.form-field {
  display: grid;
  grid-template-columns: 120px 1fr; /* desktop: 2 col */
  gap: 8px;
  align-items: flex-start;
}

@media (max-width: 767px) {
  .form-field {
    grid-template-columns: 1fr; /* mobile: 1 col */
    gap: 4px;
  }
}

/* Input trên mobile: min 44px height, font-size min 16px (tránh auto-zoom iOS) */
@media (max-width: 767px) {
  input, select, textarea {
    min-height: 44px;
    font-size: 16px; /* QUAN TRỌNG: 16px để iOS không zoom */
  }
}
```

### 3e. Touch Targets

```css
/* TẤT CẢ interactive elements trên mobile phải min 44x44px */
@media (max-width: 767px) {
  button, [role="button"], a, label[for], 
  input[type="checkbox"], input[type="radio"] {
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Extend tap area mà không thay đổi visual */
  .small-icon-btn {
    position: relative;
    padding: 10px;
  }
  .small-icon-btn::after {
    content: '';
    position: absolute;
    inset: -8px;
  }
}
```

### 3f. Typography Scale Responsive

```css
/* Tất cả text scale theo viewport */
h1 { font-size: clamp(20px, 4vw, 30px); }
h2 { font-size: clamp(18px, 3vw, 24px); }
h3 { font-size: clamp(16px, 2.5vw, 20px); }
body { font-size: clamp(14px, 2vw, 16px); }

/* Line height thoải mái hơn trên mobile */
@media (max-width: 767px) {
  body { line-height: 1.6; }
  p { line-height: 1.7; }
}
```

### 3g. Spacing Scale Mobile

```css
/* Giảm spacing trên mobile, không giữ nguyên desktop spacing */
.dashboard-grid { padding: 24px; gap: 16px; }
@media (max-width: 767px) {
  .dashboard-grid { padding: 16px; gap: 12px; }
}

/* Page padding responsive */
.page-container { padding: 32px 40px; }
@media (max-width: 1024px) { .page-container { padding: 24px 28px; } }
@media (max-width: 767px) { .page-container { padding: 16px; } }
```

---

## 📋 BƯỚC 4 — Đặc biệt với Client FE (Candidate)

Client FE cần mobile-first hơn HR:

### Bottom Navigation (PHẢI CÓ trên mobile):
```typescript
// Bottom nav items cho candidate:
const BOTTOM_NAV = [
  { icon: HomeIcon, label: 'Trang chủ', path: '/' },
  { icon: SearchIcon, label: 'Tìm việc', path: '/jobs' },
  { icon: FileTextIcon, label: 'Đã ứng tuyển', path: '/applications', badge: unreadCount },
  { icon: MessageCircleIcon, label: 'Tin nhắn', path: '/messages', badge: unreadMessages },
  { icon: UserIcon, label: 'Hồ sơ', path: '/profile' },
];

// Safe area inset cho iPhone notch
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom, 16px);
}
```

### Swipe gestures:
```typescript
// Chat: swipe right để back
// Image viewer: swipe to close
// Dùng @use-gesture/react:

import { useSwipe } from '@use-gesture/react';

const bind = useSwipe({
  onSwipeRight: () => navigate(-1),
  threshold: 50,
});
```

---

## 📋 BƯỚC 5 — Performance Checklist

```
Sau responsive, phải đảm bảo:
[ ] Images: dùng srcset + lazy loading
[ ] Icons: không load cả icon library, chỉ import icon cần dùng
[ ] CSS: không có rule thừa (PurgeCSS với Tailwind)
[ ] Font: font-display: swap, preload critical fonts
[ ] No layout shift: skeleton đúng size tránh CLS > 0.1
[ ] Lighthouse mobile score: Performance > 80, Accessibility > 90
```

---

## 📋 Output Agent phải tạo

1. **`RESPONSIVE_PHASE_PLAN_[HR/CLIENT].md`** — tổng quan, inventory đầy đủ
2. **`RESPONSIVE_PHASE_N_[HR/CLIENT].md`** — prompt thực thi cho từng phase, bao gồm:
   - Files in scope (cụ thể)
   - Design spec cho từng component trong phase
   - Pattern nào áp dụng (từ Bước 3)
   - QA checklist (test từng breakpoint, không test chung)
   - Định nghĩa rõ những gì KHÔNG thuộc phase này
