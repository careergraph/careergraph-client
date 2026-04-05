import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  MonitorOff,
  Clock,
  Copy,
  AlertCircle,
  SearchX,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { InterviewAPI } from "~/services/api/interview";
import { useWebRTC } from "~/hooks/useWebRTC";
import { getToken } from "~/utils/storage";
import { useUserStore } from "~/stores/userStore";

const EARLY_JOIN_MINUTES = 15;

const fmtElapsed = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export default function InterviewRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const candidateId = useUserStore((state) => state.user?.candidateId);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [joined, setJoined] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const cameraTrackRef = useRef(null);

  // Interview info & early join state
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomCheckError, setRoomCheckError] = useState(null);
  const [canJoin, setCanJoin] = useState(false);
  const [countdown, setCountdown] = useState("");

  const checkRoomAvailability = useCallback(async () => {
    if (!roomCode) {
      setRoomCheckError({
        type: "not-found",
        title: "Mã phòng không hợp lệ",
        description: "Liên kết phòng phỏng vấn không đúng hoặc đã bị thay đổi.",
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    setRoomCheckError(null);

    try {
      const [resp, myResp] = await Promise.all([
        InterviewAPI.getByRoomCode(roomCode),
        InterviewAPI.getMyInterviews(),
      ]);

      const roomInterview = resp?.data ?? null;
      const myInterviews = Array.isArray(myResp?.data) ? myResp.data : [];

      const priority = {
        IN_PROGRESS: 1,
        CONFIRMED: 2,
        SCHEDULED: 3,
        PENDING_RESCHEDULE: 4,
        COMPLETED: 5,
        CANCELLED: 6,
        NO_SHOW: 7,
      };

      const ownInterviewInRoom = myInterviews
        .filter((iv) => iv?.meetingLink === roomCode)
        .filter((iv) => !candidateId || iv?.candidateId === candidateId)
        .sort((a, b) => {
          const pa = priority[a?.interviewStatus] ?? 99;
          const pb = priority[b?.interviewStatus] ?? 99;
          if (pa !== pb) return pa - pb;
          return new Date(b?.scheduledAt || 0).getTime() - new Date(a?.scheduledAt || 0).getTime();
        })[0] ?? null;

      if (!roomInterview) {
        setRoomCheckError({
          type: "not-found",
          title: "Không tìm thấy phòng phỏng vấn",
          description: "Phòng có thể đã bị đóng, hết hạn hoặc mã phòng không còn tồn tại.",
        });
        return;
      }

      if (!ownInterviewInRoom) {
        setRoomCheckError({
          type: "unavailable",
          title: "Bạn không có lịch trong phòng này",
          description: "Phòng tồn tại nhưng không có lịch phỏng vấn hợp lệ dành cho bạn.",
        });
        return;
      }

      setInterview(ownInterviewInRoom);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404) {
        setRoomCheckError({
          type: "not-found",
          title: "Không tìm thấy phòng phỏng vấn",
          description: "Phòng có thể đã bị đóng, hết hạn hoặc mã phòng không còn tồn tại.",
        });
        return;
      }

      setRoomCheckError({
        type: "unavailable",
        title: "Không thể kết nối tới phòng",
        description:
          "Hệ thống đang bận hoặc kết nối mạng không ổn định. Vui lòng thử lại sau vài giây.",
      });
    } finally {
      setLoading(false);
    }
  }, [roomCode, candidateId]);

  // Fetch interview info by room code
  useEffect(() => {
    checkRoomAvailability();
  }, [checkRoomAvailability]);

  // Check if user can join (15 min before scheduled)
  useEffect(() => {
    if (!interview?.scheduledAt) return;

    const checkAccess = () => {
      const scheduled = new Date(interview.scheduledAt).getTime();
      const earlyJoinTime = scheduled - EARLY_JOIN_MINUTES * 60 * 1000;
      const now = Date.now();

      if (now >= earlyJoinTime) {
        setCanJoin(true);
        setCountdown("");
      } else {
        setCanJoin(false);
        const diff = earlyJoinTime - now;
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setCountdown(
          `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
        );
      }
    };

    checkAccess();
    const interval = setInterval(checkAccess, 1000);
    return () => clearInterval(interval);
  }, [interview]);

  // WebRTC peer connection
  const { remoteStream, connected, peerCount, replaceTrack, admissionStatus, isBeingRecorded, cancelJoin, roomClosingGrace, emitMediaStateChanged } = useWebRTC({
    roomCode: joined && roomCode ? roomCode : "",
    token: getToken() ?? "",
    localStream: localStream,
  });

  // Attach remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Re-bind local stream whenever the local video element is remounted (e.g. lobby -> in-call).
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, joined, admissionStatus]);

  // Timer
  useEffect(() => {
    if (!joined) return;
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [joined]);

  // Handle rejected / kicked / room-ended
  useEffect(() => {
    if (admissionStatus === "rejected") {
      toast.error("HR đã từ chối yêu cầu tham gia của bạn");
      localStream?.getTracks().forEach((t) => t.stop());
      setTimeout(() => navigate(-1), 3000);
    }
    if (admissionStatus === "kicked" || admissionStatus === "kicked-permanent") {
      toast.error(
        admissionStatus === "kicked-permanent"
          ? "Bạn đã bị mời rời phòng vĩnh viễn"
          : "Bạn đã bị mời rời khỏi phòng phỏng vấn"
      );
      // Persist kicked status so the interviews list page can show it
      if (interview?.id) {
        try {
          localStorage.setItem(
            `interview-kicked:${interview.id}`,
            admissionStatus
          );
        } catch { /* quota exceeded — ignore */ }
      }
      localStream?.getTracks().forEach((t) => t.stop());
      setTimeout(() => navigate("/interviews"), 3000);
    }
    if (admissionStatus === "room-ended") {
      toast.info("Phòng phỏng vấn đã kết thúc");
      localStream?.getTracks().forEach((t) => t.stop());
      setTimeout(() => navigate("/interviews"), 3000);
    }
  }, [admissionStatus, localStream, navigate, interview]);

  // Sync camera/mic toggle when host disables our media
  useEffect(() => {
    if (!localStream) return;
    const videoEnabled = localStream.getVideoTracks().some((t) => t.enabled);
    const audioEnabled = localStream.getAudioTracks().some((t) => t.enabled);
    setCameraOn(videoEnabled);
    setMicOn(audioEnabled);
  }, [localStream]);

  // ── Media device detection & initialization ──────────
  const [hasCamera, setHasCamera] = useState(null);
  const [hasMic, setHasMic] = useState(null);
  const [mediaError, setMediaError] = useState(null);

  const initMedia = async () => {
    setMediaError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Trình duyệt không hỗ trợ truy cập thiết bị media");
      setMediaError("unsupported");
      return "error";
    }

    // Step 1: Detect which device types are available
    let devices = [];
    try {
      devices = await navigator.mediaDevices.enumerateDevices();
    } catch {
      // enumerateDevices failed — try getUserMedia directly below
    }

    const videoInputs = devices.filter((d) => d.kind === "videoinput");
    const audioInputs = devices.filter((d) => d.kind === "audioinput");
    const wantVideo = videoInputs.length > 0;
    const wantAudio = audioInputs.length > 0;

    setHasCamera(wantVideo);
    setHasMic(wantAudio);

    // No media devices at all → view-only mode, allow join
    if (!wantVideo && !wantAudio) {
      setCameraOn(false);
      setMicOn(false);
      return "no-devices";
    }

    // Step 2: Request only the devices that exist
    localStream?.getTracks().forEach((t) => t.stop());

    let stream = null;

    if (wantVideo && wantAudio) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch {
        stream = null;
      }
    }

    if (!stream || stream.getTracks().length === 0) {
      let videoStream = null;
      let audioStream = null;
      let videoError = null;
      let audioError = null;

      if (wantVideo) {
        try {
          videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } catch (e) {
          videoError = e;
        }
      }

      if (wantAudio) {
        try {
          audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        } catch (e) {
          audioError = e;
        }
      }

      const blockingErrors = [videoError, audioError].filter(Boolean);
      const permissionDenied = blockingErrors.filter((e) => e.name === "NotAllowedError");
      const deviceBusy = blockingErrors.filter((e) => e.name === "NotReadableError" || e.name === "AbortError");

      if (permissionDenied.length > 0 && !videoStream && !audioStream) {
        toast.error("Bạn đã chặn quyền truy cập camera/microphone.\nHãy mở Cài đặt trình duyệt → Quyền riêng tư → Cho phép camera/microphone cho trang này, sau đó tải lại trang.", { duration: 8000 });
        setMediaError("permission-denied");
        return "error";
      }

      if (deviceBusy.length > 0 && !videoStream && !audioStream) {
        toast.error("Thiết bị camera/microphone đang được sử dụng bởi ứng dụng khác.\nHãy đóng ứng dụng đó và thử lại.", { duration: 8000 });
        setMediaError("device-busy");
        return "error";
      }

      const tracks = [
        ...(videoStream?.getVideoTracks() ?? []),
        ...(audioStream?.getAudioTracks() ?? []),
      ];

      if (tracks.length > 0) {
        stream = new MediaStream(tracks);
      }

      if (wantVideo && !videoStream && audioStream) {
        const reason = videoError?.name === "NotAllowedError" ? " (quyền bị chặn)" : "";
        toast.warning(`Không thể truy cập camera${reason}. Bạn sẽ tham gia chỉ với microphone.`);
        setHasCamera(false);
      }
      if (wantAudio && !audioStream && videoStream) {
        const reason = audioError?.name === "NotAllowedError" ? " (quyền bị chặn)" : "";
        toast.warning(`Không thể truy cập microphone${reason}. Bạn sẽ tham gia chỉ với camera.`);
        setHasMic(false);
      }
    }

    if (stream && stream.getTracks().length > 0) {
      setLocalStream(stream);
      cameraTrackRef.current = stream.getVideoTracks()[0] ?? null;
      setCameraOn(stream.getVideoTracks().some((t) => t.enabled));
      setMicOn(stream.getAudioTracks().some((t) => t.enabled));
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return "ok";
    }

    setCameraOn(false);
    setMicOn(false);
    setHasCamera(false);
    setHasMic(false);
    return "no-devices";
  };

  const handleJoin = async () => {
    if (localStream?.getTracks().some((t) => t.readyState === "live")) {
      setJoined(true);
      return;
    }

    const result = await initMedia();
    if (result === "error") return;
    setJoined(true);
  };

  const handleLeave = () => {
    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setJoined(false);
    setScreenSharing(false);
    navigate("/interviews");
  };

  const toggleCamera = () => {
    if (!localStream) return;
    const videoTracks = localStream.getVideoTracks();
    if (videoTracks.length === 0) return;
    const newState = !videoTracks[0].enabled;
    videoTracks.forEach((t) => (t.enabled = newState));
    setCameraOn(newState);
    emitMediaStateChanged({ camera: newState });
  };

  const toggleMic = () => {
    if (!localStream) return;
    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length === 0) return;
    const newState = !audioTracks[0].enabled;
    audioTracks.forEach((t) => (t.enabled = newState));
    setMicOn(newState);
    emitMediaStateChanged({ mic: newState });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép link phòng phỏng vấn");
  };

  const toggleScreenShare = async () => {
    if (screenSharing) {
      if (localStream) {
        const screenTrack = localStream.getVideoTracks()[0];
        if (screenTrack) {
          screenTrack.stop();
          localStream.removeTrack(screenTrack);
        }
        if (cameraTrackRef.current) {
          localStream.addTrack(cameraTrackRef.current);
          replaceTrack(cameraTrackRef.current, "video");
        }
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      }
      setScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        if (localStream) {
          const oldVideo = localStream.getVideoTracks()[0];
          if (oldVideo) localStream.removeTrack(oldVideo);
          localStream.addTrack(screenTrack);
          replaceTrack(screenTrack, "video");
          if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
        } else {
          const newStream = new MediaStream([screenTrack]);
          setLocalStream(newStream);
          if (localVideoRef.current) localVideoRef.current.srcObject = newStream;
        }

        screenTrack.onended = () => {
          if (localStream) {
            localStream.removeTrack(screenTrack);
            if (cameraTrackRef.current) {
              localStream.addTrack(cameraTrackRef.current);
              replaceTrack(cameraTrackRef.current, "video");
            }
            if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
          }
          setScreenSharing(false);
        };

        setScreenSharing(true);
      } catch {
        // User cancelled screen share picker
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_top,#172554_0%,#020617_55%,#000000_100%)] px-4">
        <div className="w-full max-w-lg rounded-3xl border border-blue-900/60 bg-slate-950/80 p-8 text-center shadow-2xl shadow-blue-950/50 backdrop-blur">
          <div className="mx-auto mb-5 h-11 w-11 animate-spin rounded-full border-2 border-blue-300/20 border-t-blue-300" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300/80">Room Access Check</p>
          <h1 className="mt-2 text-xl font-bold text-white">Đang kiểm tra phòng phỏng vấn</h1>
          <p className="mt-3 text-sm text-blue-100/70">
            Hệ thống đang xác minh mã phòng trước khi cho phép bạn tham gia.
          </p>
          {roomCode && (
            <p className="mt-4 text-xs font-mono text-blue-200/70">Mã phòng: {roomCode}</p>
          )}
        </div>
      </div>
    );
  }

  if (roomCheckError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_top,#3f1d2e_0%,#111827_48%,#020617_100%)] px-4">
        <div className="w-full max-w-xl rounded-3xl border border-rose-300/20 bg-slate-950/90 p-8 shadow-2xl shadow-black/60">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-200">
            {roomCheckError.type === "not-found" ? <SearchX className="h-7 w-7" /> : <AlertCircle className="h-7 w-7" />}
          </div>
          <h1 className="mt-5 text-center text-2xl font-bold text-white">{roomCheckError.title}</h1>
          <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-rose-100/80">
            {roomCheckError.description}
          </p>
          {roomCode && (
            <p className="mt-4 text-center text-xs font-mono text-rose-200/70">Mã phòng: {roomCode}</p>
          )}
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={checkRoomAvailability}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-500"
            >
              <RotateCcw className="h-4 w-4" /> Thử lại
            </button>
            <button
              onClick={() => navigate("/interviews")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" /> Quay về lịch phỏng vấn
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Interview already completed — block re-access
  if (interview?.interviewStatus === "COMPLETED") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
        <div className="w-full max-w-md space-y-6 px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <AlertCircle className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Phỏng vấn đã kết thúc</h1>
          <p className="text-sm text-gray-400">
            Cuộc phỏng vấn này đã hoàn thành và không thể truy cập lại.
          </p>
          <button
            onClick={() => navigate("/interviews")}
            className="rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:text-white"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Too early to join
  if (!canJoin && interview) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
        <div className="w-full max-w-md space-y-6 px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
            <AlertCircle className="h-8 w-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Chưa đến giờ phỏng vấn</h1>
            <p className="mt-2 text-sm text-gray-400">
              Bạn có thể vào phòng trước {EARLY_JOIN_MINUTES} phút so với giờ hẹn
            </p>
          </div>
          <div className="rounded-2xl bg-gray-800/80 p-4 space-y-2">
            <p className="text-sm text-gray-400">Lịch phỏng vấn</p>
            <p className="text-lg font-semibold text-white">
              {new Date(interview.scheduledAt).toLocaleString("vi-VN")}
            </p>
            {interview.jobTitle && (
              <p className="text-sm text-gray-400">
                Vị trí: <span className="text-gray-300">{interview.jobTitle}</span>
              </p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Có thể vào sau</p>
            <p className="text-3xl font-mono font-bold text-white">{countdown}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:text-white"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Pre-join lobby
  if (!joined) {
    const noCamera = hasCamera === false;
    const noMic = hasMic === false;
    const noDevices = noCamera && noMic;
    const hasStream = localStream && localStream.getTracks().some((t) => t.readyState === "live");

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
        <div className="w-full max-w-2xl space-y-6 px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Phòng phỏng vấn</h1>
            <p className="mt-1 text-xs text-gray-500 font-mono">{roomCode}</p>
            {interview && (
              <p className="mt-2 text-sm text-gray-400">
                {interview.jobTitle} — {new Date(interview.scheduledAt).toLocaleString("vi-VN")}
              </p>
            )}
          </div>

          <div className="relative mx-auto aspect-video max-w-md overflow-hidden rounded-2xl bg-gray-800">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full bg-black object-contain"
            />
            {!hasStream && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-700">
                  {noDevices ? (
                    <VideoOff className="h-8 w-8 text-gray-500" />
                  ) : (
                    <Video className="h-8 w-8 text-gray-400" />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Device status indicators */}
          {hasCamera !== null && (
            <div className="flex items-center justify-center gap-4 text-xs">
              <span className={`flex items-center gap-1 ${hasCamera ? "text-green-400" : "text-gray-500"}`}>
                {hasCamera ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
                {hasCamera ? "Camera sẵn sàng" : "Không có camera"}
              </span>
              <span className={`flex items-center gap-1 ${hasMic ? "text-green-400" : "text-gray-500"}`}>
                {hasMic ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
                {hasMic ? "Microphone sẵn sàng" : "Không có microphone"}
              </span>
            </div>
          )}

          {/* Media error message */}
          {mediaError && (
            <div className="mx-auto max-w-md rounded-xl bg-red-900/30 border border-red-800/50 px-4 py-3 text-center">
              <p className="text-sm text-red-300">
                {mediaError === "permission-denied" && "Quyền camera/microphone bị chặn. Hãy cho phép trong cài đặt trình duyệt rồi tải lại trang."}
                {mediaError === "device-busy" && "Thiết bị đang bị ứng dụng khác chiếm dụng. Hãy đóng ứng dụng đó và thử lại."}
                {mediaError === "unsupported" && "Trình duyệt không hỗ trợ truy cập thiết bị media."}
              </p>
            </div>
          )}

          {/* No-devices info banner */}
          {noDevices && hasCamera !== null && !mediaError && (
            <div className="mx-auto max-w-md rounded-xl bg-gray-800/80 border border-gray-700 px-4 py-3 text-center">
              <p className="text-sm text-gray-300">
                Không phát hiện camera và microphone. Bạn vẫn có thể tham gia ở chế độ xem.
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            {hasCamera === null ? (
              <button
                onClick={initMedia}
                className="flex items-center gap-2 rounded-xl border border-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-800"
              >
                <Video className="h-4 w-4" /> Kiểm tra thiết bị
              </button>
            ) : hasStream ? (
              <>
                <button
                  onClick={toggleCamera}
                  disabled={noCamera}
                  className={`rounded-full p-3 ${
                    noCamera ? "border border-gray-700 text-gray-600 cursor-not-allowed" :
                    cameraOn ? "border border-gray-600 text-white hover:bg-gray-800" : "bg-red-600 text-white"
                  }`}
                >
                  {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={toggleMic}
                  disabled={noMic}
                  className={`rounded-full p-3 ${
                    noMic ? "border border-gray-700 text-gray-600 cursor-not-allowed" :
                    micOn ? "border border-gray-600 text-white hover:bg-gray-800" : "bg-red-600 text-white"
                  }`}
                >
                  {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </button>
              </>
            ) : null}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleJoin}
              disabled={!!mediaError}
              className={`rounded-xl px-8 py-2.5 text-sm font-medium text-white ${
                mediaError ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {noDevices ? "Tham gia (chế độ xem)" : "Tham gia phỏng vấn"}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:text-white"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Waiting for HR approval
  if (joined && admissionStatus !== "admitted" && admissionStatus !== "kicked" && admissionStatus !== "kicked-permanent" && admissionStatus !== "rejected" && admissionStatus !== "room-ended") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
        <div className="w-full max-w-md space-y-6 px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Đang chờ phê duyệt</h1>
            <p className="mt-2 text-sm text-gray-400">
              {admissionStatus === "no-host"
                ? "HR chưa vào phòng. Vui lòng chờ..."
                : "Yêu cầu tham gia đã được gửi. Vui lòng chờ HR cho phép..."}
            </p>
          </div>
          <div className="relative mx-auto aspect-video max-w-xs overflow-hidden rounded-2xl bg-gray-800">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full bg-black object-contain"
            />
          </div>
          <button
            onClick={() => {
              cancelJoin();
              localStream?.getTracks().forEach((t) => t.stop());
              setLocalStream(null);
              setJoined(false);
            }}
            className="rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:text-white"
          >
            Hủy
          </button>
        </div>
      </div>
    );
  }

  // Rejected screen
  if (admissionStatus === "rejected") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
        <div className="w-full max-w-md space-y-6 px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Yêu cầu bị từ chối</h1>
          <p className="text-sm text-gray-400">HR đã từ chối yêu cầu tham gia của bạn.</p>
          <p className="text-xs text-gray-500">Tự động quay lại...</p>
        </div>
      </div>
    );
  }

  // Kicked screen
  if (admissionStatus === "kicked" || admissionStatus === "kicked-permanent") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
        <div className="w-full max-w-md space-y-6 px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Đã bị mời rời phòng</h1>
          <p className="text-sm text-gray-400">
            {admissionStatus === "kicked-permanent"
              ? "Bạn đã bị mời rời khỏi phòng phỏng vấn vĩnh viễn."
              : "Bạn đã bị mời rời khỏi phòng phỏng vấn."}
          </p>
          <p className="text-xs text-gray-500">Tự động quay lại...</p>
        </div>
      </div>
    );
  }

  // Room ended screen
  if (admissionStatus === "room-ended") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
        <div className="w-full max-w-md space-y-6 px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-500/20">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Phòng đã kết thúc</h1>
          <p className="text-sm text-gray-400">Phòng phỏng vấn đã được đóng bởi HR.</p>
          <p className="text-xs text-gray-500">Tự động quay lại...</p>
        </div>
      </div>
    );
  }

  // In-call UI
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950">
      {/* Room closing banner */}
      {roomClosingGrace && (
        <div className="flex items-center justify-center gap-2 bg-orange-600/90 px-4 py-2 text-sm text-white">
          <AlertCircle className="h-4 w-4" />
          Phòng phỏng vấn sắp đóng. Bạn có 5 phút để hoàn thành.
        </div>
      )}
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
        <div className="flex items-center gap-3">
          {isBeingRecorded && (
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white animate-pulse">
              REC
            </span>
          )}
          <span className="flex items-center gap-1.5 text-sm text-gray-300">
            <Clock className="h-3.5 w-3.5" />
            {fmtElapsed(elapsed)}
          </span>
        </div>
        <p className="text-sm font-medium text-white">Phòng phỏng vấn</p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-400 hover:text-white"
          >
            <Copy className="h-3.5 w-3.5" /> Sao chép link
          </button>
          <span className="rounded-full border border-gray-600 px-2 py-0.5 text-xs text-gray-300">
            {peerCount + 1} người
          </span>
          {connected && (
            <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs text-white">Đã kết nối</span>
          )}
        </div>
      </div>

      {/* Video grid */}
      <div className="flex-1 p-4">
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
          {/* Local video */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-800">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full bg-black object-contain"
            />
            {!cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-700 text-2xl font-bold text-white">
                  Tôi
                </div>
              </div>
            )}
            <div className="absolute bottom-3 left-3">
              <span className="rounded-full bg-gray-900/70 px-2.5 py-1 text-xs text-white">
                Bạn
              </span>
            </div>
            {!micOn && (
              <div className="absolute bottom-3 right-3">
                <MicOff className="h-4 w-4 text-red-400" />
              </div>
            )}
          </div>

          {/* Remote video */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-800">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="h-full w-full bg-black object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-700 text-2xl font-bold text-white mb-3">
                    HR
                  </div>
                  <p className="text-sm text-gray-400">Đang chờ HR tham gia...</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-3 left-3">
              <span className="rounded-full bg-gray-900/70 px-2.5 py-1 text-xs text-white">
                Người phỏng vấn
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-center gap-3 border-t border-gray-800 px-4 py-4">
        <button
          onClick={toggleCamera}
          disabled={!localStream || localStream.getVideoTracks().length === 0}
          title={!localStream || localStream.getVideoTracks().length === 0 ? "Không có camera" : undefined}
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            !localStream || localStream.getVideoTracks().length === 0
              ? "border border-gray-700 text-gray-600 cursor-not-allowed"
              : cameraOn ? "border border-gray-600 text-white hover:bg-gray-800" : "bg-red-600 text-white"
          }`}
        >
          {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>
        <button
          onClick={toggleMic}
          disabled={!localStream || localStream.getAudioTracks().length === 0}
          title={!localStream || localStream.getAudioTracks().length === 0 ? "Không có microphone" : undefined}
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            !localStream || localStream.getAudioTracks().length === 0
              ? "border border-gray-700 text-gray-600 cursor-not-allowed"
              : micOn ? "border border-gray-600 text-white hover:bg-gray-800" : "bg-red-600 text-white"
          }`}
        >
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>
        <button
          onClick={toggleScreenShare}
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            screenSharing ? "bg-red-600 text-white" : "border border-gray-600 text-white hover:bg-gray-800"
          }`}
        >
          {screenSharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
        </button>
        <button
          onClick={handleLeave}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
        >
          <PhoneOff className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
