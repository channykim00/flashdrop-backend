import fs from "fs";
import path from "path";

import multer from "multer";

const upload = multer();
const CHUNK_TEMP_DIR = "temp_chunks";

const uploadChunk = [
  upload.single("chunk"),
  async (req, res) => {
    const { fileId, chunkIndex, totalChunks } = req.body;
    const chunk = req.file?.buffer;

    if (!fileId || chunkIndex === undefined || !chunk || !totalChunks) {
      return res.status(400).json({ message: "필수 정보 누락" });
    }

    const chunkDir = path.join(CHUNK_TEMP_DIR, fileId);
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir, { recursive: true });
    }

    const chunkPath = path.join(chunkDir, `chunk-${chunkIndex}`);
    fs.writeFile(chunkPath, chunk, (err) => {
      if (err) {
        console.error("청크 저장 실패:", err);
        return res.status(500).json({ message: "청크 저장 실패" });
      }

      const receivedChunks = fs.readdirSync(chunkDir).length;
      const progress = (receivedChunks / parseInt(totalChunks)) * 100;

      return res.status(200).json({
        message: "청크 저장 완료",
        fileId,
        receivedChunks,
        totalChunks: parseInt(totalChunks),
        progress: Math.min(100, progress.toFixed(1)),
      });
    });
  },
];

export default uploadChunk;
