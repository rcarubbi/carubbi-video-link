export function register(socket, users) {
  socket.on("candidate", (data) => {
    const recipientSocketId = users.get(data.recipientUserId);
    if (recipientSocketId) {
      socket.to(recipientSocketId).emit("candidate", data);
    }
  });
}
