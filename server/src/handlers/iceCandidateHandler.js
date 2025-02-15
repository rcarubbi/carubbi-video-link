export function addHandler(socket, users) {
  socket.on("ice-candidate", (data) => {
    console.log("Ice candidate received", data);
    const remoteUserSocketId = users.get(data.remoteUserId);
    if (remoteUserSocketId) {
      socket.to(remoteUserSocketId).emit("ice-candidate", data);
      console.log("Ice candidate sent to recipient", { remoteUserSocketId, data });
    }
  });
}
