import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, User, Contact2, Briefcase, GraduationCap, Wrench, Globe, Trophy, RotateCcw } from "lucide-react";

const SectionContainer = ({ id, title, description, icon: Icon, isTogglable, isVisible, onToggle, isExpanded, onExpand, children, actions }) => {
  return (
    <div className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${isExpanded ? 'border-indigo-300 ring-4 ring-indigo-50/50' : 'border-slate-200 hover:border-indigo-200'}`}>
      <header 
        className="flex cursor-pointer select-none flex-wrap items-center justify-between gap-4 p-4 hover:bg-slate-50/80 md:p-5"
        onClick={() => onExpand(isExpanded ? null : id)}
      >
        <div className="flex flex-1 items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all ${isExpanded ? 'bg-indigo-100 text-indigo-600 scale-105' : 'bg-slate-100 text-slate-500'}`}>
             {Icon && <Icon size={24} />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className={`text-lg font-semibold ${isExpanded ? 'text-indigo-900' : 'text-slate-800'}`}>{title}</h2>
              {isTogglable && (
                <label 
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600"
                  onClick={e => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(isVisible)}
                    onChange={(e) => onToggle(id, e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Hiển thị
                </label>
              )}
            </div>
            {description && <p className="mt-1 text-sm text-slate-500 hidden md:block">{description}</p>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2" onClick={e => e.stopPropagation()}>
          {actions}
          <button 
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => onExpand(isExpanded ? null : id)}
          >
             {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </header>
      
      {isExpanded && (
        <div className="border-t border-slate-100 bg-white p-5 md:p-6 shadow-inner animate-in slide-in-from-top-2 fade-in duration-200 ease-out">
          {children}
        </div>
      )}
    </div>
  );
};

const CVEditor = ({ data, onChange, sectionsVisibility, onToggleSection, onReset }) => {
  const [expandedSection, setExpandedSection] = useState("personal");

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
    setExpandedSection(key);
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
    <div className="space-y-4 pb-24">
      {/* Action Bar */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          <RotateCcw size={16} />
          <span>Làm mới CV</span>
        </button>
      </div>

      <SectionContainer
        id="personal"
        title="Thông tin chung"
        description="Hình ảnh cá nhân chuyên nghiệp và tóm tắt tiểu sử"
        icon={User}
        isExpanded={expandedSection === "personal"}
        onExpand={setExpandedSection}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Họ và tên</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={data.personal?.fullName || ""}
              onChange={(event) => updatePersonal("fullName", event.target.value)}
              placeholder="Ví dụ: Nguyễn Thị Minh Anh"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Vị trí / Headline</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={data.personal?.headline || ""}
              onChange={(event) => updatePersonal("headline", event.target.value)}
              placeholder="Ví dụ: Product Designer"
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">Tóm tắt tiểu sử</span>
              <label className="flex cursor-pointer items-center gap-1.5 rounded text-xs text-slate-500 hover:text-indigo-600">
                <input
                  type="checkbox"
                  checked={Boolean(sectionsVisibility.summary)}
                  onChange={(e) => onToggleSection("summary", e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Hiển thị trong CV
              </label>
            </div>
            <textarea
              className="min-h-[120px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={data.personal?.summary || ""}
              onChange={(event) => updatePersonal("summary", event.target.value)}
              placeholder="Nêu bật chuyên môn, mục tiêu và giá trị bạn mang lại."
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Khu vực sinh sống</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={data.personal?.location || ""}
              onChange={(event) => updatePersonal("location", event.target.value)}
              placeholder="Ví dụ: Hà Nội, Việt Nam"
            />
          </label>
        </div>
      </SectionContainer>

      <SectionContainer
        id="contact"
        title="Liên hệ"
        description="Cách nhà tuyển dụng kết nối với bạn"
        icon={Contact2}
        isExpanded={expandedSection === "contact"}
        onExpand={setExpandedSection}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={data.contact?.email || ""}
              onChange={(event) => updateContact("email", event.target.value)}
              placeholder="email@domain.com"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Số điện thoại</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={data.contact?.phone || ""}
              onChange={(event) => updateContact("phone", event.target.value)}
              placeholder="+84 912 345 678"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Website / Portfolio</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={data.contact?.website || ""}
              onChange={(event) => updateContact("website", event.target.value)}
              placeholder="https://yourportfolio.com"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">LinkedIn</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={data.contact?.linkedin || ""}
              onChange={(event) => updateContact("linkedin", event.target.value)}
              placeholder="linkedin.com/in/username"
            />
          </label>
        </div>
      </SectionContainer>

      <SectionContainer
        id="experience"
        title="Kinh nghiệm"
        description="Lịch sử làm việc và thành tựu chuyên môn"
        icon={Briefcase}
        isTogglable={true}
        isVisible={sectionsVisibility.experience !== false}
        onToggle={onToggleSection}
        isExpanded={expandedSection === "experience"}
        onExpand={setExpandedSection}
        actions={
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
            className="hidden items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100 sm:flex"
          >
            <Plus size={16} /> Thêm
          </button>
        }
      >
        <div className="space-y-6">
          {data.experience?.map((item, index) => (
            <div key={item.id} className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition hover:border-slate-300">
              <div className="absolute right-4 top-4">
                <button
                  type="button"
                  onClick={() => removeCollectionItem("experience", index)}
                  className="rounded-full bg-white p-2 text-slate-400 shadow-sm transition hover:bg-red-50 hover:text-red-500"
                  title="Xóa kinh nghiệm này"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mb-4 pr-10">
                <h3 className="font-semibold text-slate-800">Cột mốc #{index + 1}</h3>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">Chức danh</span>
                    <input
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      value={item.role || ""}
                      onChange={(event) => updateCollection("experience", index, "role", event.target.value)}
                      placeholder="Senior Designer"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">Công ty</span>
                    <input
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      value={item.company || ""}
                      onChange={(event) => updateCollection("experience", index, "company", event.target.value)}
                      placeholder="Tech Corp"
                    />
                  </label>
                </div>
                
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">Khu vực</span>
                    <input
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      value={item.location || ""}
                      onChange={(event) => updateCollection("experience", index, "location", event.target.value)}
                      placeholder="Hà Nội"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">Bắt đầu</span>
                    <input
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      value={item.startDate || ""}
                      onChange={(event) => updateCollection("experience", index, "startDate", event.target.value)}
                      placeholder="01/2020"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">Kết thúc</span>
                    <input
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      value={item.endDate || ""}
                      onChange={(event) => updateCollection("experience", index, "endDate", event.target.value)}
                      placeholder="Hiện tại"
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  <span className="text-sm font-semibold text-slate-700">Thành tựu & Nhiệm vụ</span>
                  {item.bulletPoints?.map((bullet, bulletIndex) => (
                    <div key={`${item.id}-bullet-${bulletIndex}`} className="flex gap-2 group">
                      <textarea
                        className="min-h-[80px] flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        value={bullet || ""}
                        onChange={(event) => updateBullet(index, bulletIndex, event.target.value)}
                        placeholder="Mô tả công việc và kết quả định lượng..."
                      />
                      <button
                        type="button"
                        onClick={() => removeBullet(index, bulletIndex)}
                        className="flex shrink-0 items-start justify-center rounded-xl p-2.5 text-slate-300 opacity-0 transition group-hover:bg-red-50 group-hover:text-red-500 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addBullet(index)}
                    className="flex w-fit items-center gap-2 rounded-lg py-1.5 pr-3 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
                  >
                    <Plus size={16} /> Thêm mô tả
                  </button>
                </div>
              </div>
            </div>
          ))}
          
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
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-200 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50"
          >
            <Plus size={18} /> Thêm một kinh nghiệm làm việc mới
          </button>
        </div>
      </SectionContainer>

      <SectionContainer
        id="education"
        title="Học vấn"
        description="Trường học và các chương trình đào tạo"
        icon={GraduationCap}
        isTogglable={true}
        isVisible={sectionsVisibility.education !== false}
        onToggle={onToggleSection}
        isExpanded={expandedSection === "education"}
        onExpand={setExpandedSection}
        actions={
          <button
            onClick={() =>
              addCollectionItem("education", {
                id: createId("edu"),
                school: "",
                degree: "",
                startDate: "",
                endDate: "",
              })
            }
            className="hidden items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100 sm:flex"
          >
            <Plus size={16} /> Thêm
          </button>
        }
      >
        <div className="space-y-5">
          {data.education?.map((item, index) => (
            <div key={item.id} className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition hover:border-slate-300">
              <button
                type="button"
                onClick={() => removeCollectionItem("education", index)}
                className="absolute right-4 top-4 rounded-full bg-white p-2 text-slate-400 shadow-sm transition hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Trường/ Tổ chức</span>
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    value={item.school || ""}
                    onChange={(event) => updateCollection("education", index, "school", event.target.value)}
                    placeholder="Đại học Bách Khoa"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Chuyên ngành / Bằng cấp</span>
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    value={item.degree || ""}
                    onChange={(event) => updateCollection("education", index, "degree", event.target.value)}
                    placeholder="Cử nhân CNTT"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Bắt đầu</span>
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    value={item.startDate || ""}
                    onChange={(event) => updateCollection("education", index, "startDate", event.target.value)}
                    placeholder="2016"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Kết thúc</span>
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    value={item.endDate || ""}
                    onChange={(event) => updateCollection("education", index, "endDate", event.target.value)}
                    placeholder="2020"
                  />
                </label>
              </div>
            </div>
          ))}
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
            className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
          >
            <Plus size={16} /> Thêm học vấn
          </button>
        </div>
      </SectionContainer>

      <SectionContainer
        id="skills"
        title="Kỹ năng xuất sắc"
        description="Các chuyên môn nổi bật"
        icon={Wrench}
        isTogglable={true}
        isVisible={sectionsVisibility.skills !== false}
        onToggle={onToggleSection}
        isExpanded={expandedSection === "skills"}
        onExpand={setExpandedSection}
        actions={
          <button
            onClick={() => addCollectionItem("skills", { id: createId("skill"), name: "" })}
            className="hidden items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100 sm:flex"
          >
            <Plus size={16} /> Thêm
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.skills?.map((skill, index) => {
            const skillObj = typeof skill === 'string' ? { id: skill, name: skill } : skill;
            return (
              <div key={skillObj.id || `skill-${index}`} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-1.5 pr-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                <input
                  className="w-full bg-transparent px-3 py-1.5 text-sm font-medium text-slate-800 focus:outline-none"
                  value={skillObj.name || ""}
                  onChange={(event) => updateCollection("skills", index, "name", event.target.value)}
                  placeholder="Ví dụ: React.js"
                />
                <button
                  type="button"
                  onClick={() => removeCollectionItem("skills", index)}
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
        <button
          className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
          onClick={() => addCollectionItem("skills", { id: createId("skill"), name: "" })}
        >
          <Plus size={16} /> Thêm kỹ năng mới
        </button>
      </SectionContainer>

      <SectionContainer
        id="languages"
        title="Ngôn ngữ"
        description="Khả năng giao tiếp và ngoại ngữ"
        icon={Globe}
        isTogglable={true}
        isVisible={sectionsVisibility.languages !== false}
        onToggle={onToggleSection}
        isExpanded={expandedSection === "languages"}
        onExpand={setExpandedSection}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.languages?.map((language, index) => (
            <div key={language.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-1.5 pr-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
              <input
                className="w-full bg-transparent px-3 py-1.5 text-sm font-medium text-slate-800 focus:outline-none"
                value={language.name || ""}
                onChange={(event) => updateCollection("languages", index, "name", event.target.value)}
                placeholder="Ví dụ: Tiếng Anh - IELTS 7.5"
              />
              <button
                type="button"
                onClick={() => removeCollectionItem("languages", index)}
                className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
          onClick={() => addCollectionItem("languages", { id: createId("lang"), name: "" })}
        >
          <Plus size={16} /> Thêm ngôn ngữ
        </button>
      </SectionContainer>

      <SectionContainer
        id="awards"
        title="Giải thưởng & Tham gia"
        description="Bằng khen, giải thưởng, hoặc chứng chỉ"
        icon={Trophy}
        isTogglable={true}
        isVisible={sectionsVisibility.awards !== false}
        onToggle={onToggleSection}
        isExpanded={expandedSection === "awards"}
        onExpand={setExpandedSection}
      >
        <div className="space-y-4">
          {data.awards?.map((award, index) => (
            <div key={award.id} className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition hover:border-slate-300">
              <button
                type="button"
                onClick={() => removeCollectionItem("awards", index)}
                className="absolute right-4 top-4 rounded-full bg-white p-2 text-slate-400 shadow-sm transition hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 pr-8 mt-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Tên giải thưởng / Chứng chỉ</span>
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    value={award.title || ""}
                    onChange={(event) => updateCollection("awards", index, "title", event.target.value)}
                    placeholder="Ví dụ: Top 10 Hackathon VietNam"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Đơn vị cấp</span>
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    value={award.issuer || ""}
                    onChange={(event) => updateCollection("awards", index, "issuer", event.target.value)}
                    placeholder="FPT Corporation"
                  />
                </label>
                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Thời gian nhận</span>
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    value={award.year || ""}
                    onChange={(event) => updateCollection("awards", index, "year", event.target.value)}
                    placeholder="2024"
                  />
                </label>
              </div>
            </div>
          ))}
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
            className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
          >
            <Plus size={16} /> Thêm giải thưởng
          </button>
        </div>
      </SectionContainer>
    </div>
  );
};

export default CVEditor;
