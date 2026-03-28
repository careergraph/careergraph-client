import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const RTC_URL = import.meta.env.VITE_RTC_URL ?? "http://localhost:4000";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

/**
 * @param {{ roomCode: string, token: string, localStream: MediaStream | null }} options
 */
export function useWebRTC({ roomCode, token, localStream }) {
  const socketRef = useRef(null);
  const pcRef = useRef(null);
  const remoteSocketIdRef = useRef(null);
  const pendingCandidates = useRef([]);
  const localStreamRef = useRef(null);
  localStreamRef.current = localStream;

  const [remoteStream, setRemoteStream] = useState(null);
  const [connected, setConnected] = useState(false);
  const [peerCount, setPeerCount] = useState(0);

  // Admission control states
  const [admissionStatus, setAdmissionStatus] = useState("idle"); // idle | pending | no-host | admitted | rejected | kicked
  const [isBeingRecorded, setIsBeingRecorded] = useState(false);

  const closePeer = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    remoteSocketIdRef.current = null;
    setRemoteStream(null);
    setConnected(false);
  }, []);

  const renegotiate = useCallback(async () => {
    const socket = socketRef.current;
    const pc = pcRef.current;
    const remoteSocketId = remoteSocketIdRef.current;
    if (!socket?.connected || !pc || !remoteSocketId) return;
    if (pc.signalingState !== "stable") return;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", { to: remoteSocketId, offer: pc.localDescription });
  }, []);

  const createPeer = useCallback(
    (socket, remoteSocketId, initiator) => {
      closePeer();
      remoteSocketIdRef.current = remoteSocketId;

      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcRef.current = pc;

      const stream = localStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
      }

      const remote = new MediaStream();
      setRemoteStream(remote);

      pc.ontrack = (e) => {
        e.streams[0]?.getTracks().forEach((track) => {
          remote.addTrack(track);
        });
        setConnected(true);
      };

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            to: remoteSocketId,
            candidate: e.candidate.toJSON(),
          });
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed") {
          setConnected(false);
        }
        if (pc.iceConnectionState === "connected") {
          setConnected(true);
        }
      };

      if (initiator) {
        pc.createOffer()
          .then((offer) => pc.setLocalDescription(offer))
          .then(() => {
            socket.emit("offer", {
              to: remoteSocketId,
              offer: pc.localDescription,
            });
          });
      }

      return pc;
    },
    [closePeer]
  );

  useEffect(() => {
    if (!roomCode || !token) return;

    const socket = io(RTC_URL, {
      auth: { token },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-room", roomCode);
      setAdmissionStatus("pending");
    });

    socket.on("connect_error", (err) => {
      console.error("[useWebRTC] connection error:", err.message);
    });

    // ── Admission control events ──────────────────────
    socket.on("waiting-for-host", ({ status }) => {
      setAdmissionStatus(status === "no-host" ? "no-host" : "pending");
    });

    socket.on("admitted", () => {
      setAdmissionStatus("admitted");
      // room-peers will follow from server after admission
    });

    socket.on("rejected", () => {
      setAdmissionStatus("rejected");
    });

    socket.on("kicked", () => {
      setAdmissionStatus("kicked");
      closePeer();
    });

    // ── Recording notification from HR ────────────────
    socket.on("recording-started", () => setIsBeingRecorded(true));
    socket.on("recording-stopped", () => setIsBeingRecorded(false));

    // ── WebRTC peer events (only fire after admitted) ─
    socket.on("room-peers", (peers) => {
      setPeerCount(peers.length);
      if (peers.length > 0) {
        remoteSocketIdRef.current = peers[0].socketId;
        // Candidate stays passive to avoid offer glare; host will initiate.
      }
    });

    socket.on("user-joined", ({ socketId }) => {
      setPeerCount((c) => c + 1);
      remoteSocketIdRef.current = socketId;
      // Candidate stays passive to avoid offer glare; host will initiate.
    });

    socket.on("offer", async ({ from, offer }) => {
      remoteSocketIdRef.current = from;
      const pc = createPeer(socket, from, false);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      for (const c of pendingCandidates.current) {
        await pc.addIceCandidate(new RTCIceCandidate(c));
      }
      pendingCandidates.current = [];

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { to: from, answer: pc.localDescription });
    });

    socket.on("answer", async ({ answer }) => {
      const pc = pcRef.current;
      if (pc && pc.signalingState === "have-local-offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));

        for (const c of pendingCandidates.current) {
          await pc.addIceCandidate(new RTCIceCandidate(c));
        }
        pendingCandidates.current = [];
      }
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      const pc = pcRef.current;
      if (pc && pc.remoteDescription) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        pendingCandidates.current.push(candidate);
      }
    });

    socket.on("user-left", () => {
      setPeerCount((c) => Math.max(0, c - 1));
      closePeer();
    });

    return () => {
      closePeer();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomCode, token, createPeer, closePeer]);

  useEffect(() => {
    const pc = pcRef.current;
    if (!localStream || !pc || pc.connectionState === "closed") return;

    let changed = false;
    const senders = pc.getSenders();

    localStream.getTracks().forEach((track) => {
      const sender = senders.find((s) => s.track?.kind === track.kind);
      if (!sender) {
        pc.addTrack(track, localStream);
        changed = true;
        return;
      }

      if (sender.track !== track) {
        sender.replaceTrack(track);
        changed = true;
      }
    });

    if (changed) {
      renegotiate().catch((err) => {
        console.error("[useWebRTC] renegotiate failed:", err);
      });
    }
  }, [localStream, peerCount, renegotiate]);

  const replaceTrack = useCallback((newTrack, kind) => {
    const pc = pcRef.current;
    if (!pc) return;
    const sender = pc.getSenders().find((s) => s.track?.kind === kind);
    if (sender) {
      sender.replaceTrack(newTrack);
    }
  }, []);

  // Cancel waiting and disconnect
  const cancelJoin = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setAdmissionStatus("idle");
  }, []);

  return {
    remoteStream,
    connected,
    peerCount,
    replaceTrack,
    admissionStatus,
    isBeingRecorded,
    cancelJoin,
  };
}
