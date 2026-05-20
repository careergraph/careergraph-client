# PROMPT THỰC THI — Responsive Phases (HR & Client)
> Dùng file này như sổ tay: mỗi phase = 1 chat mới, copy prompt, attach đúng files.

---

## NGUYÊN TẮC CHUNG (đọc 1 lần, áp dụng mọi phase)

- **Mỗi phase = 1 chat mới** — không gộp 2 phase vào 1 chat
- **Attach source files = chỉ files trong scope của phase đó** — không zip toàn bộ project
- **Không approve mù** — đọc diff trước khi nói "proceed"
- **Phase trước phải merge xong** trước khi chạy phase sau (trừ các phase ghi "chạy song song được")

---

## ══════════════════════════════════════════════
## HR FE — 10 PHASES
## ══════════════════════════════════════════════

---

### HR PHASE 1 — Foundation: Navigation, Layout Shell, Responsive Tokens
**Thời gian ước tính:** 3 ngày | **Phụ thuộc:** Không

**Files attach:**
- `RESPONSIVE_PHASE_1_HR.md`
- `src/index.css`
- `src/context/SidebarContext.tsx`
- `src/layout/AppSidebar.tsx`
- `src/layout/AppLayout.tsx`
- `src/layout/AppHeader.tsx`
- `public/index.html` (để verify viewport meta)

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm, chuyên responsive design và React TypeScript.
Đọc file RESPONSIVE_PHASE_1_HR.md — đây là toàn bộ spec cho task này.

SCOPE: Chỉ 6 files trong danh sách "Files in scope" của file hướng dẫn.
KHÔNG touch bất kỳ page nào (Dashboard, Kanban, Jobs...).

Implement theo đúng thứ tự trong file:
1. index.css — global tokens (touch-target, safe-area, typography clamp)
2. SidebarContext.tsx — thêm isTablet detection
3. AppSidebar.tsx — tablet collapsed 64px icon-only mode
4. AppLayout.tsx — responsive margins + bottom nav padding
5. AppHeader.tsx — mobile search expand
6. Tạo mới BottomNav.tsx — mobile bottom navigation 5 items

Sau khi implement, tự test theo QA Checklist cuối file ở 4 breakpoints:
375px / 768px / 1024px / 1440px

Báo cáo format:
  [375px] Bottom nav: ✅ / [768px] Sidebar 64px: ✅ / ...
  Files đã thay đổi: [list]
  Vấn đề ngoài scope (ghi chú, không fix): [list]
```

---

### HR PHASE 2 — Form System: Inputs, Selects, Touch Targets
**Thời gian ước tính:** 2 ngày | **Phụ thuộc:** Phase 1 done

**Files attach:**
- `RESPONSIVE_PHASE_2_HR.md`
- `src/components/form/input/InputField.tsx`
- `src/components/form/Select.tsx`
- `src/components/form/group-input/PhoneInput.tsx`
- `src/components/form/input/Checkbox.tsx`
- `src/components/form/switch/Switch.tsx`

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm, chuyên responsive design và React TypeScript.
Đọc file RESPONSIVE_PHASE_2_HR.md.

SCOPE: Chỉ 5 components form cơ bản. KHÔNG touch page-level forms.

Implement từng component theo đúng spec trong file:
- InputField, Select, PhoneInput: font-size 16px mobile, padding responsive
- Checkbox, Switch: mở rộng tap area qua label wrapper (không thay đổi visual size)

Ưu tiên kiểm tra iOS auto-zoom: focus input trên iPhone SE → không được zoom.
Global CSS rule từ Phase 1 là safety net, nhưng explicit fix trong component là clean code.

QA theo checklist cuối file. Đặc biệt verify:
- iOS auto-zoom: text-base (16px) trên mobile
- Touch targets Checkbox/Switch: tap area ≥ 44px dù visual nhỏ hơn
- Desktop: KHÔNG thay đổi visual gì
```

---

### HR PHASE 3 — Complex Form Controls & Header Dropdown
**Thời gian ước tính:** 2 ngày | **Phụ thuộc:** Phase 2 done

**Files attach:**
- `RESPONSIVE_PHASE_3_HR.md`
- `src/components/form/MultiSelect.tsx`
- `src/components/form/date-picker.tsx`
- `src/components/form/input/TextArea.tsx`
- `src/components/header/UserDropdown.tsx`
- `src/components/form/Label.tsx`

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm.
Đọc file RESPONSIVE_PHASE_3_HR.md.

SCOPE: 5 complex form controls. KHÔNG touch page forms, KHÔNG thay thế Flatpickr.

Chú ý đặc biệt:
- MultiSelect: dropdown max-height + scroll + close button 44px tap
- DatePicker: thử disableMobile: false trước (native picker iOS/Android tốt hơn)
  Nếu native picker không phù hợp design → config Flatpickr CSS mobile width
- UserDropdown: w-65 (260px) overflow trên iPhone SE 320px —
  fix: w-[calc(100vw-2rem)] max-w-65

Không thay đổi component API/props.
QA theo checklist, verify UserDropdown không bị cắt bên phải trên 375px.
```

---

### HR PHASE 4 — Modal → Bottom Sheet & Table → Card System
**Thời gian ước tính:** 3 ngày | **Phụ thuộc:** Phase 2, Phase 3 done

**Files attach:**
- `RESPONSIVE_PHASE_4_HR.md`
- `src/components/custom/modal/index.tsx`
- `src/components/tables/BasicTables/BasicTableOne.tsx`
- `src/components/custom/dropdown/Dropdown.tsx`
- `src/components/custom/badge/Badge.tsx`

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm.
Đọc file RESPONSIVE_PHASE_4_HR.md — hai pattern này sẽ được reuse ở nhiều pages sau.

SCOPE: 4 shared components. KHÔNG touch page-level code.

Implement:
1. Modal → Bottom Sheet: slide-up animation, drag handle, max-height 90dvh,
   safe-area padding, backdrop click close. Desktop giữ nguyên center modal.
2. BasicTableOne → nhận mobileCardRenderer prop: khi mobile + prop có → hiện cards,
   khi không có prop → giữ table + responsive padding. KHÔNG break existing usage.
3. Dropdown → max-height + scroll + width fit viewport
4. Badge → truncate cho text dài

Quan trọng: Modal phải dùng createPortal để render đúng z-index.
Test: Modal trên mobile chỉ slide up, KHÔNG hiện center. Desktop ngược lại.
```

---

### HR PHASE 5 — Dashboard & Recruitment Charts
**Thời gian ước tính:** 3 ngày | **Phụ thuộc:** Phase 1, Phase 4 done

**Files attach:**
- `RESPONSIVE_PHASE_5_HR.md`
- `src/pages/Dashboard/Home.tsx`
- `src/components/recruitment/RecruitmentKpiCards.tsx`
- `src/components/recruitment/FunnelConversionChart.tsx`
- `src/components/recruitment/PipelineVelocityChart.tsx`
- `src/components/recruitment/HiringTargetProgress.tsx`

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm.
Đọc file RESPONSIVE_PHASE_5_HR.md.

SCOPE: Dashboard page + 4 chart components.
KHÔNG touch TalentSourceCard, RecentCandidateActivity, Kanban.
KHÔNG thay đổi chart library hoặc data fetching.

Fix chính:
- KPI cards: grid-cols-1 → 2 → 3 đúng breakpoint (thêm md:grid-cols-3)
- Charts: xóa min-w-250, min-w-162.5 (non-standard) → dùng px value chuẩn với overflow-x-auto wrapper
- Dashboard date range picker: stack dọc trên mobile
- Chart heights: responsive (260px mobile, 330px desktop) qua useMediaQuery

Verify: trên 375px không có horizontal page scroll
(chart container scroll ≠ page scroll — chart OK, page NOT OK).
```

---

### HR PHASE 6 — Kanban Board Mobile Experience
**Thời gian ước tính:** 3 ngày | **Phụ thuộc:** Phase 1, Phase 4 done

**Files attach:**
- `RESPONSIVE_PHASE_6_HR.md`
- `src/pages/Kanban/KanbanBoard.tsx`
- `src/pages/Kanban/Column.tsx`
- `src/pages/Kanban/CandidateCard.tsx`
- `src/pages/Kanban/Candidates.tsx`

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm.
Đọc file RESPONSIVE_PHASE_6_HR.md.

SCOPE: 4 Kanban files. KHÔNG touch CandidateDetail.tsx, scheduling modals,
KHÔNG rewrite @dnd-kit core logic.

Implement mobile single-column view:
- Stage tabs: horizontal scroll với active highlight + count badge
- Chỉ 1 column visible tại 1 thời điểm (activeStage state)
- DnD mobile: thêm TouchSensor với delay 200ms + tolerance 5px
  (long-press để drag trên mobile)
- Fallback: nếu touch DnD UX kém → thêm "Move to..." DropdownMenu trong CandidateCard

Responsive card/column padding theo spec.
Tablet/Desktop: giữ nguyên horizontal multi-column layout.

Test: 375px — switch giữa stages mượt, card tap mở CandidateDetail đúng.
```

---

### HR PHASE 7 — Messaging: Chat Mobile UX
**Thời gian ước tính:** 3 ngày | **Phụ thuộc:** Phase 1 done

> Có thể chạy song song với Phase 5, 6 nếu team đủ người.

**Files attach:**
- `RESPONSIVE_PHASE_7_HR.md`
- `src/features/messaging/pages/MessagesPage.tsx`
- `src/features/messaging/components/InboxSidebar.tsx`
- `src/features/messaging/components/ChatWindow.tsx`
- `src/features/messaging/components/MessageBubble.tsx`

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm.
Đọc file RESPONSIVE_PHASE_7_HR.md.

SCOPE: 4 messaging files.
KHÔNG touch MessageInput.tsx (đã tốt), KHÔNG touch socket logic,
KHÔNG touch JobContextSelector, KHÔNG touch threading/state management.

Implement full-screen toggle pattern:
- Mobile (< 768px): inbox LIST hoặc CHAT — không đồng thời
  Toggle qua activeView state ('inbox' | 'chat')
- Tablet (768-1023px): sidebar 1/3 + chat 2/3
- Desktop (≥ 1024px): sidebar 320px fixed + chat remaining

ChatWindow: thêm back button (ArrowLeft) chỉ khi isMobileFullScreen=true,
hiện class md:hidden.

InboxSidebar: full-width trên mobile, search bar prominent, title "Tin nhắn" hiện.

MessageBubble max-width: 90% / 85% / 75% / 70% theo breakpoint.

Test critical: tap thread → chat full-screen. Back → inbox. Real-time message
vẫn nhận khi đang ở inbox view (badge update, không auto-switch sang chat).
```

---

### HR PHASE 8 — Interview, Calendar & Secondary Pages
**Thời gian ước tính:** 3 ngày | **Phụ thuộc:** Phase 4 done

> Có thể chạy song song với Phase 6, 7.

**Files attach:**
- `RESPONSIVE_PHASE_8_HR.md`
- `src/pages/Interview/InterviewList.tsx`
- `src/pages/Interview/InterviewCard.tsx`
- `src/pages/Interview/InterviewRoom.tsx`
- `src/pages/Calendar/Calendar.tsx`
- `src/components/recruitment/RecentCandidateActivity.tsx`

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm.
Đọc file RESPONSIVE_PHASE_8_HR.md.

SCOPE: 5 files. KHÔNG rewrite FullCalendar core, KHÔNG touch WebRTC logic,
KHÔNG touch CalendarModalForm (inherit Phase 4 modal).

Implement:
- InterviewList: tabs overflow-x-auto scroll, card grid 1→2→3 columns
- InterviewCard: responsive padding + truncate dài
- InterviewRoom: CRITICAL — thêm playsInline attribute (iOS Safari bắt buộc),
  stacked layout mobile (remote full + local PiP 80×112px góc phải trên),
  safe-area-inset-bottom cho controls, ẩn screen share button trên mobile
- Calendar: initialView responsive (listWeek mobile / timeGridWeek tablet / dayGridMonth desktop)
- RecentCandidateActivity: dùng isMobile pattern → card view thay table

Test playsInline trên iOS: video phải play inline, không fullscreen mặc định.
```

---

### HR PHASE 9 — Remaining Pages & Polish
**Thời gian ước tính:** 2 ngày | **Phụ thuộc:** Phase 1–8 done

**Files attach:**
- `RESPONSIVE_PHASE_9_HR.md`
- `src/pages/Profile/UserProfiles.tsx`
- `src/pages/Profile/AccountSettings.tsx`
- `src/pages/SuggestionCandidate/SuggestionCandidate.tsx`
- `src/pages/Employees/EmployeesTable.tsx`
- `src/components/recruitment/TalentSourceCard.tsx`

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm.
Đọc file RESPONSIVE_PHASE_9_HR.md.

SCOPE: 5 files còn lại (P2 priority). KHÔNG touch auth pages, landing page,
KHÔNG refactor code từ Phase 1-8.

Thay đổi nhỏ nhưng cần chính xác:
- UserProfiles: space-y-4 md:space-y-6, p-4 md:p-6 cho cards
- AccountSettings: modals inherit Phase 4 bottom sheet (verify hoạt động đúng)
- SuggestionCandidate: px-6 → px-4 mobile, CandidateHorizontalList → 1 card mobile
  hoặc horizontal scroll snap (chọn 1 approach, implement nhất quán)
- EmployeesTable: truyền mobileCardRenderer cho BasicTableOne (Phase 4 đã support)
- TalentSourceCard: padding p-4 md:p-5 lg:p-6, metric text responsive

Desktop: KHÔNG thay đổi visual gì. Chỉ fix mobile.
```

---

### HR PHASE 10 — QA, Performance & Cross-browser Testing
**Thời gian ước tính:** 2 ngày | **Phụ thuộc:** Phase 1–9 done

**Files attach:**
- `RESPONSIVE_PHASE_10_HR.md`
- KHÔNG cần attach source (phase này là testing, không code mới)

**Prompt:**
```
Bạn là Senior QA Engineer + Frontend Developer 15+ năm.
Đọc file RESPONSIVE_PHASE_10_HR.md — đây là phase kiểm thử toàn diện.

KHÔNG viết code mới. KHÔNG thêm feature. Chỉ:
1. Test theo Test Matrix trong file (375px / 768px / 1024px / 1440px)
2. Fix bugs phát hiện trong quá trình test
3. Verify accessibility checklist
4. Chạy Lighthouse mobile và báo cáo scores
5. Audit z-index stacking
6. Dark mode sweep tất cả modified components

Với mỗi bug phát hiện:
  Bug: [mô tả] | Severity: High/Med/Low | Phase origin: N | Fix: [solution]

Kết thúc bằng Sign-off Report:
  ✅/❌ cho từng tiêu chí trong "Sign-off Criteria" cuối file
  Lighthouse scores: Performance X / Accessibility X / Best Practices X
```

---

## ══════════════════════════════════════════════
## CLIENT FE — 8 PHASES
## ══════════════════════════════════════════════

---

### CLIENT PHASE 1 — Foundation: Bottom Nav, Safe Area, CSS Tokens
**Thời gian ước tính:** 3 ngày | **Phụ thuộc:** Không

**Files attach:**
- `RESPONSIVE_PHASE_1_CLIENT.md`
- `src/index.css`
- `src/layouts/DefaultLayout/DefaultLayout.jsx`
- `src/layouts/FooterOnly/FooterOnly.jsx`
- `src/layouts/components/Navbar/Navbar.jsx`
- `src/components/Buttons/ChatBotButton.jsx`
- `public/index.html`

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm, giỏi mobile UX và React JavaScript.
Đọc file RESPONSIVE_PHASE_1_CLIENT.md.

SCOPE: 6 files layout + 1 file CSS + index.html.
KHÔNG touch bất kỳ page nào (Login, Jobs, etc.).
Lưu ý: đây là React JavaScript, KHÔNG TypeScript.

Implement theo thứ tự trong file:
1. index.html — thêm viewport-fit=cover (BẮT BUỘC cho safe-area CSS)
2. index.css — global tokens: input 16px, touch-target, safe-area variables, reduced-motion
3. Tạo mới BottomNav.jsx — 4 items (Home/Jobs/Messages/Profile), badge unread Messages
4. DefaultLayout.jsx — import BottomNav, thêm mobile bottom padding
5. FooterOnly.jsx — thêm px-4 sm:px-8 mobile padding
6. ChatBotButton.jsx — bottom-24 md:bottom-6 (clearance cho bottom nav)
7. Navbar.jsx — safe-area-top + dropdown overflow protection

Test critical: viewport-fit=cover + safe-area — trên Chrome DevTools,
enable "Show device frame" với iPhone model → bottom nav không bị home indicator che.
```

---

### CLIENT PHASE 2 — Auth Pages: Fix Broken Mobile Layouts
**Thời gian ước tính:** 2 ngày | **Phụ thuộc:** Phase 1 done

**Files attach:**
- `RESPONSIVE_PHASE_2_CLIENT.md`
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/pages/ForgotPassword.jsx`
- `src/pages/VerifyOtp.jsx`
- `src/pages/ResetPassword.jsx`

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm.
Đọc file RESPONSIVE_PHASE_2_CLIENT.md.

SCOPE: 5 auth pages — tất cả đang BROKEN trên mobile vì h-[700px] fixed.

Pattern chung cho tất cả 5 files (copy từ Login):
- h-[700px] → min-h-[calc(100dvh-5rem)] (viewport dynamic height - navbar)
- flex (horizontal) → flex flex-col lg:flex-row
- gap-30 (120px) → lg:gap-16 (64px)
- px-10 → px-6 sm:px-10 py-8 lg:py-0

Đặc biệt cho Register.jsx:
- firstName + lastName inline → flex-col sm:flex-row (stack trên mobile)

KHÔNG đổi validation logic, API calls, Google OAuth, routing.
KHÔNG đổi từng input class (dựa vào global CSS rule từ Phase 1 cho 16px).

Test: iPhone SE 375×667 — Login form phải hiện đầy đủ, scroll hoạt động,
focus input KHÔNG trigger iOS zoom.
```

---

### CLIENT PHASE 3 — Touch Targets & Input System
**Thời gian ước tính:** 2 ngày | **Phụ thuộc:** Phase 1 done

> Có thể chạy song song với Phase 2.

**Files attach:**
- `RESPONSIVE_PHASE_3_CLIENT.md`
- `src/components/ui/button.jsx`
- `src/components/Search/SearchBar.jsx`
- `src/components/Chat/ChatPanel.jsx`
- `src/components/ProfileDashboard/Sidebar.jsx`
- `src/pages/AccountSettings.jsx`
- `src/components/ProfileMenu/ProfileDropdown.jsx`

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm.
Đọc file RESPONSIVE_PHASE_3_CLIENT.md.

SCOPE: 6 files. KHÔNG đổi button variants/colors, KHÔNG touch page layouts.

Thứ tự implement quan trọng:
1. button.jsx TRƯỚC — dùng ở mọi nơi, verify trên 3-4 pages ngay sau khi đổi
   (tăng mỗi size 1 step: h-9→h-10, size-9→size-10...)
2. SearchBar.jsx + ChatPanel.jsx — text-base md:text-sm cho inputs
3. Sidebar.jsx — toggle switch: thêm extended tap area -inset-2, menu items py-3.5
4. AccountSettings.jsx + ProfileDropdown.jsx — font-size + overflow

Rủi ro: button.jsx change ảnh hưởng toàn app → visual inspect 5 pages sau khi đổi.
Nếu layout vỡ → report ngay, không tự sửa page code.
```

---

### CLIENT PHASE 4 — CV Builder: Mobile PDF Experience
**Thời gian ước tính:** 2 ngày | **Phụ thuộc:** Phase 1, Phase 3 done

> Có thể chạy song song với Phase 5, 6, 7.

**Files attach:**
- `RESPONSIVE_PHASE_4_CLIENT.md`
- `src/pages/CVBuilder.jsx`

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm.
Đọc file RESPONSIVE_PHASE_4_CLIENT.md.

SCOPE: Chỉ CVBuilder.jsx. KHÔNG touch PDF rendering, CV templates, CV data.

Vấn đề chính: h-[900px] PDF preview trên mobile 667px → 1.35x viewport.
Solution: tab toggle Editor ↔ Preview trên mobile (< lg = 1024px).

Tab bar design (chỉ hiện lg:hidden):
- 2 tabs: "✏️ Soạn CV" và "📄 Xem trước"
- Active: bg-white text-indigo-600 shadow-sm trên nền bg-slate-100 p-1 rounded-xl
- Inactive: text-slate-500

Preview height mobile: h-[calc(100dvh-12rem)] (viewport - navbar - tabs - padding)
Preview height desktop: giữ h-[900px]

Test: switch tabs KHÔNG mất form data. State phải preserve khi toggle.
Desktop: tab bar ẩn hoàn toàn, side-by-side giữ nguyên.
```

---

### CLIENT PHASE 5 — Applied Jobs, Saved Jobs, Interviews
**Thời gian ước tính:** 2 ngày | **Phụ thuộc:** Phase 1, Phase 3 done

> Có thể chạy song song với Phase 4, 6, 7.

**Files attach:**
- `RESPONSIVE_PHASE_5_CLIENT.md`
- `src/pages/AppliedJobs.jsx`
- `src/pages/SavedJobs.jsx`
- `src/pages/MyInterviews.jsx`
- `src/components/Cards/JobsCardCommon.jsx`

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm.
Đọc file RESPONSIVE_PHASE_5_CLIENT.md.

SCOPE: 4 files. KHÔNG đổi sort/filter logic, API calls, card visual design.

Fixes cần làm (copy pattern từ AppliedJobs sang SavedJobs):
1. Custom Select: min-w-[220px] → w-full sm:min-w-[220px], h-10 → h-11
2. Font sizes: text-[17px] → text-base, text-[13px] → text-sm
3. Save/action buttons: mở rộng tap area qua relative + absolute -inset-1.5 span
4. Empty state images: w-[360px] → w-full max-w-[360px]
5. JobsCardCommon: thêm loading="lazy" trên img

MyInterviews: modal reschedule thêm mx-4 sm:mx-auto để không sát cạnh mobile.

Test: Samsung Galaxy 360px width (narrowest common Android) — filter dropdowns fit.
```

---

### CLIENT PHASE 6 — Messaging: Chat Mobile UX
**Thời gian ước tính:** 2 ngày | **Phụ thuộc:** Phase 1 done

> Có thể chạy song song với Phase 4, 5, 7.

**Files attach:**
- `RESPONSIVE_PHASE_6_CLIENT.md`
- `src/features/messaging/pages/MessagesPage.jsx`
- `src/features/messaging/components/ChatWindow.jsx`
- `src/features/messaging/components/MessageBubble.jsx`

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm, giỏi chat UX mobile.
Đọc file RESPONSIVE_PHASE_6_CLIENT.md.

SCOPE: 3 files. KHÔNG touch MessageInput (đã excellent), socket logic,
ThreadCard component, job context selector.

Vấn đề hiện tại: mobile chỉ thấy ChatWindow, KHÔNG thấy inbox list.
Fix: full-screen toggle pattern (giống WhatsApp):

MessagesPage.jsx:
  const [showChat, setShowChat] = useState(false);
  Mobile: InboxSidebar (full) XOR ChatWindow (full) — toggle qua showChat state
  Desktop (md+): side-by-side như cũ

ChatWindow.jsx:
  Nhận thêm prop onBack + showBackButton
  Back button: ArrowLeft, md:hidden, p-2 touch target

MessageBubble: max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%]

Test: tap thread → ChatWindow full. Tap back → inbox full.
Real-time message received ở inbox view → badge update, KHÔNG auto-switch.
```

---

### CLIENT PHASE 7 — Interview Room: Mobile Video Experience
**Thời gian ước tính:** 1 ngày | **Phụ thuộc:** Phase 1 done

> Có thể chạy song song với Phase 4, 5, 6.

**Files attach:**
- `RESPONSIVE_PHASE_7_CLIENT.md`
- `src/pages/InterviewRoom.jsx`

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm.
Đọc file RESPONSIVE_PHASE_7_CLIENT.md.

SCOPE: Chỉ InterviewRoom.jsx. KHÔNG touch WebRTC/socket logic.

Critical mobile video fixes:
1. playsInline — BẮT BUỘC cho iOS Safari (thiếu → video fullscreen toàn màn hình)
2. Control bar: safe-area-inset-bottom (iPhone home indicator che controls)
3. Screen share button: hidden sm:flex (mobile không support)
4. Touch targets: p-3 sm:px-4 sm:py-2.5 cho control buttons

Video layout mobile portrait:
- Remote video: full-width, flex-1
- Local video: PiP overlay absolute bottom-4 right-4, w-28 h-36 rounded-xl

Approach PiP: dùng 2 conditional render (md:hidden + hidden md:block)
với video ref khác nhau — cẩn thận về WebRTC stream assignment.
Đọc phần Implementation Notes cuối file trước khi code.

Test: iPhone SE portrait — remote video full, local PiP visible ở góc.
Controls accessible, safe-area effect rõ.
```

---

### CLIENT PHASE 8 — Performance, Lazy Loading & Accessibility
**Thời gian ước tính:** 2 ngày | **Phụ thuộc:** Phase 1–7 done

**Files attach:**
- `RESPONSIVE_PHASE_8_CLIENT.md`
- `src/index.css`
- `public/index.html`
- `src/layouts/DefaultLayout/DefaultLayout.jsx`
- Các files có img tags cần lazy loading (xem bảng trong Phase 8 file)

**Prompt:**
```
Bạn là Senior Frontend Engineer 15+ năm, chuyên web performance.
Đọc file RESPONSIVE_PHASE_8_CLIENT.md.

SCOPE: Performance polish. KHÔNG thêm features, KHÔNG refactor components.

Thứ tự implement:
1. index.html: thêm preconnect fonts.googleapis.com + fonts.gstatic.com
2. index.css: giảm font weights (Poppins: 400,500,600,700 | Roboto: 400,500,700)
   BỎ italic variants, BỎ 100/200/300/800/900
   TRƯỚC KHI bỏ: search codebase cho font-light, font-thin, font-extrabold —
   nếu có font-extrabold (800) → giữ weight 800
3. index.css: fix font variable bug — --font-poppins có value "Roboto" (sai)
   Recommendation: rename → --font-sans: "Roboto", "Poppins", sans-serif
4. index.css: prefers-reduced-motion rule
5. index.css: focus-visible styles
6. Tất cả img tags below-fold: thêm loading="lazy" (xem bảng trong file)
   KHÔNG thêm lazy cho: hero image, navbar logo
7. Empty state images: w-full max-w-[Npx]
8. DefaultLayout.jsx: skip to content link

Sau khi implement: chạy Lighthouse mobile report.
Target: Performance > 80, Accessibility > 90.
Báo cáo scores + bất kỳ issue nào cần fix.
```

---

## ══════════════════════════════════════════════
## QUICK REFERENCE — Thứ tự chạy
## ══════════════════════════════════════════════

### HR FE — Sequential (trừ chú thích song song)
```
Phase 1 → Phase 2 → Phase 3 → Phase 4
                              ↓
            Phase 5, Phase 6, Phase 7, Phase 8 (song song được)
                              ↓
                          Phase 9 → Phase 10
```

### Client FE — Sequential (trừ chú thích song song)
```
Phase 1 → Phase 2, Phase 3 (song song được)
              ↓
Phase 4, Phase 5, Phase 6, Phase 7 (song song được — đều cần Phase 1)
              ↓
          Phase 8
```

### Chạy HR và Client song song?
✅ Được — 2 codebase độc lập, không ảnh hưởng nhau.

---

## CÁCH XỬ LÝ KHI GẶP VẤN ĐỀ

**Agent code ngoài scope:**
```
Dừng lại và revert [tên file] — file đó không thuộc scope Phase N.
Chỉ giữ thay đổi trong: [list files đúng].
```

**Agent hỏi nhiều trước khi code:**
```
Đọc Implementation Notes cuối file. Tự quyết định và ghi assumption.
Tôi sẽ review sau. Bắt đầu implement ngay.
```

**Bug sau khi merge phase trước:**
```
Phase N đã merge. Phát hiện [ComponentX] bị vỡ ở [breakpoint].
Nguyên nhân nghi ngờ: [mô tả nếu biết].
Fix chỉ ComponentX, không touch các file khác.
```

**Visual không đạt standard:**
```
[Screenshot] — phần này chưa đạt.
Vấn đề cụ thể: [mô tả].
Fix theo đúng spec trong phase file, không tự sáng tạo.
```
