import * as userHandler from "../handlers/userHandler.js";
import * as offerHandler from "../handlers/offerHandler.js";
import * as answerHandler from "../handlers/answerHandler.js";
import * as iceCandidateHandler from "../handlers/iceCandidateHandler.js";
import * as disconnectHandler from "../handlers/disconnectHandler.js";
import * as endCallHandler from "../handlers/endCallHandler.js";
import * as cancelCallHandler from "../handlers/cancelCallHandler.js";
import * as rejectCallHandler from "../handlers/rejectCallHandler.js";

const users = new Map();

export default function (io) {
  io.on("connection", (socket) => {
    console.log("User connected",  { socketId: socket.id });

    userHandler.addHandler(socket, users);
    offerHandler.addHandler(socket, users);
    answerHandler.addHandler(socket, users);
    iceCandidateHandler.addHandler(socket, users);
    disconnectHandler.addHandler(socket, users);
    endCallHandler.addHandler(socket, users);
    cancelCallHandler.addHandler(socket, users);
    rejectCallHandler.addHandler(socket, users);
  });

  
}
