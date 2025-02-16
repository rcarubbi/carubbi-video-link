export function addHandler(socket, users) {
    socket.on("reject-call", (data) => {
      const remoteUserSocketId = users.get(data.remoteUserId);
  
      if (remoteUserSocketId) {
        socket.to(remoteUserSocketId).emit("reject-call", data);
      }
    });
  }
  