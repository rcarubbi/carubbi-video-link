import uuidv4 from "uuid/v4";

export function register(socket, users) {
  socket.on("user-joining", () => {
    const userId = uuidv4();
    users.set(userId, socket.id);
    socket.emit("user-joined", { userId: userId });
  });
}
