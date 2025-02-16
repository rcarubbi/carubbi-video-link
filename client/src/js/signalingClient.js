import { io } from "socket.io-client";
import * as ui from "./ui.js";
import * as webRtc from "./webrtc.js";

let _socket;
export function connect() {
  const signalingServerUrl = import.meta.env.VITE_SIGNALING_SERVER_URL;
  if (!signalingServerUrl) {
    ui.showError(
      "Signaling server url not found. Please set VITE_SIGNALING_SERVER_URL in .env file.",
    );
    return;
  }
  _socket = io(signalingServerUrl, { secure: true });

  addListeners();
}

function addListeners() {
  _socket.on("user-registered", handleUserRegistered);
  _socket.on("ice-candidate", handleIceCandidate);
  _socket.on("offer", handleOffer);
  _socket.on("answer", handleAnswer);
  _socket.on("end-call", webRtc.endLocalCall);
  _socket.on("cancel-call", webRtc.cancelIncomingCall);
  _socket.on("reject-call", webRtc.handleRejectedCall);
}

function handleUserRegistered({ userId }) {
  ui.updateUserId(userId);
}

async function handleIceCandidate({ candidate }) {
  await webRtc.addIceCandidate(candidate);
}

function handleOffer({ offer, from }) {
  ui.receiveIncomingCall(offer, from);
}

async function handleAnswer({ answer, remoteUserId }) {
  await ui.callAccepted(answer, remoteUserId);
}

export function registerUser() {
  _socket.emit("register-user");
}

export function sendIceCandidate({ candidate, remoteUserId }) {
  _socket.emit("ice-candidate", { candidate, remoteUserId });
}

export function sendOffer({ offer, from, to }) {
  _socket.emit("offer", { offer, from, to });
}

export function sendAnswer({ answer, remoteUserId }) {
  _socket.emit("answer", { answer, remoteUserId });
}

export function sendEndCall({ remoteUserId }) {
  _socket.emit("end-call", { remoteUserId });
}

export function sendCancelCall({ remoteUserId }) {
  _socket.emit("cancel-call", { remoteUserId });
}

export function disconnect() {
  _socket.disconnect();
}

export function sendRejectCall({ remoteUserId }) {
  _socket.emit("reject-call", { remoteUserId });
}
