import "notyf/notyf.min.css";
import Waves from "node-waves";
import { Notyf } from "notyf";
import * as Dropdown from "./components/Dropdown.js";
import * as webRtc from "./webrtc.js";

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
const outgoingCallModal = document.querySelector("#outgoing-call-modal");
const outgoingCallMessage = document.querySelector("#outgoing-call-message");
const cancelCallButton = document.querySelector("#cancel-call-btn");
const localVideo = document.querySelector("#local-video");
const remoteVideo = document.querySelector("#remote-video");
const toggleVideoButton = document.querySelector("#toggle-video-btn");
const toggleAudioButton = document.querySelector("#toggle-audio-btn");

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
}

function show(element) {
  element.classList.remove("hidden");
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
    element.classList.add("hidden");
  }, 300);
}

export function updateUserId({ userId }) {
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

  if (stream === null) {
    toggleVideoButton.disabled = true;

    toggleAudioButton.disabled = true;

    settingsButton.disabled = false;
  } else {
    toggleVideoButton.disabled = false;

    toggleAudioButton.disabled = false;

    settingsButton.disabled = true;
  }
}

export function showRemoteVideoStream(stream) {
  remoteVideo.srcObject = stream;
}
