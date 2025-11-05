import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LayoutTemplate, ArrowLeft } from "lucide-react";
import dotBanner from "../assets/images/hero-section-dot-image.png";
import CVEditor from "../sections/CVBuilder/components/CVEditor.jsx";
import PdfPreview from "../sections/CVBuilder/components/PdfPreview.jsx";
import { cvTemplates } from "../data/templatesConfig.js";
import {
  defaultCvData,
  defaultSectionsVisibility,
} from "../data/defaultCvData.js";
import { templateRegistry } from "../sections/CVBuilder/templates/index.js";

const cloneDeep = (value) => JSON.parse(JSON.stringify(value));

export default function CVBuilder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateFromUrl = searchParams.get("template");

  const [selectedTemplate, setSelectedTemplate] = useState(
    templateFromUrl || "harvard"
  );
  const [cvData, setCvData] = useState(() => cloneDeep(defaultCvData));
  const [sectionsVisibility, setSectionsVisibility] = useState(() => ({
    ...defaultSectionsVisibility,
  }));

  // Update selected template when URL changes
  useEffect(() => {
    if (templateFromUrl && cvTemplates.find((t) => t.id === templateFromUrl)) {
      setSelectedTemplate(templateFromUrl);
    }
  }, [templateFromUrl]);

  const TemplateComponent = templateRegistry[selectedTemplate];
  const preparedData = useMemo(() => {
    const cleanList = (list, predicate) =>
      Array.isArray(list) ? list.filter((item) => predicate(item)) : [];

    const experience = cleanList(cvData.experience, (item) =>
      Boolean(
        item?.role?.trim() ||
          item?.company?.trim() ||
          item?.bulletPoints?.some((bullet) => Boolean(bullet?.trim()))
      )
    ).map((item) => ({
      ...item,
      bulletPoints: cleanList(item.bulletPoints, (bullet) =>
        Boolean(bullet?.trim())
      ),
    }));

    const education = cleanList(cvData.education, (item) =>
      Boolean(item?.school?.trim() || item?.degree?.trim())
    );

    const skills = cleanList(cvData.skills, (skill) => 
      Boolean(skill?.name?.trim() || (typeof skill === 'string' && skill?.trim()))
    ).map((skill) => {
      // Normalize to object format
      if (typeof skill === 'string') {
        return { id: skill, name: skill };
      }
      return skill;
    });

    const languages = sectionsVisibility.languages
      ? cleanList(cvData.languages, (lang) => Boolean(lang?.name?.trim()))
      : [];

    const awards = sectionsVisibility.awards
      ? cleanList(cvData.awards, (award) => Boolean(award?.title?.trim()))
      : [];

    return {
      ...cvData,
      personal: {
        ...cvData.personal,
        summary:
          sectionsVisibility.summary === false ? "" : cvData.personal?.summary,
      },
      experience,
      education,
      skills,
      languages,
      awards,
    };
  }, [cvData, sectionsVisibility]);

  const handleDataChange = (nextData) => {
    setCvData(nextData);
  };

  const handleToggleSection = (sectionKey, isVisible) => {
    setSectionsVisibility((current) => ({
      ...current,
      [sectionKey]: isVisible,
    }));
  };

  const activeTemplate = cvTemplates.find(
    (template) => template.id === selectedTemplate
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50">
      <section
        className="relative -mt-24 overflow-hidden bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${dotBanner})` }}
      >
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            {/* Back button */}
            <button
              onClick={() => navigate("/template-cv")}
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition w-fit"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">
                Quay lại danh sách mẫu
              </span>
            </button>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <h1
                  className="text-4xl md:text-5xl font-semibold drop-shadow bg-clip-text text-transparent mb-4"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #6a5af9, #7b6cf9, #a78bfa)",
                  }}
                >
                  Xây dựng CV
                </h1>
                <p className="text-base leading-relaxed text-slate-600">
                  Chỉnh sửa thông tin, xem trước realtime và tải xuống PDF chất
                  lượng cao
                </p>
                {activeTemplate ? (
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm w-fit">
                    <LayoutTemplate size={18} className="text-indigo-500" />
                    <span>
                      Template:
                      <strong className="ml-1 text-slate-900">
                        {activeTemplate.name}
                      </strong>
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1600px] space-y-8 px-4 pb-20 pt-4 sm:px-6 lg:px-8">
        {/* Hide template gallery, focus on editing */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
          <div className="lg:col-span-4">
            <CVEditor
              data={cvData}
              onChange={handleDataChange}
              sectionsVisibility={sectionsVisibility}
              onToggleSection={handleToggleSection}
            />
          </div>
          <div className="lg:col-span-6">
            <div className="h-[900px] lg:sticky lg:top-24">
              <PdfPreview
                TemplateComponent={TemplateComponent}
                data={preparedData}
                fileName={`${
                  cvData.personal?.fullName || "cv"
                }-${selectedTemplate}.pdf`}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
