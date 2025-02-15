export function addHandler(socket, users) {
  socket.on("offer", (data) => {
    console.log("Offer received", data);
    const remoteUserSocketId = users.get(data.to);

    if (remoteUserSocketId) {
      socket.to(remoteUserSocketId).emit("offer", data);
      console.log("Offer sent to recipient", { remoteUserSocketId, data });
    }
  });
}
