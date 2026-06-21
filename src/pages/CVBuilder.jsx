import { useMemo, useState, useEffect, useRef } from "react";
import { useUserStore } from "../stores/userStore";
import { useLocation as useLocationHook } from "../hooks/use-location";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Sparkles, CheckCircle } from "lucide-react";
import CVEditor from "../sections/CVBuilder/components/CVEditor.jsx";
import PdfPreview from "../sections/CVBuilder/components/PdfPreview.jsx";
import { cvTemplates } from "../data/templatesConfig.js";
import {
  defaultCvData,
  defaultSectionsVisibility,
} from "../data/defaultCvData.js";
import { templateRegistry } from "../sections/CVBuilder/templates/index.js";
import { JobService } from "../services/jobService";

const cloneDeep = (value) => JSON.parse(JSON.stringify(value));

export default function CVBuilder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const templateFromUrl = searchParams.get("template");
  const colorFromUrl = searchParams.get("color");

  const storageKey = (() => {
    const suggestionId = searchParams.get("suggestionId");
    if (suggestionId) return `cvBuilderData_suggestion_${suggestionId}`;
    const job = location.state?.job;
    if (job?.id) return `cvBuilderData_job_${job.id}`;
    return "cvBuilderData_default";
  })();

  const isLoadedFromStorageRef = useRef(false);
  const [selectedTemplate, setSelectedTemplate] = useState(
    templateFromUrl || "harvard",
  );
  const [cvData, setCvData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.expiry || Date.now() > parsed.expiry) {
           localStorage.removeItem(storageKey);
        } else {
           isLoadedFromStorageRef.current = true;
           return parsed.data;
        }
      }
    } catch (e) {
      console.error("Failed to parse cvBuilderData from localStorage", e);
    }
    const defaultData = cloneDeep(defaultCvData);
    if (colorFromUrl) {
      defaultData.personal = defaultData.personal || {};
      defaultData.personal.themeColor = colorFromUrl;
    }
    return defaultData;
  });
  const [sectionsVisibility, setSectionsVisibility] = useState(() => ({
    ...defaultSectionsVisibility,
  }));

  const user = useUserStore((state) => state.user);
  const jobFromState = location.state?.job;
  const [suggestedCv, setSuggestedCv] = useState(location.state?.suggestedCv);

  const { provinceName, districtName } = useLocationHook(
    user?.primaryAddress?.province,
    user?.primaryAddress?.district,
  );
  const userLoadedRef = useRef(false);

  // Fetch suggestion from API if suggestionId is in URL params
  useEffect(() => {
    const suggestionId = searchParams.get("suggestionId");
    if (suggestionId && !suggestedCv) {
      const fetchSuggestion = async () => {
        try {
          console.log('[CV Debug] Fetching suggestion from API:', suggestionId);
          const response = await JobService.fetchCvSuggestionById(suggestionId);
          console.log('[CV Debug] Fetch response:', response);

          if (response) {
            try {
              const suggestionData = response.data || response;
              console.log('[CV Debug] Final suggestionData to set:', suggestionData);
              setSuggestedCv(suggestionData);
            } catch (parseError) {
              console.error('[CV Debug] Failed to parse response:', parseError);
            }
          }
        } catch (error) {
          console.error("Failed to fetch CV suggestion:", error);
        }
      };
      fetchSuggestion();
    }
  }, [searchParams, suggestedCv]);

  useEffect(() => {
    if (suggestedCv) {
      const aiData = suggestedCv.data || suggestedCv;

      const ensureIds = (items, prefix) => {
        if (!Array.isArray(items)) return [];
        return items.map((item, index) => ({
          ...item,
          id: item.id || `${prefix}-${Date.now()}-${index}`,
        }));
      };

      // Map all experiences, preserving the relevant field
      const allExperiences = ensureIds(aiData.allExperiences || aiData.experience || [], "exp");
      const experiences = allExperiences;

      const processedData = {
        ...aiData,
        experience: experiences,
        education: ensureIds(aiData.education, "edu"),
        skills: ensureIds(aiData.skills, "skill"),
      };

      if (Array.isArray(aiData.languages) && aiData.languages.length > 0) {
        processedData.languages = ensureIds(aiData.languages, "lang").map(
          (lang) => ({
            ...lang,
            name: lang.name || lang.language || "",
          }),
        );
      } else {
        delete processedData.languages;
      }

      if (Array.isArray(aiData.awards) && aiData.awards.length > 0) {
        processedData.awards = ensureIds(aiData.awards, "award");
      } else {
        delete processedData.awards;
      }

      setCvData((prev) => {
        const next = {
          ...prev,
          ...processedData,
          personal: { ...prev.personal, ...(processedData.personal || {}) },
          contact: { ...prev.contact, ...(processedData.contact || {}) },
        };
        return next;
      });

      userLoadedRef.current = true;
      return;
    }

    if (user && !userLoadedRef.current) {
      userLoadedRef.current = true; // Mark as loaded so it doesn't trigger again

      // Nếu đang chờ API suggestionId thì không load user data
      const suggestionId = searchParams.get("suggestionId");
      if (suggestionId) {
        console.log('[CV Debug] Skipping user data load - suggestionId present in URL:', suggestionId);
        return;
      }

      // If we already successfully loaded their draft from localStorage, don't overwrite it with base profile data
      if (isLoadedFromStorageRef.current) {
        return;
      }

      const hasExperience = user.experiences && user.experiences.length > 0;
      const hasEducation = user.educations && user.educations.length > 0;
      const hasSkills = user.skills && user.skills.length > 0;

      const newCvData = {
        personal: {
          fullName:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            defaultCvData.personal.fullName,
          headline: jobFromState?.title || "Ứng viên tiềm năng",
          summary: jobFromState
            ? `Mong muốn ứng tuyển vị trí ${jobFromState.title} tại ${jobFromState.companyName || "quý công ty"}. Với kinh nghiệm và kỹ năng hiện có, tôi tin rằng mình có thể đóng góp tích cực vào sự phát triển của công ty.`
            : defaultCvData.personal.summary,
          location: "",
        },
        contact: {
          email: user.email || defaultCvData.contact.email,
          phone: user.primaryContact?.value || defaultCvData.contact.phone,
          website: defaultCvData.contact.website,
          linkedin: defaultCvData.contact.linkedin,
        },
        experience: hasExperience
          ? (user.experiences || []).map((exp) => ({
              id: exp.id || `exp-${Math.random()}`,
              role: exp.jobTitle || "",
              company: exp.companyName || "",
              location: "",
              startDate: exp.startDate || "",
              endDate: exp.isCurrent ? "Hiện tại" : exp.endDate || "",
              bulletPoints: exp.description
                ? exp.description.split("\n").filter((line) => line.trim())
                : [],
            }))
          : defaultCvData.experience,
        education: hasEducation
          ? (user.educations || []).map((edu) => ({
              id: edu.id || `edu-${Math.random()}`,
              school: edu.officialName || "",
              degree:
                `${edu.degreeTitle || ""} ${edu.major ? "- " + edu.major : ""}`.trim(),
              startDate: edu.startDate || "",
              endDate: edu.endDate || "",
            }))
          : defaultCvData.education,
        skills: hasSkills
          ? (user.skills || []).map((skill) => ({
              id: skill.id || `skill-${Math.random()}`,
              name: skill.skillName || skill.name || "",
            }))
          : (jobFromState?.skills || []).length > 0
            ? (jobFromState.skills || []).map((skill, index) => ({
                id: `skill-${index}`,
                name: skill.name || skill,
              }))
            : defaultCvData.skills,
        languages: defaultCvData.languages,
        awards: defaultCvData.awards,
      };

      setCvData((prev) => ({
        ...prev,
        ...newCvData,
        personal: { ...prev.personal, ...newCvData.personal },
        contact: { ...prev.contact, ...newCvData.contact },
      }));
    }
  }, [user, jobFromState, suggestedCv]);

  useEffect(() => {
    if ((provinceName || districtName) && userLoadedRef.current) {
      setCvData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          location: [districtName, provinceName].filter(Boolean).join(", "),
        },
      }));
    }
  }, [provinceName, districtName]);

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

    const experience = cleanList(
      cvData.experience,
      (item) => item?.relevant !== false,
    ).map((item) => ({
      ...item,
      bulletPoints: cleanList(item.bulletPoints, (bullet) =>
        Boolean(bullet?.trim()),
      ),
    }));

    const education = cleanList(cvData.education, (item) =>
      Boolean(item?.school?.trim() || item?.degree?.trim()),
    );

    const skills = cleanList(cvData.skills, (skill) =>
      Boolean(
        skill?.name?.trim() || (typeof skill === "string" && skill?.trim()),
      ),
    ).map((skill) => {
      if (typeof skill === "string") {
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

  // Save to localStorage whenever cvData changes
  useEffect(() => {
    const dataToSave = {
      data: cvData,
      expiry: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
  }, [cvData, storageKey]);

  const handleToggleSection = (sectionKey, isVisible) => {
    setSectionsVisibility((current) => ({
      ...current,
      [sectionKey]: isVisible,
    }));
  };

  const activeTemplate = cvTemplates.find(
    (template) => template.id === selectedTemplate,
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Workspace container */}
      <main className="mx-auto max-w-[1600px] w-full px-0 py-2 sm:px-2 flex-1">
        {/* Clean Standard Header Navigation Card */}
        <header className="border border-slate-200 bg-white px-4 py-3 rounded-xl shadow-xs mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/template-cv")}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              Quay lại
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-950">
                Xây dựng CV
              </h1>
              <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                Mẫu: {activeTemplate?.name || selectedTemplate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100/50">
            <CheckCircle size={12} className="text-emerald-500" />
            <span className="font-semibold hidden sm:inline">
              Đã tự động lưu nháp
            </span>
            <span className="font-semibold inline sm:hidden">Đã lưu</span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
          {/* Editor - 5 cols */}
          <div className="lg:col-span-5">
            <CVEditor
              data={cvData}
              onChange={handleDataChange}
              sectionsVisibility={sectionsVisibility}
              onToggleSection={handleToggleSection}
              userExperiences={user?.experiences || []}
            />
          </div>
          {/* Preview - 7 cols */}
          <div className="lg:col-span-7 lg:sticky lg:top-[6.5rem]">
            <div className="h-[calc(100vh-130px)] min-h-[550px] lg:h-[calc(100vh-120px)]">
              <PdfPreview
                TemplateComponent={TemplateComponent}
                data={preparedData}
                fileName={`${cvData.personal?.fullName || "cv"}-${selectedTemplate}.pdf`}
                job={jobFromState}
                cvData={cvData}
                onThemeColorChange={(color) => setCvData(prev => ({ ...prev, personal: { ...prev.personal, themeColor: color } }))}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
