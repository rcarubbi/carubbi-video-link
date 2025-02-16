export function addHandler(socket, users) {
    socket.on("cancel-call", (data) => {
      const remoteUserSocketId = users.get(data.remoteUserId);
  
      if (remoteUserSocketId) {
        socket.to(remoteUserSocketId).emit("cancel-call", data);
      }
    });
  }
  