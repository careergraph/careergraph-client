import { useState } from "react";
import { Pencil } from "lucide-react";
import ProfileCard from "./ProfileCard";
import CVCards from "./CVCard";

function EditModal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="bg-white w-2/5 h-full p-6 shadow-lg animate-slideIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProfileSection({ title, children, onEdit }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4 relative">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold">{title}</h3>
        <button onClick={onEdit}>
          <Pencil size={18} className="text-gray-500 hover:text-black" />
        </button>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function Profile({className}) {
  const [activePopup, setActivePopup] = useState(null);

  async function uploadToServer(file) {
    // TODO: gọi API, lấy URL… (ví dụ)
    // const url = await api.upload(file)
    // return url
  }
  

  return (
    <div className={`flex w-full ${className} `}>
      <div className="flex-1 px-6">
        {/* Hồ sơ */}
        <div className="text-lg font-bold text-slate-900 mb-3"> Hồ sơ của tôi</div>
        <div className="max-w-5xl mx-auto mb-2">
          <ProfileCard />
        </div>

        <CVCards
          initialFiles={[
            {
              name: "InternJava_LuongQuangThinh_1_1759043935740.pdf",
              url: "#",
              uploadedAt: "2025-09-28T14:18:48+07:00",
            },
          ]}
          onUpload={uploadToServer}
          onRemove={(item) => console.log("Removed:", item)}
          onView={(item) => window.open(item.url || "#", "_blank")}
        />

        {/* Tiêu chí tìm việc */}
        <ProfileSection
          title="Tiêu chí tìm việc"
          onEdit={() => setActivePopup("criteria")}
        >
          <p>Chưa có thông tin</p>
        </ProfileSection>

        {/* Thông tin chung */}
        <ProfileSection
          title="Thông tin chung"
          onEdit={() => setActivePopup("general")}
        >
          <p>Thêm số năm kinh nghiệm, học vấn...</p>
        </ProfileSection>
      </div>

      {/* Popup chỉnh sửa */}
      <EditModal
        open={activePopup === "profile"}
        onClose={() => setActivePopup(null)}
        title="Chỉnh sửa hồ sơ"
      >
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Họ và tên"
            className="border rounded p-2"
          />
          <input
            type="email"
            placeholder="Email"
            className="border rounded p-2"
          />
          <button className="bg-purple-600 text-white py-2 rounded">
            Lưu
          </button>
        </form>
      </EditModal>

      <EditModal
        open={activePopup === "cv"}
        onClose={() => setActivePopup(null)}
        title="Cập nhật CV"
      >
        <input type="file" className="border p-2 rounded" />
      </EditModal>

      <EditModal
        open={activePopup === "criteria"}
        onClose={() => setActivePopup(null)}
        title="Cập nhật tiêu chí tìm việc"
      >
        <input
          type="text"
          placeholder="Vị trí công việc"
          className="border rounded p-2 w-full"
        />
      </EditModal>

      <EditModal
        open={activePopup === "general"}
        onClose={() => setActivePopup(null)}
        title="Cập nhật thông tin chung"
      >
        <input
          type="text"
          placeholder="Số năm kinh nghiệm"
          className="border rounded p-2"
        />
      </EditModal>
    </div>
  );
}
