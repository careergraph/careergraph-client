import { Plus, Trash2 } from "lucide-react";

const CVEditor = ({ data, onChange, sectionsVisibility, onToggleSection }) => {

  const createId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

  const updatePersonal = (field, value) => {
    onChange({
      ...data,
      personal: {
        ...data.personal,
        [field]: value,
      },
    });
  };

  const updateContact = (field, value) => {
    onChange({
      ...data,
      contact: {
        ...data.contact,
        [field]: value,
      },
    });
  };

  const updateCollection = (key, index, field, value) => {
    const collection = Array.isArray(data[key]) ? [...data[key]] : [];
    if (typeof field === "undefined") {
      collection[index] = value;
    } else {
      collection[index] = {
        ...collection[index],
        [field]: value,
      };
    }
    onChange({
      ...data,
      [key]: collection,
    });
  };

  const updateBullet = (index, bulletIndex, value) => {
    const experience = Array.isArray(data.experience) ? [...data.experience] : [];
    const current = experience[index];
    const bulletPoints = Array.isArray(current?.bulletPoints) ? [...current.bulletPoints] : [];
    bulletPoints[bulletIndex] = value;
    experience[index] = {
      ...current,
      bulletPoints,
    };
    onChange({
      ...data,
      experience,
    });
  };

  const addCollectionItem = (key, payload) => {
    const collection = Array.isArray(data[key]) ? [...data[key]] : [];
    collection.push(payload);
    onChange({
      ...data,
      [key]: collection,
    });
  };

  const removeCollectionItem = (key, index) => {
    const collection = Array.isArray(data[key]) ? [...data[key]] : [];
    collection.splice(index, 1);
    onChange({
      ...data,
      [key]: collection,
    });
  };

  const addBullet = (index) => {
    const experience = Array.isArray(data.experience) ? [...data.experience] : [];
    const current = experience[index];
    const bulletPoints = Array.isArray(current?.bulletPoints) ? [...current.bulletPoints] : [];
    bulletPoints.push("");
    experience[index] = {
      ...current,
      bulletPoints,
    };
    onChange({
      ...data,
      experience,
    });
  };

  const removeBullet = (index, bulletIndex) => {
    const experience = Array.isArray(data.experience) ? [...data.experience] : [];
    const current = experience[index];
    const bulletPoints = Array.isArray(current?.bulletPoints) ? [...current.bulletPoints] : [];
    bulletPoints.splice(bulletIndex, 1);
    experience[index] = {
      ...current,
      bulletPoints,
    };
    onChange({
      ...data,
      experience,
    });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Thông tin cá nhân</h2>
            <p className="text-sm text-slate-500">Các thông tin chính xuất hiện ở phần đầu CV</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">Họ và tên</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-inner focus:border-indigo-500 focus:outline-none"
              value={data.personal?.fullName || ""}
              onChange={(event) => updatePersonal("fullName", event.target.value)}
              placeholder="Ví dụ: Nguyễn Thị Minh Anh"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">Vị trí / Headline</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-inner focus:border-indigo-500 focus:outline-none"
              value={data.personal?.headline || ""}
              onChange={(event) => updatePersonal("headline", event.target.value)}
              placeholder="Ví dụ: Product Designer"
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-600">Tóm tắt ngắn gọn</span>
            <textarea
              className="min-h-[120px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-indigo-500 focus:outline-none"
              value={data.personal?.summary || ""}
              onChange={(event) => updatePersonal("summary", event.target.value)}
              placeholder="Nêu bật kinh nghiệm, thế mạnh và lĩnh vực quan tâm của bạn."
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">Địa điểm</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-inner focus:border-indigo-500 focus:outline-none"
              value={data.personal?.location || ""}
              onChange={(event) => updatePersonal("location", event.target.value)}
              placeholder="Ví dụ: Hà Nội, Việt Nam"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Liên hệ</h2>
            <p className="text-sm text-slate-500">Cung cấp cách nhà tuyển dụng có thể kết nối với bạn</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">Email</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-inner focus:border-indigo-500 focus:outline-none"
              value={data.contact?.email || ""}
              onChange={(event) => updateContact("email", event.target.value)}
              placeholder="email@domain.com"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">Số điện thoại</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-inner focus:border-indigo-500 focus:outline-none"
              value={data.contact?.phone || ""}
              onChange={(event) => updateContact("phone", event.target.value)}
              placeholder="Ví dụ: +84 912 345 678"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">Website / Portfolio</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-inner focus:border-indigo-500 focus:outline-none"
              value={data.contact?.website || ""}
              onChange={(event) => updateContact("website", event.target.value)}
              placeholder="Ví dụ: https://minhanh.design"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">LinkedIn</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-inner focus:border-indigo-500 focus:outline-none"
              value={data.contact?.linkedin || ""}
              onChange={(event) => updateContact("linkedin", event.target.value)}
              placeholder="linkedin.com/in/..."
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Kinh nghiệm làm việc</h2>
            <p className="text-sm text-slate-500">Mô tả các vị trí quan trọng nhất liên quan tới mục tiêu nghề nghiệp</p>
          </div>
          <button
            type="button"
            onClick={() =>
              addCollectionItem("experience", {
                id: createId("exp"),
                role: "",
                company: "",
                location: "",
                startDate: "",
                endDate: "",
                bulletPoints: [""],
              })
            }
            className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-300 hover:bg-white"
          >
            <Plus size={16} />
            Thêm kinh nghiệm
          </button>
        </header>

        <div className="space-y-6">
          {data.experience?.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white/60 p-5 shadow-inner">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Vai trò #{index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeCollectionItem("experience", index)}
                  className="rounded-full border border-transparent p-2 text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-slate-500">Chức danh</span>
                  <input
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    value={item.role || ""}
                    onChange={(event) => updateCollection("experience", index, "role", event.target.value)}
                    placeholder="Ví dụ: Senior Product Designer"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-slate-500">Công ty</span>
                  <input
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    value={item.company || ""}
                    onChange={(event) => updateCollection("experience", index, "company", event.target.value)}
                    placeholder="Ví dụ: VNG Corporation"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-slate-500">Địa điểm</span>
                  <input
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    value={item.location || ""}
                    onChange={(event) => updateCollection("experience", index, "location", event.target.value)}
                    placeholder="Ví dụ: TP. Hồ Chí Minh"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm text-slate-500">Bắt đầu</span>
                    <input
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      value={item.startDate || ""}
                      onChange={(event) => updateCollection("experience", index, "startDate", event.target.value)}
                      placeholder="01/2020"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm text-slate-500">Kết thúc</span>
                    <input
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      value={item.endDate || ""}
                      onChange={(event) => updateCollection("experience", index, "endDate", event.target.value)}
                      placeholder="Hiện tại"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium text-slate-600">Điểm nổi bật</p>
                {item.bulletPoints?.map((bullet, bulletIndex) => (
                  <div key={`${item.id}-bullet-${bulletIndex}`} className="flex gap-2">
                    <textarea
                      className="h-20 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none resize-none"
                      value={bullet || ""}
                      onChange={(event) => updateBullet(index, bulletIndex, event.target.value)}
                      placeholder="Mô tả thành tựu, trách nhiệm hoặc kết quả đạt được..."
                    />
                    <button
                      type="button"
                      onClick={() => removeBullet(index, bulletIndex)}
                      className="flex-shrink-0 rounded-lg border border-transparent p-2 text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addBullet(index)}
                  className="flex items-center gap-2 text-sm font-medium text-indigo-500 hover:text-indigo-600"
                >
                  <Plus size={16} />
                  Thêm ý chính
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Học vấn</h2>
            <p className="text-sm text-slate-500">Thêm trường học và chương trình đào tạo nổi bật</p>
          </div>
          <button
            type="button"
            onClick={() =>
              addCollectionItem("education", {
                id: createId("edu"),
                school: "",
                degree: "",
                startDate: "",
                endDate: "",
              })
            }
            className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-300 hover:bg-white"
          >
            <Plus size={16} />
            Thêm học vấn
          </button>
        </header>

        <div className="space-y-6">
          {data.education?.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white/60 p-5 shadow-inner">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Chương trình #{index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeCollectionItem("education", index)}
                  className="rounded-full border border-transparent p-2 text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-slate-500">Trường</span>
                  <input
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    value={item.school || ""}
                    onChange={(event) => updateCollection("education", index, "school", event.target.value)}
                    placeholder="Ví dụ: Đại học Bách Khoa Hà Nội"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-slate-500">Chương trình</span>
                  <input
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    value={item.degree || ""}
                    onChange={(event) => updateCollection("education", index, "degree", event.target.value)}
                    placeholder="Ví dụ: Cử nhân Khoa học Máy tính"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm text-slate-500">Bắt đầu</span>
                    <input
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      value={item.startDate || ""}
                      onChange={(event) => updateCollection("education", index, "startDate", event.target.value)}
                      placeholder="2016"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm text-slate-500">Kết thúc</span>
                    <input
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      value={item.endDate || ""}
                      onChange={(event) => updateCollection("education", index, "endDate", event.target.value)}
                      placeholder="2020"
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Kỹ năng</h2>
            <p className="text-sm text-slate-500">Liệt kê 6 - 10 kỹ năng nổi bật giúp bạn đứng out</p>
          </div>
          <button
            type="button"
            onClick={() => addCollectionItem("skills", { id: createId("skill"), name: "" })}
            className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-300 hover:bg-white"
          >
            <Plus size={16} />
            Thêm kỹ năng
          </button>
        </header>

        <div className="space-y-3">
          {data.skills?.map((skill, index) => {
            const skillObj = typeof skill === 'string' ? { id: skill, name: skill } : skill;
            return (
              <div key={skillObj.id || `skill-${index}`} className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  value={skillObj.name || ""}
                  onChange={(event) => updateCollection("skills", index, "name", event.target.value)}
                  placeholder="Ví dụ: JavaScript, React, Node.js"
                />
                <button
                  type="button"
                  onClick={() => removeCollectionItem("skills", index)}
                  className="flex-shrink-0 rounded-lg border border-transparent p-2 text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Ngôn ngữ</h2>
            <p className="text-sm text-slate-500">Tùy chọn bật/tắt hiển thị khi không cần thiết</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <input
                type="checkbox"
                checked={Boolean(sectionsVisibility.languages)}
                onChange={(event) => onToggleSection("languages", event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Hiển thị trong CV
            </label>
            <button
              type="button"
              onClick={() =>
                addCollectionItem("languages", {
                  id: createId("lang"),
                  name: "",
                })
              }
              className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-300 hover:bg-white"
            >
              <Plus size={16} />
              Thêm ngôn ngữ
            </button>
          </div>
        </header>

        <div className="space-y-3">
          {data.languages?.map((language, index) => (
            <div key={language.id} className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                value={language.name || ""}
                onChange={(event) => updateCollection("languages", index, "name", event.target.value)}
                placeholder="Ví dụ: Tiếng Anh"
              />
              <button
                type="button"
                onClick={() => removeCollectionItem("languages", index)}
                className="flex-shrink-0 rounded-lg border border-transparent p-2 text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Giải thưởng & Chứng nhận</h2>
            <p className="text-sm text-slate-500">Ghi lại những thành tích nổi bật hỗ trợ cho câu chuyện nghề nghiệp</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <input
                type="checkbox"
                checked={Boolean(sectionsVisibility.awards)}
                onChange={(event) => onToggleSection("awards", event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Hiển thị trong CV
            </label>
            <button
              type="button"
              onClick={() =>
                addCollectionItem("awards", {
                  id: createId("awd"),
                  title: "",
                  issuer: "",
                  year: "",
                })
              }
              className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-300 hover:bg-white"
            >
              <Plus size={16} />
              Thêm ghi nhận
            </button>
          </div>
        </header>

        <div className="space-y-4">
          {data.awards?.map((award, index) => (
            <div key={award.id} className="rounded-xl border border-slate-200 bg-white/60 p-4 shadow-inner">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-slate-500">Tên giải thưởng</span>
                  <input
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    value={award.title || ""}
                    onChange={(event) => updateCollection("awards", index, "title", event.target.value)}
                    placeholder="Ví dụ: Top 10 Innovators"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-slate-500">Đơn vị trao tặng</span>
                  <input
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    value={award.issuer || ""}
                    onChange={(event) => updateCollection("awards", index, "issuer", event.target.value)}
                    placeholder="Ví dụ: Forbes Vietnam"
                  />
                </label>
              </div>
              <div className="mt-3 flex gap-2">
                <label className="flex flex-1 flex-col gap-2">
                  <span className="text-sm text-slate-500">Năm</span>
                  <input
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    value={award.year || ""}
                    onChange={(event) => updateCollection("awards", index, "year", event.target.value)}
                    placeholder="2024"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeCollectionItem("awards", index)}
                  className="mt-6 rounded-lg border border-transparent p-2 text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CVEditor;
