import fs from "fs";
import path from "path";

import UploadedFile from "../../models/UploadedFile.js";

const CHUNK_TEMP_DIR = "temp_chunks";
const FINAL_DIR = "uploaded_files";

const completeUpload = async (req, res) => {
  const { fileId, fileName, totalChunks, uniqueUrl } = req.body;

  if (!fileId || !fileName || !totalChunks) {
    return res.status(400).json({ message: "필수 정보 누락" });
  }

  const chunkDir = path.join(CHUNK_TEMP_DIR, fileId);
  const finalDir = FINAL_DIR;
  const finalPath = path.join(finalDir, fileName);

  if (!fs.existsSync(chunkDir)) {
    return res.status(400).json({ message: "청크 디렉토리 없음" });
  }

  if (!fs.existsSync(finalDir)) {
    fs.mkdirSync(finalDir, { recursive: true });
  }

  const writeStream = fs.createWriteStream(finalPath);

  for (let i = 0; i < parseInt(totalChunks); i++) {
    const chunkPath = path.join(chunkDir, `chunk-${i}`);
    if (!fs.existsSync(chunkPath)) {
      return res.status(400).json({ message: `청크 누락: chunk-${i}` });
    }

    const data = fs.readFileSync(chunkPath);
    writeStream.write(data);
  }

  writeStream.end(async () => {
    fs.rmSync(chunkDir, { recursive: true, force: true });

    try {
      const uploadedFile = new UploadedFile({
        fileId,
        originalFileName: fileName,
        fileSize: fs.statSync(finalPath).size,
        serverFilePath: finalPath,
        uniqueUrl,
      });

      await uploadedFile.save();

      return res.status(200).json({ message: "파일 저장 및 DB 기록 성공" });
    } catch (err) {
      console.error("DB 저장 실패:", err);
      return res.status(500).json({ message: "파일 저장은 성공했지만 DB 기록 실패" });
    }
  });
};

export default completeUpload;
