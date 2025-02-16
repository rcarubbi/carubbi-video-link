import * as signalingClient from "./signalingClient.js";
import * as ui from "./ui.js";

let _videoDeviceId = null;
let _audioDeviceId = null;
let _audioDevices = [];
let _videoDevices = [];
let _peerConnection = null;
let _localStream = null;
let _remoteUserId = null;
let _incomingOffer = null;
let _pendingIceCandidates = [];

const videoConstraints = {
  width: { ideal: 1920, max: 1920 },
  height: { ideal: 1080, max: 1080 },
  frameRate: { ideal: 30 },
};

const audioConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

const iceServers = [
  { urls: "stun:stun.relay.metered.ca:80" },
  {
    urls: "turn:global.relay.metered.ca:80",
    username: "805fa1a146c089442314c091",
    credential: "PLS2t69GUqwmazj0",
  },
  {
    urls: "turn:global.relay.metered.ca:80?transport=tcp",
    username: "805fa1a146c089442314c091",
    credential: "PLS2t69GUqwmazj0",
  },
  {
    urls: "turn:global.relay.metered.ca:443",
    username: "805fa1a146c089442314c091",
    credential: "PLS2t69GUqwmazj0",
  },
  {
    urls: "turns:global.relay.metered.ca:443?transport=tcp",
    username: "805fa1a146c089442314c091",
    credential: "PLS2t69GUqwmazj0",
  },
];

export function init() {
  signalingClient.connect();
  signalingClient.registerUser();

  requestMediaPermissions().then(async () => {
    _videoDevices = await listVideoDevices();
    ui.populateVideoDevices(_videoDevices);
    const defaultVideoDeviceId = _videoDevices[0].deviceId;
    setVideoDevice(defaultVideoDeviceId);
    ui.updateSelectedVideoDevice(defaultVideoDeviceId);

    _audioDevices = await listAudioDevices();
    ui.populateAudioDevices(_audioDevices);
    const defaultAudioDeviceId = _audioDevices[0].deviceId;
    setAudioDevice(defaultAudioDeviceId);
    ui.updateSelectedAudioDevice(defaultAudioDeviceId);
  });
}

async function requestMediaPermissions() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    stream.getTracks().forEach((track) => track.stop());
  } catch (err) {
    ui.showError("Access to user media denied");
  }
}

async function listVideoDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter((device) => device.kind === "videoinput");
  return videoDevices;
}

async function listAudioDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const audioDevices = devices.filter((device) => device.kind === "audioinput");
  return audioDevices;
}

export function setVideoDevice(deviceId) {
  if (deviceId === "none") {
    const defaultVideoDeviceId = _videoDevices[0].deviceId;
    _videoDeviceId = defaultVideoDeviceId;
    ui.updateSelectedVideoDevice(defaultVideoDeviceId);
  } else {
    _videoDeviceId = deviceId;
  }
}

export function setAudioDevice(deviceId) {
  if (deviceId === "none") {
    const defaultAudioDeviceId = _audioDevices[0].deviceId;
    _audioDeviceId = defaultAudioDeviceId;
    ui.updateSelectedAudioDevice(defaultAudioDeviceId);
  } else {
    _audioDeviceId = deviceId;
  }
}

async function createPeerConnection() {
  _peerConnection = new RTCPeerConnection({
    iceServers,
  });
  _peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      signalingClient.sendIceCandidate({
        candidate: event.candidate,
        remoteUserId: _remoteUserId,
      });
    }
  };

  _peerConnection.ontrack = (event) => {
    ui.showRemoteVideoStream(event.streams[0]);
  };

  _localStream.getTracks().forEach((track) => {
    _peerConnection.addTrack(track, _localStream);
  });
}

export async function startCall({ localUserId, remoteUserId }) {
  _remoteUserId = remoteUserId;

  _localStream = await navigator.mediaDevices.getUserMedia({
    video: { deviceId: _videoDeviceId, ...videoConstraints },
    audio: { deviceId: _audioDeviceId, ...audioConstraints },
  });
  ui.showLocalVideoStream(_localStream);

  await createPeerConnection();

  const offer = await _peerConnection.createOffer();
  await _peerConnection.setLocalDescription(offer);

  signalingClient.sendOffer({
    to: _remoteUserId,
    from: localUserId,
    offer,
  });
}

export function cancelCall() {
  _localStream.getTracks().forEach((track) => {
    track.stop();
  });

  ui.showLocalVideoStream(null);

  signalingClient.sendCancelCall({
    remoteUserId: _remoteUserId,
  });
}

export function isVideoEnabled() {
  return _localStream.getVideoTracks()[0].enabled;
}

export function toggleVideo() {
  _localStream.getVideoTracks()[0].enabled =
    !_localStream.getVideoTracks()[0].enabled;
}

export function isAudioEnabled() {
  return _localStream.getAudioTracks()[0].enabled;
}

export function toggleAudio() {
  _localStream.getAudioTracks()[0].enabled =
    !_localStream.getAudioTracks()[0].enabled;
}

export async function setIncomingOffer(offer, remoteUserId) {
  _remoteUserId = remoteUserId;
  _incomingOffer = offer;

  _localStream = await navigator.mediaDevices.getUserMedia({
    video: { deviceId: _videoDeviceId },
    audio: { deviceId: _audioDeviceId },
  });

  ui.showLocalVideoStream(_localStream);
}

export async function acceptCall() {
  await createPeerConnection();

  await _peerConnection.setRemoteDescription(
    new RTCSessionDescription(_incomingOffer),
  );
  await flushPendingIceCandidates();

  const answer = await _peerConnection.createAnswer();
  await _peerConnection.setLocalDescription(answer);

  signalingClient.sendAnswer({
    remoteUserId: _remoteUserId,
    answer,
  });

  ui.updateRemoteUserId(_remoteUserId);

  _incomingOffer = null;
}

async function flushPendingIceCandidates() {
  for (const candidate of _pendingIceCandidates) {
    await _peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  _pendingIceCandidates = [];
}

export function rejectCall() {
  _incomingOffer = null;
  signalingClient.sendRejectCall({ remoteUserId: _remoteUserId });
  _pendingIceCandidates = [];
  _remoteUserId = null;
}

export function endRemoteCall() {
  stopLocalStream();
  signalingClient.sendEndCall({ remoteUserId: _remoteUserId });
}

function stopLocalStream() {
  _localStream.getTracks().forEach((track) => {
    track.stop();
  });

  ui.showLocalVideoStream(null);

  _peerConnection.close();
  _peerConnection = null;

  ui.showRemoteVideoStream(null);
}

export function endLocalCall() {
  stopLocalStream();
}

export async function setAnswer(answer) {
  const remoteDesc = new RTCSessionDescription(answer);
  await flushPendingIceCandidates();
  await _peerConnection.setRemoteDescription(remoteDesc);
}

export async function addIceCandidate(candidate) {
  if (!_peerConnection || !_peerConnection.remoteDescription) {
    _pendingIceCandidates.push(candidate);
  } else {
    await _peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }
}

export function cancelIncomingCall() {
  _incomingOffer = null;
  _remoteUserId = null;
  ui.hideIncomingCallModal();
}

export function handleRejectedCall() {
  stopLocalStream();
  ui.hideOutgoingCallModal();
}

export function isIncomingCall() {
  return _incomingOffer !== null;
}
