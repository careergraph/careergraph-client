// AppliedJobs.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, FileText, MessageCircle } from "lucide-react";
import { createPortal } from "react-dom";
import { UserAPI } from "~/services/api/user";
import aiFeatureLogin from "../assets/icons/ai-feature.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import messagingApi from "~/features/messaging/api/messagingApi";
import { JobService } from "~/services/jobService";
import { formatDateYMD } from "~/utils/dateUtils";

const fmtDate = (iso) => formatDateYMD(iso);

const statusStyles = {
  SUCCESS: "bg-violet-100 text-violet-700",
  PENDING: "bg-amber-100 text-amber-800",
  REJECTED: "bg-rose-100 text-rose-700",
};

function StatusBadge({ value, label }) {
  const resolvedLabel = label || "Đang chờ";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusStyles[value] || statusStyles.PENDING}`}
    >
      {resolvedLabel}
    </span>
  );
}

export function Select({ value, onChange, placeholder, options, className }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      const button = btnRef.current;
      const dropdown = dropdownRef.current;
      if (!button || !dropdown) return;

      if (!button.contains(e.target) && !dropdown.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((s) => !s)}
        type="button"
        className={`flex h-10 min-w-[220px] items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 hover:bg-slate-50 ${className || ""}`}
      >
        <span className={current ? "" : "text-slate-400"}>
          {current ? current.label : placeholder || "Chọn"}
        </span>
        <ChevronDown size={16} className="opacity-70" />
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: coords?.top,
              left: coords?.left,
              width: coords?.width,
              zIndex: 9999,
            }}
            className="animate-in rounded-xl border border-slate-200 bg-white shadow-lg fade-in"
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((o) => (
                <button
                  key={o.value}
                  onClick={() => {
                    onChange?.(o.value);
                    setOpen(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-violet-100 ${
                    o.value === value
                      ? "bg-violet-100 font-medium text-violet-700"
                      : "text-slate-700"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default function AppliedJobs() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [openingChatJobId, setOpeningChatJobId] = useState(null);
  const [items, setItems] = useState(null);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [stageOptions, setStageOptions] = useState([]);
  const [highlightedId, setHighlightedId] = useState(null);
  const highlightTimerRef = useRef(null);
  const rowRefs = useRef({});
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const applicationIdParam = searchParams.get("applicationId");
  const companyIdParam = searchParams.get("companyId") || "";
  const statusParam = searchParams.get("status") || "";
  const refreshTsParam = searchParams.get("ts") || "";

  const [selectedCompanyId, setSelectedCompanyId] = useState(companyIdParam);
  const [selectedStatus, setSelectedStatus] = useState(statusParam);

  const updateSearchParams = useCallback(
    (newCompanyId, newStatus, newApplicationId) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        next.delete("refresh");
        next.delete("ts");

        if (newCompanyId) {
          next.set("companyId", newCompanyId);
        } else {
          next.delete("companyId");
        }

        if (newStatus) {
          next.set("status", newStatus);
        } else {
          next.delete("status");
        }

        if (newApplicationId) {
          next.set("applicationId", newApplicationId);
        } else {
          next.delete("applicationId");
        }

        return next;
      }, { replace: true });
    },
    [setSearchParams]
  );

  useEffect(() => {
    setSelectedCompanyId(companyIdParam);
    setSelectedStatus(statusParam);
  }, [companyIdParam, statusParam]);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingFilters(true);

    const fetchFilterOptions = async () => {
      try {
        const res = await UserAPI.getAppliedJobFilterOptions(companyIdParam);
        if (cancelled) return;

        const payload = res?.data || {};
        const companies = Array.isArray(payload.companies) ? payload.companies : [];
        const stages = Array.isArray(payload.stages) ? payload.stages : [];

        setCompanyOptions([
          { value: "", label: "Tất cả công ty" },
          ...companies.map((company) => ({
            value: company.companyId,
            label: company.companyName,
          })),
        ]);

        const nextStageOptions = [
          { value: "", label: "Tất cả trạng thái" },
          ...stages.map((stage) => ({
            value: stage.stage,
            label: stage.label,
          })),
        ];
        setStageOptions(nextStageOptions);

        if (statusParam && !nextStageOptions.some((option) => option.value === statusParam)) {
          setSelectedStatus("");
          updateSearchParams(companyIdParam || null, null, applicationIdParam);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingFilters(false);
        }
      }
    };

    fetchFilterOptions();

    return () => {
      cancelled = true;
    };
  }, [companyIdParam, statusParam, applicationIdParam, updateSearchParams]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const fetchAppliedJob = async () => {
      try {
        const res = await UserAPI.getAppliedJobs(statusParam, companyIdParam);
        if (!cancelled) {
          setItems(res?.data || []);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchAppliedJob();

    return () => {
      cancelled = true;
    };
  }, [companyIdParam, statusParam, refreshTsParam]);

  useEffect(() => {
    if (!applicationIdParam || !items || items.length === 0) {
      return;
    }

    const matched = items.find((job) => String(job.applicationId) === applicationIdParam);
    if (!matched) {
      return;
    }

    setHighlightedId(applicationIdParam);

    requestAnimationFrame(() => {
      const el = rowRefs.current[applicationIdParam];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    highlightTimerRef.current = setTimeout(() => {
      setHighlightedId(null);
      updateSearchParams(companyIdParam || null, statusParam || null, null);
    }, 4000);

    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
    };
  }, [applicationIdParam, items, companyIdParam, statusParam, updateSearchParams]);

  const handleViewJobDetail = async (jobId) => {
    if (jobId) {
      navigate(`/jobs/${jobId}`);
    }
  };

  const resolveApplicationId = (job) =>
    job?.applicationId || job?.id || job?.application?.id || job?.appliedJobId || null;

  const resolveCompanyId = (job) =>
    job?.companyId || job?.company?.id || job?.companyInfo?.id || null;

  const resolveCompanyIdFromJobDetail = async (job) => {
    const localCompanyId = resolveCompanyId(job);
    if (localCompanyId) {
      return localCompanyId;
    }

    if (!job?.jobId) {
      return null;
    }

    const detail = await JobService.fetchJobDetail(job.jobId);
    return detail?.companyId || null;
  };

  const handleOpenChat = async (job) => {
    if (!job?.jobId) {
      toast.error("Không thể mở chat cho công việc này.");
      return;
    }

    setOpeningChatJobId(job.jobId);

    try {
      const applicationId = resolveApplicationId(job);
      const companyId = await resolveCompanyIdFromJobDetail(job);

      if (!applicationId && !companyId) {
        toast.error("Thiếu thông tin ứng tuyển để mở cuộc trò chuyện.");
        return;
      }

      const thread = await messagingApi.getOrCreateThread({
        applicationId: applicationId || undefined,
        companyId: companyId || undefined,
      });

      if (!thread?.threadId) {
        toast.error("Không thể mở cuộc trò chuyện lúc này.");
        return;
      }

      navigate(`/messages?thread=${thread.threadId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể mở chat với HR.";
      toast.error(message);
    } finally {
      setOpeningChatJobId(null);
    }
  };

  const handleCompanyFilter = (companyId) => {
    setSelectedCompanyId(companyId);
    setSelectedStatus("");
    updateSearchParams(companyId || null, null, applicationIdParam);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    updateSearchParams(companyIdParam || null, status || null, applicationIdParam);
  };

  return (
    <div className="mx-6 w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Việc làm đã ứng tuyển</h2>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="mr-1 whitespace-nowrap">Công ty:</span>
            <Select
              value={selectedCompanyId}
              onChange={handleCompanyFilter}
              placeholder="Chọn công ty"
              options={companyOptions}
              className="min-w-[240px]"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="mr-1 whitespace-nowrap">Bộ lọc:</span>
            <Select
              value={selectedStatus}
              onChange={handleStatusFilter}
              placeholder="Chọn trạng thái"
              options={stageOptions}
              className="min-w-[240px]"
            />
          </div>
        </div>
      </div>

      {isLoading || isLoadingFilters ? (
        <div className="mx-6 w-full max-w-6xl p-8">
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            <div className="text-center">
              <p className="text-base font-medium text-slate-800">
                Đang tải danh sách việc đã ứng tuyển...
              </p>
              <p className="mt-1 text-sm text-slate-500">Vui lòng đợi trong giây lát.</p>
            </div>
          </div>
        </div>
      ) : items?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="mb-6 text-2xl font-bold text-slate-950">
            Bạn chưa có việc làm đã ứng tuyển
          </p>
          <img
            src={aiFeatureLogin}
            alt="No applied jobs"
            className="h-auto w-[260px] opacity-90"
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-sm text-slate-500">
                <th className="px-4 py-3">Tên việc làm</th>
                <th className="px-4 py-3">CV ứng tuyển</th>
                <th className="px-4 py-3">Ngày nộp</th>
                <th className="px-4 py-3">Hạn nộp</th>
                <th className="px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((job) => (
                <tr
                  key={job.applicationId || job.jobId}
                  ref={(el) => {
                    if (el && job.applicationId) rowRefs.current[job.applicationId] = el;
                  }}
                  className={`rounded-xl transition-colors duration-700 ${
                    highlightedId && highlightedId === job.applicationId
                      ? "bg-violet-100 ring-2 ring-inset ring-violet-400"
                      : "bg-slate-50/70"
                  }`}
                >
                  <td className="px-4 py-4 align-top hover:cursor-pointer">
                    <div
                      className="font-medium text-slate-800"
                      onClick={() => handleViewJobDetail(job.jobId)}
                    >
                      {job.jobName}
                    </div>
                    <div className="mt-1 line-clamp-2 text-sm text-slate-500">{job.companyName}</div>

                    <button
                      type="button"
                      onClick={() => {
                        void handleOpenChat(job);
                      }}
                      disabled={openingChatJobId === job.jobId}
                      className="mt-3 inline-flex h-11 items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <MessageCircle size={16} />
                      {openingChatJobId === job.jobId ? "Đang mở chat..." : "Nhắn tin với HR"}
                    </button>
                  </td>

                  <td className="px-4 py-4 align-top">
                    {job.linkResume ? (
                      <a
                        href={job.linkResume}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 text-sm font-medium text-violet-700 transition hover:border-violet-300 hover:bg-violet-50"
                        title={job.linkResume}
                      >
                        <FileText size={16} />
                        Xem CV
                        <ExternalLink size={14} className="text-violet-500" />
                      </a>
                    ) : (
                      <span className="inline-flex h-10 items-center rounded-xl bg-slate-100 px-3 text-sm text-slate-500">
                        Chưa có CV
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 align-top text-sm text-slate-700">{fmtDate(job.appliedAt)}</td>
                  <td className="px-4 py-4 align-top text-sm text-slate-700">{fmtDate(job.deadline)}</td>

                  <td className="px-4 py-4 align-top">
                    <StatusBadge value={job.status} label={job.statusLabel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
