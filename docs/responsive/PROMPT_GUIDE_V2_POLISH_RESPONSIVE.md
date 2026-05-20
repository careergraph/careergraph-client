# PROMPT GUIDE — Dashboard Polish & Responsive Production

---

## ═══════════════════════════════════════════════
## TASK 1 — Dashboard UI/UX Polish
## ═══════════════════════════════════════════════

### Files attach
- `DASHBOARD_UI_POLISH.md`
- Source HR FE (toàn bộ folder dashboard + shared components)
- `package.json` (để biết đang dùng chart library gì)
- CSS config: `tailwind.config.ts` hoặc global CSS variables file

### Prompt

```
Bạn là Senior UI Engineer với 15+ năm kinh nghiệm, từng làm tại 
các công ty product như Linear, Vercel, Notion. Tiêu chuẩn của 
bạn là: nếu thấy pixel nào sai, bạn không thể bỏ qua.

Đọc file DASHBOARD_UI_POLISH.md để hiểu toàn bộ yêu cầu.

BƯỚC 1 — AUDIT (trình bày trước khi code):
Đọc source dashboard hiện tại. Liệt kê cụ thể tất cả vấn đề tìm thấy 
theo đúng checklist trong file hướng dẫn. Format:
  [SPACING] Card padding dùng 13px — phải là 12px hoặc 16px
  [COLOR] Hardcode #ff0000 trong ErrorText — phải dùng token
  [SKELETON] MetricCard skeleton là rectangle generic — phải match shape thật
  [ERROR] Error state chỉ là text đỏ — cần icon + action + friendly message
  [CHART] Tooltip chưa có box-shadow, font quá nhỏ (10px)

BƯỚC 2 — IMPLEMENT (sau khi audit):
Fix tất cả vấn đề theo đúng spec trong DASHBOARD_UI_POLISH.md:
  1. Thiết lập design tokens còn thiếu (không override token cũ)
  2. Rebuild MetricCard với đúng hierarchy, skeleton, error state
  3. Config lại tất cả charts theo CHART_DEFAULTS spec
  4. Implement InlineError component với retry action
  5. Implement Skeleton system với shimmer animation
  6. Fix number formatting dùng formatNumber() utility
  7. Fix DashboardCard wrapper nhất quán
  8. Implement greeting header + date range picker refresh

KHÔNG làm: thêm tính năng mới, thay đổi data/API logic.
Chỉ polish UI — không thêm, không bỏ widget.

Sau khi xong, tự đóng vai khách hàng khó tính:
Kiểm tra từng mục trong QA Checklist cuối file.
Báo cáo: ✅ Pass / ❌ Fail / ⚠️ Partial với mô tả cụ thể.
Nếu có mục Fail: fix ngay và re-check.
```

---

## ═══════════════════════════════════════════════
## TASK 2a — Responsive: Lập kế hoạch HR FE
## (chạy trước — chỉ lập kế hoạch, không code)
## ═══════════════════════════════════════════════

### Files attach
- `RESPONSIVE_REDESIGN_PRODUCTION.md`
- Toàn bộ source HR FE (zip)

### Prompt

```
Bạn là Senior Frontend Engineer 15+ năm, chuyên về responsive design 
và large-scale React TypeScript applications.

Đọc file RESPONSIVE_REDESIGN_PRODUCTION.md để hiểu toàn bộ design 
patterns và tiêu chuẩn bắt buộc.

NHIỆM VỤ: Chỉ lập kế hoạch — KHÔNG viết bất kỳ dòng code nào.

Đọc toàn bộ source HR FE, thực hiện:

1. Ghi rõ tech stack: CSS framework, breakpoints hiện tại, 
   component library, router version

2. Scan TẤT CẢ pages và components. Với mỗi item:
   - Liệt kê vấn đề responsive CỤ THỂ (không chung chung)
   - Đánh priority: P0 (critical) / P1 (important) / P2 (nice-to-have)
   - Ước tính effort: S/M/L/XL
   - Pattern nào sẽ áp dụng (từ Bước 3 trong file hướng dẫn)

3. Chia phase theo nguyên tắc trong file:
   - Phase 1 PHẢI là Foundation (navigation, layout shell, tokens)
   - Shared components phải trước pages dùng chúng
   - P0 pages trước, P2 pages sau
   - Mỗi phase ≤ 5 items lớn, ≤ 3 ngày làm việc

4. Với mỗi phase, viết prompt file chi tiết (RESPONSIVE_PHASE_N_HR.md):
   - Files cụ thể trong scope
   - Design spec chi tiết cho từng component
   - Pattern áp dụng từ file hướng dẫn
   - QA checklist (test 375px / 768px / 1024px / 1440px)
   - Ghi rõ KHÔNG làm gì trong phase này

Xuất ra:
- RESPONSIVE_PHASE_PLAN_HR.md (overview + inventory đầy đủ)
- RESPONSIVE_PHASE_1_HR.md, PHASE_2_HR.md... (1 file per phase)

Trình bày RESPONSIVE_PHASE_PLAN_HR.md để tôi review trước.
Sau khi tôi approve, mới tạo các phase files.
```

---

## ═══════════════════════════════════════════════
## TASK 2b — Responsive: Lập kế hoạch Client FE
## ═══════════════════════════════════════════════

### Files attach
- `RESPONSIVE_REDESIGN_PRODUCTION.md`
- Toàn bộ source Client FE (zip)

### Prompt

```
Bạn là Senior Frontend Engineer 15+ năm kinh nghiệm, đặc biệt 
giỏi về mobile UX (React Native background, biết rõ touch patterns, 
thumb zone, iOS/Android conventions).

Đọc file RESPONSIVE_REDESIGN_PRODUCTION.md.

NHIỆM VỤ: Chỉ lập kế hoạch — KHÔNG code.

Client FE là React JavaScript (không TypeScript).
Candidate dùng mobile là chính — mobile experience phải là priority tuyệt đối.

Đặc biệt chú ý khi audit:
- Có bottom navigation không? Nếu không → phải thêm (P0)
- Có swipe gesture nào cần không? (chat back, image close)
- Input font-size < 16px không? → iOS sẽ auto-zoom (phải fix P0)
- Touch targets < 44px không? → tất cả phải P0
- Safe area (notch iPhone) xử lý chưa?
- Images có lazy loading chưa?

[Phần còn lại giống Task 2a: chia phase, tạo phase files]

Xuất ra:
- RESPONSIVE_PHASE_PLAN_CLIENT.md
- RESPONSIVE_PHASE_1_CLIENT.md, PHASE_2_CLIENT.md...
```

---

## ═══════════════════════════════════════════════
## TASK 3 — Responsive: Thực thi từng Phase
## (dùng sau khi đã approve phase plan)
## ═══════════════════════════════════════════════

### Files attach
- `RESPONSIVE_PHASE_N_[HR/CLIENT].md` (file phase cụ thể)
- `RESPONSIVE_REDESIGN_PRODUCTION.md` (để agent có design patterns)
- Source files thuộc scope của phase đó (không cần attach toàn bộ project)

### Prompt

```
Bạn là Senior Frontend Engineer 15+ năm, tiêu chuẩn Figma/Linear/GitHub.

Đọc 2 files: RESPONSIVE_PHASE_N và RESPONSIVE_REDESIGN_PRODUCTION.
RESPONSIVE_REDESIGN_PRODUCTION chứa tất cả design patterns bắt buộc phải follow.

SCOPE của task này: đúng như liệt kê trong RESPONSIVE_PHASE_N.
KHÔNG implement bất cứ thứ gì ngoài scope, kể cả thấy bug khác.
Nếu phát hiện vấn đề ngoài scope → ghi chú nhưng không fix.

Khi implement, áp dụng đúng design patterns từ RESPONSIVE_REDESIGN_PRODUCTION:
- Navigation: đúng pattern (bottom nav mobile, collapsed sidebar tablet)
- Table → Card: đúng MobileCard layout spec
- Modal → BottomSheet: đúng animation và behavior
- Form: label trên input dưới trên mobile, font-size min 16px
- Touch targets: min 44×44px tất cả
- Spacing: giảm theo scale khi mobile

Sau khi implement:
Tự test từng breakpoint theo QA checklist trong phase file:
  375px (iPhone SE) — phải test viewport này
  768px (iPad)
  1024px (laptop)
  1440px (desktop)

Báo cáo format:
  Phase N Done — [tên phase]
  ─────────────────────────
  Files đã thay đổi:
    - ComponentA.tsx: [mô tả thay đổi]
    - ComponentB.css: [mô tả thay đổi]
  
  QA Results:
    375px: ✅ / ❌ [mục nào fail]
    768px: ✅ / ❌
    1024px: ✅ / ❌
    1440px: ✅ / ❌
  
  Vấn đề phát hiện ngoài scope (không fix, chỉ ghi):
    - [list]
  
  Ready for Phase [N+1].
```

---

## 💡 Tips thực chiến

### Khi dashboard vẫn chưa đủ đẹp sau khi agent implement:

```
Mở browser DevTools → chụp screenshot chỗ chưa ổn 
→ paste vào chat → nói:
"Phần này chưa đạt — [mô tả vấn đề cụ thể].
Cần fix: [kết quả mong muốn].
Chỉ fix chỗ này, không đụng chỗ khác."
```

### Khi responsive bị vỡ sau khi merge phase trước:

```
"Phase [N] đã merge. Khi test, phát hiện [ComponentA] bị vỡ 
trên 375px sau khi Phase [N-1] thay đổi [ComponentX].
Nguyên nhân: [mô tả nếu biết].
Fix ComponentA để hoạt động đúng, không touch các component khác."
```

### Khi muốn nâng bar chất lượng:

```
Thêm vào cuối prompt:
"Sau khi implement xong, hãy tự hỏi: 
Nếu đây là UI của Linear.app hoặc Figma, tôi có tự hào 
khi show cho khách hàng không? 
Nếu còn bất kỳ thứ gì trông amateur, fix nó trước khi report."
```
