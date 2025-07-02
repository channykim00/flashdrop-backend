import http from "http";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";

import linkRoutes from "./routes/links/index.js";
import receiveRoutes from "./routes/receive/index.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use("/api/links", linkRoutes);
app.use("/api/receive", receiveRoutes);

const deviceSocketMap = new Map();

io.on("connection", (socket) => {
  console.log("소켓 연결됨:", socket.id);

  socket.on("register-device", (deviceId) => {
    deviceSocketMap.set(deviceId, socket.id);
    console.log(`디바이스 등록: ${deviceId} → ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (const [deviceId, socketId] of deviceSocketMap.entries()) {
      if (socketId === socket.id) {
        deviceSocketMap.delete(deviceId);
        console.log(`연결 해제됨: ${deviceId}`);
        break;
      }
    }
  });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`db 성공 http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("db 연결 실패:", err);
    process.exit(1);
  });
