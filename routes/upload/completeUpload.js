import path from "path";

import UploadedFile from "../../models/UploadedFile.js";
import { io, deviceSocketMap } from "../../socket/socketStore.js";
import getLinkByUniqueUrl from "../../utils/getLinkByUniqueUrl.js";
import linkCache from "../../utils/linkCache.js";

const completeUpload = async (req, res) => {
  const { fileId, fileName, totalChunks, uniqueUrl, size, senderName = "" } = req.body;

  if (!fileId || !fileName || !totalChunks || !uniqueUrl) {
    return res.status(400).json({ message: "필수 정보 누락" });
  }

  try {
    const uploadedFile = new UploadedFile({
      fileId,
      originalFileName: fileName,
      fileSize: size,
      uniqueUrl,
    });

    await uploadedFile.save();

    let link;
    try {
      link = linkCache.get(uniqueUrl);

      if (!link) {
        link = await getLinkByUniqueUrl(uniqueUrl);
        linkCache.set(uniqueUrl, link);
      }
    } catch (err) {
      console.error("링크 조회 실패:", err);
      return res.status(500).json({ message: "링크 조회 실패" });
    }

    const socketId = deviceSocketMap.get(link.deviceId);
    if (!socketId) {
      console.warn("연결된 디바이스가 없음:", link.deviceId);
      return res.status(200).json({ message: "DB 기록 성공 (연결된 디바이스 없음)" });
    }

    const extension = path.extname(fileName);
    const startedAt = Date.now();
    const finalSavePath = link.folderPath;

    io.to(socketId).emit("request-upload-accept", {
      title: link.title,
      fileId,
      filename: fileName,
      chunkIndex: 0,
      totalChunks: parseInt(totalChunks),
      finalSavePath,
      size,
      extension,
      uniqueUrl,
      startedAt,
      senderName,
      autoAccept: link.autoAccept,
    });

    return res.status(200).json({ message: "DB 기록 성공" });
  } catch (err) {
    console.error("DB 저장 실패:", err);
    return res.status(500).json({ message: "DB 기록 실패" });
  }
};

export default completeUpload;
