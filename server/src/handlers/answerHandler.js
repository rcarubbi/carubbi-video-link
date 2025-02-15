export function addHandler(socket, users) {
  socket.on("answer", (data) => {
    console.log("Answer received", { data });
    const remoteUserSocketId = users.get(data.remoteUserId);
    if (remoteUserSocketId) {
      socket.to(remoteUserSocketId).emit("answer", data);
      console.log("Answer sent to recipient", { remoteUserSocketId, data });
    }
  });
}
