import * as ui from "./ui.js";

export function connect() {
  ui.updateUserId({ userId: "123" });
}

export function sendIceCandidate({ candidate, remoteUserId }) {
  // trigger event
}

export function sendOffer({ offer, remoteUserId }) {
  // trigger event
}

export function sendAnswer({ answer, remoteUserId }) {
  // trigger event
}

export function disconnect() {
  // trigger event
}

export function onOffer(callback) {
  // trigger event
}

export function onAnswer(callback) {
  // trigger event
}

export function onIceCandidate(callback) {
  // trigger event
}

export function onDisconnect(callback) {
  // trigger event
}
