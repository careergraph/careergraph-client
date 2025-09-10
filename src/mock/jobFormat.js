// /src/mock/jobFormat.js

// Giả lập data Admin đã format sẵn (HTML)
export const JOB_FORMAT_BY_ID = {
  "job-001": {
    html: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Lập hóa đơn, xử lý sai sót phát sinh.</li>
        <li>Đối chiếu chứng từ mua bán, xuất–nhập hóa đơn GTGT.</li>
        <li>Quản lý công nợ, theo dõi báo cáo xuất–nhập–tồn kho.</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Tốt nghiệp Cao đẳng/ĐH chuyên ngành Kế toán.</li>
        <li>Nắm vững nguyên lý kế toán–thuế; cẩn thận, trung thực.</li>
        <li>Kỹ năng giao tiếp & quản lý thời gian tốt.</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Thu nhập 7–10 triệu (trao đổi khi phỏng vấn).</li>
        <li>Được đào tạo nội bộ; môi trường thân thiện.</li>
        <li>BHXH/BHYT/BHTN theo luật; nghỉ lễ tết.</li>
      </ul>
    `.trim()
  },

  // Thêm job khác nếu cần:
  "job-002": {
    html: `
      <h3>Mô tả</h3>
      <p>Phụ trách nhập liệu, kiểm tra chứng từ, đối chiếu số liệu hằng ngày.</p>
      <h3>Yêu cầu</h3>
      <ul>
        <li>Biết MISA/Excel cơ bản.</li>
        <li>Trung thực, kỹ tính, có tinh thần học hỏi.</li>
      </ul>
      <h3>Quyền lợi</h3>
      <p>Lương thoả thuận, review định kỳ, thưởng theo hiệu quả công việc.</p>
    `.trim()
  }
};

// Hàm giả lập “fetch local” (trả về Promise để thay thế bằng API sau này)
export function fetchJobFormatLocal(jobId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JOB_FORMAT_BY_ID[jobId]?.html || "");
    }, 300); // mô phỏng delay
  });
}
