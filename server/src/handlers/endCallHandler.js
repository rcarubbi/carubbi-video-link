
export function addHandler(socket, users) {
    socket.on("end-call", (data) => {
      const remoteUserSocketId = users.get(data.remoteUserId);
      if (remoteUserSocketId) {
        socket.to(remoteUserSocketId).emit("end-call", data);
      }
    });
  }
  