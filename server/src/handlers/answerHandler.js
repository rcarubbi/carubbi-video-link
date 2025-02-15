export function register(socket, users) {
  socket.on("answer", (data) => {
    const recipientSocketId = users.get(data.recipientUserId);
    if (recipientSocketId) {
      socket.to(recipientSocketId).emit("answer", data);
    }
  });
}
