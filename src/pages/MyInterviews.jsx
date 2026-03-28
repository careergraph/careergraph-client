// src/pages/MyInterviews.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Video, MapPin, Calendar, Clock, CheckCircle, XCircle, CalendarPlus, Plus, Trash2, ExternalLink } from "lucide-react";
import { createPortal } from "react-dom";
import { useInterviewStore } from "~/stores/interviewStore";
import { toast } from "sonner";
import noDataImg from "~/assets/icons/ai-feature.svg";

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const statusMap = {
  SCHEDULED: { label: "Đã lên lịch", cls: "bg-blue-100 text-blue-700" },
  CONFIRMED: { label: "Đã xác nhận", cls: "bg-emerald-100 text-emerald-700" },
  PENDING_RESCHEDULE: { label: "Chờ xác nhận lại", cls: "bg-purple-100 text-purple-700" },
  IN_PROGRESS: { label: "Đang diễn ra", cls: "bg-amber-100 text-amber-700" },
  COMPLETED: { label: "Hoàn thành", cls: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Đã hủy", cls: "bg-red-100 text-red-700" },
  NO_SHOW: { label: "Vắng mặt", cls: "bg-gray-100 text-gray-600" },
};

function StatusBadge({ value }) {
  const s = statusMap[value] || { label: value, cls: "bg-slate-100 text-slate-600" };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

function FilterSelect({ value, onChange, options }) {
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
    const handleClick = (e) => {
      if (!btnRef.current?.contains(e.target) && !dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((s) => !s)}
        type="button"
        className="flex h-10 min-w-[200px] items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 hover:bg-slate-50"
      >
        <span className={current ? "" : "text-slate-400"}>
          {current ? current.label : "Chọn"}
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
            className="rounded-xl border border-slate-200 bg-white shadow-lg"
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((o) => (
                <button
                  key={o.value}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-violet-100 ${
                    o.value === value ? "bg-violet-100 text-violet-700 font-medium" : "text-slate-700"
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

function DeclineModal({ open, onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Từ chối phỏng vấn</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Lý do từ chối (không bắt buộc)"
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400 outline-none"
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onConfirm(reason);
              setReason("");
            }}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function ProposeTimeModal({ open, onClose, onSubmit }) {
  const [slots, setSlots] = useState([{ date: "", startTime: "" }]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addSlot = () => setSlots((prev) => [...prev, { date: "", startTime: "" }]);
  const removeSlot = (idx) => setSlots((prev) => prev.filter((_, i) => i !== idx));
  const updateSlot = (idx, field, value) =>
    setSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));

  const handleSubmit = async () => {
    const validSlots = slots.filter((s) => s.date && s.startTime);
    if (validSlots.length === 0) {
      toast.error("Vui lòng chọn ít nhất một khoảng thời gian");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        proposedSlots: validSlots.map((s) => ({
          date: s.date,
          startTime: s.startTime,
        })),
        notes: notes || null,
      });
      setSlots([{ date: "", startTime: "" }]);
      setNotes("");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">
          Đề xuất thời gian khác
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Chọn một hoặc nhiều khoảng thời gian phù hợp với bạn
        </p>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {slots.map((slot, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="date"
                value={slot.date}
                onChange={(e) => updateSlot(idx, "date", e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400 outline-none"
              />
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) => updateSlot(idx, "startTime", e.target.value)}
                className="w-28 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400 outline-none"
              />
              {slots.length > 1 && (
                <button
                  onClick={() => removeSlot(idx)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addSlot}
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          <Plus size={14} /> Thêm khoảng thời gian
        </button>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ghi chú cho HR (không bắt buộc)"
          rows={2}
          className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400 outline-none"
        />

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {submitting ? "Đang gửi..." : "Gửi đề xuất"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function MyInterviews() {
  const { interviews, loading, fetchMyInterviews, confirmInterview, declineInterview, proposeAlternativeTimes } =
    useInterviewStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [declining, setDeclining] = useState(null);
  const [proposing, setProposing] = useState(null);

  useEffect(() => {
    fetchMyInterviews(filter || undefined);
  }, [filter, fetchMyInterviews]);

  const filterOptions = [
    { value: "", label: "Tất cả" },
    { value: "UPCOMING", label: "Sắp tới" },
    { value: "PAST", label: "Đã qua" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  const handleConfirm = async (id) => {
    try {
      await confirmInterview(id);
      toast.success("Đã xác nhận phỏng vấn");
    } catch {
      toast.error("Không thể xác nhận phỏng vấn");
    }
  };

  const handleDecline = async (reason) => {
    try {
      await declineInterview(declining, reason);
      toast.success("Đã từ chối phỏng vấn");
    } catch {
      toast.error("Không thể từ chối phỏng vấn");
    } finally {
      setDeclining(null);
    }
  };

  const handlePropose = async (data) => {
    try {
      await proposeAlternativeTimes(proposing, data);
      toast.success("Đã gửi đề xuất thời gian mới");
      setProposing(null);
      fetchMyInterviews(filter || undefined);
    } catch {
      toast.error("Không thể gửi đề xuất");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-6 rounded-2xl bg-white shadow-sm border border-slate-200 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Lịch phỏng vấn của tôi</h2>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="mr-1">Bộ lọc:</span>
          <FilterSelect value={filter} onChange={setFilter} options={filterOptions} />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-10">
          <div className="h-10 w-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-base font-medium text-slate-800">Đang tải lịch phỏng vấn...</p>
        </div>
      ) : !interviews || interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <p className="text-2xl font-bold text-slate-950 mb-6">Chưa có lịch phỏng vấn nào</p>
          <img src={noDataImg} alt="No interviews" className="w-[260px] h-auto opacity-90" />
        </div>
      ) : (
        <div className="space-y-3">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-900 truncate">
                    {interview.jobTitle}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{interview.companyName}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" />
                      {fmtDate(interview.scheduledAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-400" />
                      {fmtTime(interview.scheduledAt)} – {fmtTime(interview.endAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {interview.type === "ONLINE" ? (
                        <Video size={14} className="text-blue-500" />
                      ) : (
                        <MapPin size={14} className="text-orange-500" />
                      )}
                      {interview.type === "ONLINE" ? "Trực tuyến" : "Trực tiếp"}
                    </span>
                  </div>

                  {interview.interviewerNames?.length > 0 && (
                    <p className="mt-2 text-xs text-slate-500">
                      Người phỏng vấn: {interview.interviewerNames.join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <StatusBadge value={interview.interviewStatus} />

                  {interview.interviewStatus === "SCHEDULED" && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => handleConfirm(interview.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                      >
                        <CheckCircle size={14} /> Xác nhận
                      </button>
                      <button
                        onClick={() => setProposing(interview.id)}
                        className="flex items-center gap-1.5 rounded-lg border border-violet-200 px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-50"
                      >
                        <CalendarPlus size={14} /> Đề xuất thời gian khác
                      </button>
                      <button
                        onClick={() => setDeclining(interview.id)}
                        className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        <XCircle size={14} /> Từ chối
                      </button>
                    </div>
                  )}

                  {interview.interviewStatus === "PENDING_RESCHEDULE" && (
                    <p className="mt-2 text-xs text-purple-600 font-medium">
                      Đã gửi đề xuất — đang chờ HR xác nhận
                    </p>
                  )}

                  {["SCHEDULED", "CONFIRMED"].includes(interview.interviewStatus) && interview.type === "ONLINE" && interview.meetingLink && (
                    <button
                      onClick={() => navigate(`/interview/room/${interview.meetingLink}`)}
                      className="mt-2 flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      <ExternalLink size={14} /> Tham gia phỏng vấn
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeclineModal
        open={!!declining}
        onClose={() => setDeclining(null)}
        onConfirm={handleDecline}
      />

      <ProposeTimeModal
        open={!!proposing}
        onClose={() => setProposing(null)}
        onSubmit={handlePropose}
      />
    </div>
  );
}
