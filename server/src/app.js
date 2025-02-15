import express from "express";
import cors from "cors";

const app = express();
 
 
app.use(cors({
  origin: "*",
  allowedHeaders: "*",
  methods: "*",
}));  

app.get("/", (req, res) => {
  res.send("WebRTC Signaling Server is running");
});

export default app;
