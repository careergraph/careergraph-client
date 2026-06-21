import { Plus, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";

const CVEditor = ({ data, onChange, sectionsVisibility, onToggleSection, userExperiences = [] }) => {
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);

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

  const mapUserExperienceToCvEntry = (userExp) => {
    return {
      id: userExp.id || createId("exp"),
      role: userExp.jobTitle || "",
      company: userExp.companyName || "",
      location: "",
      startDate: userExp.startDate || "",
      endDate: userExp.isCurrent ? "Hiện tại" : (userExp.endDate || ""),
      bulletPoints: userExp.description ? userExp.description.split('\n').filter(line => line.trim()) : [""],
      relevant: userExp.relevant !== false,
    };
  };

  const handleAddExistingExperience = (userExp) => {
    addCollectionItem("experience", mapUserExperienceToCvEntry(userExp));
    setShowExperienceDropdown(false);
  };

  const handleAddNewExperience = () => {
    addCollectionItem("experience", {
      id: createId("exp"),
      role: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      bulletPoints: [""],
      relevant: true,
    });
    setShowExperienceDropdown(false);
  };

  const getAlreadyAddedExperienceIds = () => {
    return new Set((data.experience || []).map(exp => exp.id));
  };

  // Helper inputs classes
  const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs transition placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10";
  const textareaClass = "w-full min-h-[90px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs transition placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 resize-y";
  const sectionClass = "rounded-xl border border-slate-250 bg-white p-5 shadow-sm";

  return (
    <div className="space-y-6">
      {/* 1. Personal Information Section */}
      <section className={sectionClass}>
        <header className="mb-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Thông tin cá nhân</h2>
          <p className="text-xs text-slate-500 mt-0.5">Các thông tin xuất hiện ở phần đầu CV</p>
        </header>

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-600">Họ và tên</span>
            <input
              type="text"
              className={inputClass}
              value={data.personal?.fullName || ""}
              onChange={(event) => updatePersonal("fullName", event.target.value)}
              placeholder="Ví dụ: Nguyễn Thị Minh Anh"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-600">Vị trí / Headline</span>
            <input
              type="text"
              className={inputClass}
              value={data.personal?.headline || ""}
              onChange={(event) => updatePersonal("headline", event.target.value)}
              placeholder="Ví dụ: Product Designer"
            />
          </label>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-xs font-semibold text-slate-600">Tóm tắt nghề nghiệp</span>
            <textarea
              className={textareaClass}
              value={data.personal?.summary || ""}
              onChange={(event) => updatePersonal("summary", event.target.value)}
              placeholder="Nêu bật kinh nghiệm, thế mạnh của bạn."
            />
          </label>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-xs font-semibold text-slate-600">Địa điểm</span>
            <input
              type="text"
              className={inputClass}
              value={data.personal?.location || ""}
              onChange={(event) => updatePersonal("location", event.target.value)}
              placeholder="Ví dụ: Hà Nội, Việt Nam"
            />
          </label>
        </div>
      </section>

      {/* 2. Contact Section */}
      <section className={sectionClass}>
        <header className="mb-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Liên hệ</h2>
          <p className="text-xs text-slate-500 mt-0.5">Cách nhà tuyển dụng kết nối với bạn</p>
        </header>

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-600">Email</span>
            <input
              type="email"
              className={inputClass}
              value={data.contact?.email || ""}
              onChange={(event) => updateContact("email", event.target.value)}
              placeholder="email@domain.com"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-600">Số điện thoại</span>
            <input
              type="text"
              className={inputClass}
              value={data.contact?.phone || ""}
              onChange={(event) => updateContact("phone", event.target.value)}
              placeholder="Ví dụ: +84 912 345 678"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-600">Website / Portfolio</span>
            <input
              type="text"
              className={inputClass}
              value={data.contact?.website || ""}
              onChange={(event) => updateContact("website", event.target.value)}
              placeholder="Ví dụ: www.portfolio.com"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-600">LinkedIn</span>
            <input
              type="text"
              className={inputClass}
              value={data.contact?.linkedin || ""}
              onChange={(event) => updateContact("linkedin", event.target.value)}
              placeholder="linkedin.com/in/..."
            />
          </label>
        </div>
      </section>

      {/* 3. Work Experience Section */}
      <section className={sectionClass}>
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Kinh nghiệm làm việc</h2>
            <p className="text-xs text-slate-500 mt-0.5">Các vị trí công việc gần đây của bạn</p>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExperienceDropdown(!showExperienceDropdown)}
              className="flex items-center gap-1 rounded border border-slate-350 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Plus size={14} />
              Thêm
              <ChevronDown size={14} className="ml-0.5" />
            </button>

            {showExperienceDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-60 rounded border border-slate-200 bg-white shadow-lg z-20 overflow-hidden text-xs">
                {userExperiences.length > 0 && (
                  <>
                    <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Chọn từ kinh nghiệm có sẵn
                    </div>
                    <div className="max-h-40 overflow-y-auto divide-y divide-slate-100">
                      {userExperiences.map((userExp) => {
                        const isAdded = getAlreadyAddedExperienceIds().has(userExp.id);
                        return (
                          <button
                            key={userExp.id}
                            type="button"
                            onClick={() => handleAddExistingExperience(userExp)}
                            disabled={isAdded}
                            className={`w-full px-3 py-2 text-left transition cursor-pointer ${
                              isAdded
                                ? "opacity-50 cursor-not-allowed bg-slate-50 text-slate-400"
                                : "hover:bg-slate-50 text-slate-800"
                            }`}
                          >
                            <div className="font-semibold text-slate-900 truncate">{userExp.jobTitle}</div>
                            <div className="text-[10px] text-slate-500 truncate">{userExp.companyName}</div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="border-t border-slate-100 px-3 py-1 bg-slate-50/50" />
                  </>
                )}
                <button
                  type="button"
                  onClick={handleAddNewExperience}
                  className="w-full px-3 py-2 text-left font-semibold text-indigo-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  + Thêm kinh nghiệm mới
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="space-y-4">
          {data.experience?.map((item, index) => (
            <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50/30 p-4 relative">
              <div className="mb-3 flex items-center justify-between border-b border-slate-200/50 pb-2">
                <span className="text-xs font-bold text-slate-600">Vị trí #{index + 1}</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={item.relevant !== false}
                      onChange={(event) => updateCollection("experience", index, "relevant", event.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-[10px] font-semibold text-slate-600">Liên quan</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeCollectionItem("experience", index)}
                    className="text-slate-450 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Chức danh</span>
                  <input
                    type="text"
                    className={inputClass}
                    value={item.role || ""}
                    onChange={(event) => updateCollection("experience", index, "role", event.target.value)}
                    placeholder="Ví dụ: Senior Developer"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Công ty</span>
                  <input
                    type="text"
                    className={inputClass}
                    value={item.company || ""}
                    onChange={(event) => updateCollection("experience", index, "company", event.target.value)}
                    placeholder="Ví dụ: FPT Software"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Địa điểm</span>
                  <input
                    type="text"
                    className={inputClass}
                    value={item.location || ""}
                    onChange={(event) => updateCollection("experience", index, "location", event.target.value)}
                    placeholder="Ví dụ: Hà Nội"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Bắt đầu</span>
                    <input
                      type="text"
                      className={inputClass}
                      value={item.startDate || ""}
                      onChange={(event) => updateCollection("experience", index, "startDate", event.target.value)}
                      placeholder="01/2021"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Kết thúc</span>
                    <input
                      type="text"
                      className={inputClass}
                      value={item.endDate || ""}
                      onChange={(event) => updateCollection("experience", index, "endDate", event.target.value)}
                      placeholder="Hiện tại"
                    />
                  </label>
                </div>
              </div>

              {/* Bullet Points */}
              <div className="mt-4 border-t border-slate-200/50 pt-3 space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Chi tiết công việc</span>
                <div className="space-y-2">
                  {item.bulletPoints?.map((bullet, bulletIndex) => (
                    <div key={`${item.id}-bullet-${bulletIndex}`} className="flex gap-1.5 items-start">
                      <textarea
                        className="h-14 flex-1 rounded border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-indigo-500 focus:outline-none resize-none transition"
                        value={bullet || ""}
                        onChange={(event) => updateBullet(index, bulletIndex, event.target.value)}
                        placeholder="Mô tả nhiệm vụ hoặc thành tích của bạn..."
                      />
                      <button
                        type="button"
                        onClick={() => removeBullet(index, bulletIndex)}
                        className="mt-1 text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addBullet(index)}
                  className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
                >
                  + Thêm dòng mô tả
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Education Section */}
      <section className={sectionClass}>
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Học vấn</h2>
            <p className="text-xs text-slate-500 mt-0.5">Trường học và ngành học của bạn</p>
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
            className="flex items-center gap-1 rounded border border-slate-350 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Plus size={14} />
            Thêm
          </button>
        </header>

        <div className="space-y-4">
          {data.education?.map((item, index) => (
            <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50/30 p-4">
              <div className="mb-3 flex items-center justify-between border-b border-slate-200/50 pb-2">
                <span className="text-xs font-bold text-slate-600">Trường học #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeCollectionItem("education", index)}
                  className="text-slate-450 hover:text-red-500 transition cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Tên trường</span>
                  <input
                    type="text"
                    className={inputClass}
                    value={item.school || ""}
                    onChange={(event) => updateCollection("education", index, "school", event.target.value)}
                    placeholder="Ví dụ: Đại học Quốc gia Hà Nội"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Ngành học / Bằng cấp</span>
                  <input
                    type="text"
                    className={inputClass}
                    value={item.degree || ""}
                    onChange={(event) => updateCollection("education", index, "degree", event.target.value)}
                    placeholder="Ví dụ: Kỹ sư Công nghệ thông tin"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Bắt đầu</span>
                    <input
                      type="text"
                      className={inputClass}
                      value={item.startDate || ""}
                      onChange={(event) => updateCollection("education", index, "startDate", event.target.value)}
                      placeholder="2018"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Kết thúc</span>
                    <input
                      type="text"
                      className={inputClass}
                      value={item.endDate || ""}
                      onChange={(event) => updateCollection("education", index, "endDate", event.target.value)}
                      placeholder="2022"
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Skills Section */}
      <section className={sectionClass}>
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Kỹ năng</h2>
            <p className="text-xs text-slate-500 mt-0.5">Các kỹ năng chuyên môn của bạn</p>
          </div>
          <button
            type="button"
            onClick={() => addCollectionItem("skills", { id: createId("skill"), name: "" })}
            className="flex items-center gap-1 rounded border border-slate-350 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Plus size={14} />
            Thêm
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {data.skills?.map((skill, index) => {
            const skillObj = typeof skill === 'string' ? { id: skill, name: skill } : skill;
            return (
              <div key={skillObj.id || `skill-${index}`} className="flex gap-1.5 items-center">
                <input
                  type="text"
                  className={inputClass}
                  value={skillObj.name || ""}
                  onChange={(event) => updateCollection("skills", index, "name", event.target.value)}
                  placeholder="Ví dụ: React, Node.js..."
                />
                <button
                  type="button"
                  onClick={() => removeCollectionItem("skills", index)}
                  className="text-slate-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Languages Section */}
      <section className={sectionClass}>
        <header className="mb-4 flex items-center justify-between">
          <label className="flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(sectionsVisibility.languages)}
              onChange={(event) => onToggleSection("languages", event.target.checked)}
              className="mr-2 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">Ngôn ngữ</span>
          </label>

          <button
            type="button"
            onClick={() =>
              addCollectionItem("languages", {
                id: createId("lang"),
                name: "",
              })
            }
            disabled={!sectionsVisibility.languages}
            className="flex items-center gap-1 rounded border border-slate-350 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
            Thêm
          </button>
        </header>

        <div className={`space-y-2 transition ${sectionsVisibility.languages ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
          {data.languages?.map((language, index) => (
            <div key={language.id} className="flex gap-1.5 items-center">
              <input
                type="text"
                className={inputClass}
                value={language.name || ""}
                onChange={(event) => updateCollection("languages", index, "name", event.target.value)}
                placeholder="Ví dụ: Tiếng Anh (IELTS 7.0)"
              />
              <button
                type="button"
                onClick={() => removeCollectionItem("languages", index)}
                className="text-slate-400 hover:text-red-500 cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Awards & Certifications Section */}
      <section className={sectionClass}>
        <header className="mb-4 flex items-center justify-between">
          <label className="flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(sectionsVisibility.awards)}
              onChange={(event) => onToggleSection("awards", event.target.checked)}
              className="mr-2 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">Chứng chỉ & Giải thưởng</span>
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
            disabled={!sectionsVisibility.awards}
            className="flex items-center gap-1 rounded border border-slate-350 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
            Thêm
          </button>
        </header>

        <div className={`space-y-4 transition ${sectionsVisibility.awards ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
          {data.awards?.map((award, index) => (
            <div key={award.id} className="rounded-lg border border-slate-200 bg-slate-50/30 p-4 relative">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Tên giải thưởng / Chứng chỉ</span>
                  <input
                    type="text"
                    className={inputClass}
                    value={award.title || ""}
                    onChange={(event) => updateCollection("awards", index, "title", event.target.value)}
                    placeholder="Ví dụ: AWS Cloud Practitioner"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Nơi cấp</span>
                  <input
                    type="text"
                    className={inputClass}
                    value={award.issuer || ""}
                    onChange={(event) => updateCollection("awards", index, "issuer", event.target.value)}
                    placeholder="Ví dụ: Amazon Web Services"
                  />
                </label>
              </div>

              <div className="mt-3 flex gap-2 items-end">
                <label className="flex flex-1 flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Năm nhận</span>
                  <input
                    type="text"
                    className={inputClass}
                    value={award.year || ""}
                    onChange={(event) => updateCollection("awards", index, "year", event.target.value)}
                    placeholder="2023"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => removeCollectionItem("awards", index)}
                  className="rounded border border-transparent p-1.5 text-slate-400 transition hover:text-red-500 cursor-pointer"
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
