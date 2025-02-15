import ringing from "../assets/ringing.mp3";
import endCall from "../assets/callend.mp3";
import startCall from "../assets/callstart.mp3";

const ringingAudio = new Audio(ringing);
const endCallAudio = new Audio(endCall);
const startCallAudio = new Audio(startCall);

export function playEndCall() {
  endCallAudio.play();
}

export function playStartCall() {
  startCallAudio.play();
}

export function playRinging() {
  ringingAudio.loop = true;
  ringingAudio.play();
}

export function stopRinging() {
  ringingAudio.pause();
  ringingAudio.currentTime = 0;
}
