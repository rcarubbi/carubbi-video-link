export function register(socket, users) {
  socket.on("offer", (data) => {
    const recipientSocketId = users.get(data.recipientUserId);
    if (recipientSocketId) {
      socket.to(recipientSocketId).emit("offer", data);
    }
  });
}
