import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("WebRTC Signaling Server is running");
});

export default app;
