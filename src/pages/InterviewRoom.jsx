import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { InterviewAPI } from "~/services/api/interview";
import { useWebRTC } from "~/hooks/useWebRTC";
import { getToken } from "~/utils/storage";

const EARLY_JOIN_MINUTES = 15;

const fmtElapsed = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export default function InterviewRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

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
  const [canJoin, setCanJoin] = useState(false);
  const [countdown, setCountdown] = useState("");

  // Fetch interview info by room code
  useEffect(() => {
    if (!roomCode) return;
    setLoading(true);
    InterviewAPI.getByRoomCode(roomCode)
      .then((resp) => {
        setInterview(resp?.data ?? null);
      })
      .catch(() => {
        toast.error("Không tìm thấy phòng phỏng vấn");
      })
      .finally(() => setLoading(false));
  }, [roomCode]);

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
  const { remoteStream, connected, peerCount, replaceTrack, admissionStatus, isBeingRecorded, cancelJoin } = useWebRTC({
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

  // Timer
  useEffect(() => {
    if (!joined) return;
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [joined]);

  // Handle rejected / kicked
  useEffect(() => {
    if (admissionStatus === "rejected") {
      toast.error("HR đã từ chối yêu cầu tham gia của bạn");
      localStream?.getTracks().forEach((t) => t.stop());
      setTimeout(() => navigate(-1), 3000);
    }
    if (admissionStatus === "kicked") {
      toast.error("Bạn đã bị mời rời khỏi phòng phỏng vấn");
      localStream?.getTracks().forEach((t) => t.stop());
      setTimeout(() => navigate("/interviews"), 3000);
    }
  }, [admissionStatus]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      cameraTrackRef.current = stream.getVideoTracks()[0] ?? null;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch {
      toast.error("Không thể truy cập camera/microphone");
    }
  };

  const handleJoin = async () => {
    if (!localStream || localStream.getTracks().every(t => t.readyState === "ended")) {
      await startCamera();
    }
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
    if (localStream) {
      localStream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
      setCameraOn((v) => !v);
    }
  };

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
      setMicOn((v) => !v);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép link phòng phỏng vấn");
  };

  const toggleScreenShare = async () => {
    if (screenSharing) {
      if (cameraTrackRef.current && localStream) {
        localStream.getVideoTracks().forEach((t) => t.stop());
        localStream.removeTrack(localStream.getVideoTracks()[0]);
        localStream.addTrack(cameraTrackRef.current);
        replaceTrack(cameraTrackRef.current, "video");
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
        }

        screenTrack.onended = () => {
          if (cameraTrackRef.current && localStream) {
            localStream.removeTrack(screenTrack);
            localStream.addTrack(cameraTrackRef.current);
            replaceTrack(cameraTrackRef.current, "video");
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-gray-600 border-t-white" />
          <p className="text-gray-400 text-sm">Đang tải thông tin phòng phỏng vấn...</p>
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
              className="h-full w-full object-cover"
            />
            {!localStream && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-700">
                  <Video className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            {!localStream ? (
              <button
                onClick={startCamera}
                className="flex items-center gap-2 rounded-xl border border-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-800"
              >
                <Video className="h-4 w-4" /> Bật camera để kiểm tra
              </button>
            ) : (
              <>
                <button
                  onClick={toggleCamera}
                  className={`rounded-full p-3 ${
                    cameraOn ? "border border-gray-600 text-white hover:bg-gray-800" : "bg-red-600 text-white"
                  }`}
                >
                  {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={toggleMic}
                  className={`rounded-full p-3 ${
                    micOn ? "border border-gray-600 text-white hover:bg-gray-800" : "bg-red-600 text-white"
                  }`}
                >
                  {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </button>
              </>
            )}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleJoin}
              className="rounded-xl bg-green-600 px-8 py-2.5 text-sm font-medium text-white hover:bg-green-700"
            >
              Tham gia phỏng vấn
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
  if (joined && admissionStatus !== "admitted" && admissionStatus !== "kicked" && admissionStatus !== "rejected") {
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
              className="h-full w-full object-cover"
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
  if (admissionStatus === "kicked") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
        <div className="w-full max-w-md space-y-6 px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Đã bị mời rời phòng</h1>
          <p className="text-sm text-gray-400">Bạn đã bị mời rời khỏi phòng phỏng vấn.</p>
          <p className="text-xs text-gray-500">Tự động quay lại...</p>
        </div>
      </div>
    );
  }

  // In-call UI
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950">
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
              className="h-full w-full object-cover"
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
                className="h-full w-full object-cover"
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
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            cameraOn ? "border border-gray-600 text-white hover:bg-gray-800" : "bg-red-600 text-white"
          }`}
        >
          {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>
        <button
          onClick={toggleMic}
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            micOn ? "border border-gray-600 text-white hover:bg-gray-800" : "bg-red-600 text-white"
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
