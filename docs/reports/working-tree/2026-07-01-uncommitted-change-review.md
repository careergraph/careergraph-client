# Báo cáo thay đổi chưa commit - careergraph-client

## Phạm vi rà soát
- Thời điểm rà soát: 2026-07-01
- Repo: `careergraph-client`
- Các file thay đổi:
  - `src/features/notifications/components/NotificationDropdown.jsx`
  - `src/pages/InterviewRoom.jsx`
  - `src/pages/JobDetail.jsx`
  - `src/pages/MyInterviews.jsx`
  - `src/sections/JobDetail/ApplyBar.jsx`
  - `src/sections/JobDetail/JobHeader.jsx`
  - `src/utils/jobFormat.js`

## Tóm tắt nghiệp vụ cho khách hàng
Các thay đổi tập trung vào 3 nhóm trải nghiệm chính:

1. Chi tiết việc làm:
- hiển thị đúng hơn trạng thái "đã từng ứng tuyển",
- hỗ trợ nhãn "Ứng tuyển lại",
- chặn ứng tuyển khi hồ sơ còn đang trong quy trình tuyển dụng.

2. Phòng phỏng vấn ứng viên:
- dọn trạng thái bị mời ra khỏi phòng khi ứng viên đã được vào lại hoặc buổi phỏng vấn đã hoàn tất.

3. Trung tâm thông báo:
- tránh gọi tải danh sách thông báo lặp lại nhiều lần trong cùng một lần mở dropdown.

## Ảnh hưởng tới nghiệp vụ đang có
- Nghiệp vụ ứng tuyển lại được hiển thị rõ ràng hơn cho ứng viên.
- Nghiệp vụ phòng phỏng vấn ít gây hiểu nhầm hơn sau khi ứng viên được admit lại hoặc interview đã hoàn tất.
- Nghiệp vụ thông báo giảm tải gọi API dư thừa ở frontend.

## Làm rõ nghiệp vụ apply lại
- Theo nghiệp vụ đã xác nhận, ứng viên vừa nộp hồ sơ vẫn được phép ứng tuyển lại ngay.
- Hệ thống chỉ hiển thị trạng thái "hồ sơ của bạn đang trong quá trình tuyển dụng" và chặn thao tác khi hồ sơ đã được kéo sang các stage tuyển dụng khác.
- Vì vậy việc `JobDetail.jsx` giữ `reapplyBlocked: false` ngay sau khi apply thành công là phù hợp với nghiệp vụ hiện tại.

## Đánh giá sau khi làm rõ nghiệp vụ
- Logic frontend hiện tại đang bám đúng rule:
  - `hasApplied` dùng để đổi nhãn sang `Ứng tuyển lại`,
  - `reapplyBlocked` mới là cờ quyết định có khóa nút hay không.
- Điều kiện chặn apply lại phụ thuộc vào dữ liệu backend trả về khi hồ sơ đã chuyển stage.
- Không cần sửa riêng phần state sau submit ở frontend cho nghiệp vụ này.

## Kết luận
- Các thay đổi về notification, interview room và job apply/reapply đều có thể giữ lại.
- Nhóm file job apply/reapply hiện phù hợp để commit cùng thay đổi hiển thị trạng thái.
- Có thể commit báo cáo review ngay để lưu hồ sơ phân tích.

## Gợi ý lệnh commit an toàn hiện tại
```bash
git add docs/reports/working-tree/2026-07-01-uncommitted-change-review.md src/features/notifications/components/NotificationDropdown.jsx src/pages/InterviewRoom.jsx src/pages/MyInterviews.jsx
git commit -m "client polish notifications and interview room"
```

```bash
git add src/pages/JobDetail.jsx src/sections/JobDetail/ApplyBar.jsx src/sections/JobDetail/JobHeader.jsx src/utils/jobFormat.js
git commit -m "client clarify job reapply status"
```
