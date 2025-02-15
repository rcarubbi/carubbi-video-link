export function addHandler(socket, users) {
    socket.on("cancel-call", (data) => {
      console.log("Call cancelled", data);
      const remoteUserSocketId = users.get(data.remoteUserId);
  
      if (remoteUserSocketId) {
        socket.to(remoteUserSocketId).emit("cancel-call", data);
        console.log("Cancel call sent to recipient", { remoteUserSocketId, data });
      }
    });
  }
  