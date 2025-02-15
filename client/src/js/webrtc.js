import * as signalingClient from "./signalingClient.js";
import * as ui from "./ui.js";

let _videoDeviceId = null;
let _audioDeviceId = null;
let _audioDevices = [];
let _videoDevices = [];
let _peerConnection = null;
let _localStream = null;
let _remoteUserId = null;

const iceServers = [
  {
    urls: "stun:stun.l.google.com:19302",
  },
  {
    urls: "stun:stun1.l.google.com:19302",
  },
  {
    urls: "stun:stun2.l.google.com:19302",
  },
  {
    urls: "stun:stun3.l.google.com:19302",
  },
  {
    urls: "stun:stun4.l.google.com:19302",
  },
  {
    urls: "stun:stun.services.mozilla.com",
  },
  {
    urls: "stun:stun.stunprotocol.org:3478",
  },
  {
    urls: "stun:stun.voipbuster.com",
  },
  {
    urls: "stun:stun.voxgratia.org",
  },
  {
    urls: "stun:stun.xten.com",
  },
  {
    urls: "stun:stun.schlund.de",
  },
  {
    urls: "stun:stun.iptel.org",
  },
  {
    urls: "stun:stun.ekiga.net",
  },
  {
    urls: "stun:stun.ideasip.com",
  },
  {
    urls: "stun:stun.sipgate.net",
  },
  {
    urls: "stun:stun.voipstunt.com",
  },
  {
    urls: "stun:stun.1und1.de",
  },
  {
    urls: "stun:stun.gmx.net",
  },
  {
    urls: "stun:stun.callwithus.com",
  },
  {
    urls: "stun:stun.counterpath.com",
  },
  {
    urls: "stun:stun.internetcalls.com",
  },
  {
    urls: "stun:stun.noc.ams-ix.net",
  },
  {
    urls: "stun:stun.voiparound.com",
  },
  {
    urls: "stun:stun.voip.co.uk",
  },
  {
    urls: "stun:stun.voipdiscount.com",
  },
  {
    urls: "stun:stun.voipfone.co.uk",
  },
];

export function init() {
  signalingClient.connect();
  listVideoDevices().then((devices) => {
    _videoDevices = devices;
    ui.populateVideoDevices(devices);
    const defaultVideoDeviceId = devices[0].deviceId;
    setVideoDevice(defaultVideoDeviceId);
    ui.updateSelectedVideoDevice(defaultVideoDeviceId);
  });
  listAudioDevices().then((devices) => {
    _audioDevices = devices;
    ui.populateAudioDevices(devices);
    const defaultAudioDeviceId = devices[0].deviceId;
    setAudioDevice(defaultAudioDeviceId);
    ui.updateSelectedAudioDevice(defaultAudioDeviceId);
  });
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

export async function startCall({ localUserId, remoteUserId }) {
  _peerConnection = new RTCPeerConnection({ iceServers });
  _remoteUserId = remoteUserId;
  _peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      signalingClient.sendIceCandidate({
        candidate: event.candidate,
        _remoteUserId,
      });
    }
  };

  _peerConnection.ontrack = (event) => {
    ui.showRemoteVideoStream(event.streams[0]);
  };

  _localStream = await navigator.mediaDevices.getUserMedia({
    video: { deviceId: _videoDeviceId },
    audio: { deviceId: _audioDeviceId },
  });

  _localStream.getTracks().forEach((track) => {
    _peerConnection.addTrack(track, _localStream);
  });

  ui.showLocalVideoStream(_localStream);

  const offer = await _peerConnection.createOffer();
  await _peerConnection.setLocalDescription(offer);

  signalingClient.sendCallRequest({
    localUserId,
    _remoteUserId,
    offer,
  });
}

export function cancelCall() {
  _localStream.getTracks().forEach((track) => {
    track.stop();
  });

  _localStream = null;

  ui.showLocalVideoStream(null);

  signalingClient.sendCancelRequest({ remoteUserId: _remoteUserId });
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
