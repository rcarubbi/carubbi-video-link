import * as userHandler from "./handlers/userHandler.js";
import * as offerHandler from "./handlers/offerHandler.js";
import * as answerHandler from "./handlers/answerHandler.js";
import * as candidateHandler from "./handlers/candidateHandler.js";
import * as diconnectHandler from "./handlers/disconnectHandler.js";

const users = new Map();

export default function (io) {
  io.on("connection", (socket) => {
    userHandler.register(socket, users);
    offerHandler.register(socket, users);
    answerHandler.register(socket, users);
    candidateHandler.register(socket, users);
    disconnectHandler.register(socket, users);
  });
}
