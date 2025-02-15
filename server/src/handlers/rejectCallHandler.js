export function addHandler(socket, users) {
    socket.on("reject-call", (data) => {
      console.log("Call rejected", data);
      const remoteUserSocketId = users.get(data.remoteUserId);
  
      if (remoteUserSocketId) {
        socket.to(remoteUserSocketId).emit("reject-call", data);
        console.log("Reject call sent to recipient", { remoteUserSocketId, data });
      }
    });
  }
  