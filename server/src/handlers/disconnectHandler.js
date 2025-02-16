export function addHandler(socket, users) {
  socket.on("disconnect", () => {
 
    for (const [userId, socketId] of users) {
      if (socketId === socket.id) {
        users.delete(userId);
        socket.broadcast.emit("user-disconnected", { userId: userId });
        break;
      }
    }
  });
}
