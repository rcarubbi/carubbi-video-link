import { Server } from "socket.io";
import http from "http";

import app from "./app.js";
import signalingController from "./controllers/signalingController.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

signalingController(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Signaling server running on http://localhost:${PORT}`);
});
