export function addHandler(socket, users) {
  socket.on("ice-candidate", (data) => {
    const remoteUserSocketId = users.get(data.remoteUserId);
    if (remoteUserSocketId) {
      socket.to(remoteUserSocketId).emit("ice-candidate", data);
    }
  });
}
