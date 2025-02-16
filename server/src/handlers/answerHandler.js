export function addHandler(socket, users) {
  socket.on("answer", (data) => {
    const remoteUserSocketId = users.get(data.remoteUserId);
    if (remoteUserSocketId) {
      socket.to(remoteUserSocketId).emit("answer", data);
    }
  });
}
