import "notyf/notyf.min.css";
import Waves from "node-waves";
import { Notyf } from "notyf";
import * as Dropdown from "./components/Dropdown.js";
import * as webRtc from "./webrtc.js";
import * as fx from "./fx.js";

const states = {
  calling: "calling",
  inCall: "inCall",
  idle: "idle",
};

export function init() {
  Waves.attach(".circle-btn", ["waves-circle", "waves-float", "waves-light"]);
  Waves.attach(".rounded-btn", ["waves-float", "waves-light"]);
  Waves.init();
  Dropdown.init();
}

const settingsButton = document.querySelector("#settings-btn");
const settingsPanel = document.querySelector("#settings-panel");
const closeSettingsButton = document.querySelector("#close-settings-btn");
const localUserIdInput = document.querySelector("#local-user-id");
const remoteUserIdInput = document.querySelector("#remote-user-id");
const videoDevicesDropdown = document.querySelector("#video-menu");
const audioDevicesDropdown = document.querySelector("#audio-menu");
const startCallButton = document.querySelector("#start-call-btn");
const incomingCallModal = document.querySelector("#incoming-call-modal");
const incomingCallMessage = document.querySelector("#incoming-call-message");
const acceptCallButton = document.querySelector("#accept-call-btn");
const rejectCallButton = document.querySelector("#reject-call-btn");
const outgoingCallModal = document.querySelector("#outgoing-call-modal");
const outgoingCallMessage = document.querySelector("#outgoing-call-message");
const cancelCallButton = document.querySelector("#cancel-call-btn");
const localVideo = document.querySelector("#local-video");
const remoteVideo = document.querySelector("#remote-video");
const toggleVideoButton = document.querySelector("#toggle-video-btn");
const toggleAudioButton = document.querySelector("#toggle-audio-btn");
const endCallButton = document.querySelector("#end-call-btn");

const notyf = new Notyf({
  duration: 3000,
  position: {
    x: "right",
    y: "top",
  },
});

export function setupEventListeners() {
  settingsButton.addEventListener("click", () => {
    show(settingsPanel);
  });
  closeSettingsButton.addEventListener("click", () => {
    hide(settingsPanel);
  });
  settingsPanel.addEventListener("click", () => {
    hide(settingsPanel);
  });
  startCallButton.addEventListener("click", startCall);
  cancelCallButton.addEventListener("click", cancelCall);
  toggleVideoButton.addEventListener("click", toggleVideo);
  toggleAudioButton.addEventListener("click", toggleAudio);
  acceptCallButton.addEventListener("click", acceptCall);
  rejectCallButton.addEventListener("click", rejectCall);
  endCallButton.addEventListener("click", webRtc.endRemoteCall);
  window.addEventListener("beforeunload", () => {
    webRtc.endRemoteCall();
    webRtc.endLocalCall();
  });
}

function toggleVideo() {
  toggleVideoButton.textContent = webRtc.isVideoEnabled()
    ? "videocam_off"
    : "videocam";
  webRtc.toggleVideo();
}

function toggleAudio() {
  toggleAudioButton.textContent = webRtc.isAudioEnabled() ? "mic_off" : "mic";
  webRtc.toggleAudio();
}

function cancelCall() {
  webRtc.cancelCall();
  hide(outgoingCallModal);
}

function startCall() {
  const localUserId = localUserIdInput.value;
  const remoteUserId = remoteUserIdInput.value;

  if (remoteUserId === "") {
    notyf.error("Please enter a remote user ID");
    return;
  }

  webRtc.startCall({ localUserId, remoteUserId });
  outgoingCallMessage.textContent = `Calling ${remoteUserId}...`;
  show(outgoingCallModal);
  refreshControlsState(states.calling);
}

function show(element) {
  element.classList.remove("!hidden");
  setTimeout(() => {
    element.classList.remove("opacity-0");
    element.classList.remove("scale-90");
    element.classList.add("opacity-100");
    element.classList.add("scale-100");
  }, 10);
}

function hide(element) {
  element.classList.remove("opacity-100");
  element.classList.remove("scale-100");
  element.classList.add("opacity-0");
  element.classList.add("scale-90");

  setTimeout(() => {
    element.classList.add("!hidden");
  }, 300);
}

export function updateUserId(userId) {
  localUserIdInput.value = userId;
}

export function updateSelectedVideoDevice(deviceId) {
  Dropdown.selectItemByValue(deviceId, "#video-menu");
}

export function updateSelectedAudioDevice(deviceId) {
  Dropdown.selectItemByValue(deviceId, "#audio-menu");
}

export function populateVideoDevices(videoDevices) {
  Dropdown.createDropdownItem(
    videoDevicesDropdown,
    "Select a video device",
    "none",
    webRtc.setVideoDevice,
  );

  videoDevices.forEach((device) => {
    Dropdown.createDropdownItem(
      videoDevicesDropdown,
      device.label,
      device.deviceId,
      webRtc.setVideoDevice,
    );
  });
}

export function populateAudioDevices(audioDevices) {
  Dropdown.createDropdownItem(
    audioDevicesDropdown,
    "Select an audio device",
    "none",
    webRtc.setAudioDevice,
  );

  audioDevices.forEach((device) => {
    Dropdown.createDropdownItem(
      audioDevicesDropdown,
      device.label,
      device.deviceId,
      webRtc.setAudioDevice,
    );
  });
}

export function showLocalVideoStream(stream) {
  localVideo.srcObject = stream;

  refreshControlsState(stream === null ? states.idle : states.calling);
}

export function showRemoteVideoStream(stream) {
  remoteVideo.srcObject = stream;
  refreshControlsState(stream === null ? states.idle : states.inCall);
}

export function receiveIncomingCall(offer, remoteUserId) {
  webRtc.setIncomingOffer(offer, remoteUserId);
  incomingCallMessage.textContent = `Incoming call from ${remoteUserId}`;
  show(incomingCallModal);
  refreshControlsState(states.calling);
}

function refreshControlsState(state) {
  switch (state) {
    case states.calling:
      startCallButton.disabled = true;
      remoteUserIdInput.disabled = true;
      settingsButton.disabled = true;
      toggleAudioButton.disabled = false;
      toggleVideoButton.disabled = false;
      endCallButton.disabled = true;
      fx.playRinging();
      break;
    case states.inCall:
      startCallButton.disabled = true;
      remoteUserIdInput.disabled = true;
      settingsButton.disabled = true;
      toggleAudioButton.disabled = false;
      toggleVideoButton.disabled = false;
      endCallButton.disabled = false;
      fx.stopRinging();
      fx.playStartCall();
      break;
    case states.idle:
      fx.stopRinging();
      fx.playEndCall();
      startCallButton.disabled = false;
      remoteUserIdInput.disabled = false;
      settingsButton.disabled = false;
      toggleAudioButton.disabled = true;
      toggleVideoButton.disabled = true;
      endCallButton.disabled = true;
      toggleAudioButton.textContent = "mic";
      toggleVideoButton.textContent = "videocam";
      break;
  }
}

function acceptCall() {
  webRtc.acceptCall();
  hide(incomingCallModal);
}

function rejectCall() {
  webRtc.rejectCall();
  hide(incomingCallModal);
  refreshControlsState(states.idle);
}

export async function callAccepted(answer) {
  await webRtc.setAnswer(answer);
  hide(outgoingCallModal);
}

export function updateRemoteUserId(remoteUserId) {
  remoteUserIdInput.value = remoteUserId;
}

export function hideIncomingCallModal() {
  hide(incomingCallModal);
  refreshControlsState(states.idle);
  webRtc.endLocalCall();
}

export function hideOutgoingCallModal() {
  hide(outgoingCallModal);
  refreshControlsState(states.idle);
}
