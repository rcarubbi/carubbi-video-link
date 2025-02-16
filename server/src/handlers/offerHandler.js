export function addHandler(socket, users) {
  socket.on("offer", (data) => {
    const remoteUserSocketId = users.get(data.to);

    if (remoteUserSocketId) {
      socket.to(remoteUserSocketId).emit("offer", data);
    }
  });
}
