import http from "http";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";

import UploadedFile from "./models/UploadedFile.js";
import linkRoutes from "./routes/links/index.js";
import receiveRoutes from "./routes/receive/index.js";
import uploadRoutes from "./routes/upload/index.js";
import fileRoutes from "./routes/uploaded-file/index.js";
import { deviceSocketMap, setIoInstance } from "./socket/socketStore.js";
import { deleteChunksFromS3 } from "./utils/deleteChunksFromS3.js";
import { getChunkFromS3 } from "./utils/getChunkFromS3.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

setIoInstance(io);

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use("/api/links", linkRoutes);
app.use("/api/receive", receiveRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/uploaded-file", fileRoutes);

io.on("connection", (socket) => {
  console.log("소켓 연결됨:", socket.id);

  socket.on("download-complete", async (fileId) => {
    await deleteChunksFromS3(fileId);
    await UploadedFile.deleteOne({ fileId });
  });

  socket.on("register-device", (deviceId) => {
    deviceSocketMap.set(deviceId, socket.id);
    console.log(`디바이스 등록: ${deviceId} → ${socket.id}`);
  });

  socket.on("accept-upload", async ({ uploadData }) => {
    const deviceIdEntry = [...deviceSocketMap.entries()].find(
      ([, socketId]) => socketId === socket.id,
    );

    if (!deviceIdEntry) {
      console.error("해당 소켓에 등록된 deviceId 없음");
      return;
    }

    const [deviceId] = deviceIdEntry;
    const targetSocketId = deviceSocketMap.get(deviceId);

    if (!targetSocketId) {
      console.error("소켓 ID 조회 실패");
      return;
    }

    const totalChunks = uploadData.totalChunks;

    for (let i = 0; i < totalChunks; i++) {
      const chunkData = await getChunkFromS3(uploadData.fileId, i);
      io.to(targetSocketId).emit("receive-chunk", {
        fileId: uploadData.fileId,
        chunkIndex: i,
        totalChunks,
        chunk: chunkData,
        finalSavePath: uploadData.finalSavePath,
        extension: uploadData.extension,
        filename: uploadData.filename,
        size: uploadData.size,
        senderName: uploadData.senderName || "",
      });
    }
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
