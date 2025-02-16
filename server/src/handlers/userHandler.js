import { v4 as uuidv4 } from "uuid";

export function addHandler(socket, users) {
  socket.on("register-user", () => {
    const userId = uuidv4();
    users.set(userId, socket.id);
    socket.emit("user-registered", { userId });
  });
}
