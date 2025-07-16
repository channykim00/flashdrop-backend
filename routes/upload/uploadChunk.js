import fs from "fs";
import path from "path";

import multer from "multer";

import { FILE_TYPE_OPTIONS } from "../../constants.js";
import formatFileSize from "../../utils/formatFileSize.js";
import getLinkByUniqueUrl from "../../utils/getLinkByUniqueUrl.js";
import linkCache from "../../utils/linkCache.js";

const upload = multer();
const CHUNK_TEMP_DIR = "temp_chunks";

const uploadChunk = [
  upload.single("chunk"),
  async (req, res) => {
    const { fileId, chunkIndex, totalChunks, uniqueUrl, filename, size } = req.body;
    const chunk = req.file?.buffer;
    const extension = path.extname(filename);

    if (!fileId || chunkIndex === undefined || !chunk || !totalChunks || !uniqueUrl) {
      return res.status(400).json({ message: "필수 정보 누락" });
    }

    let link;
    try {
      link = linkCache.get(uniqueUrl);

      if (!link) {
        link = await getLinkByUniqueUrl(uniqueUrl);
        linkCache.set(uniqueUrl, link);
      }
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }

    if (parseInt(chunkIndex) === 0) {
      const fileExtension = extension.split(".").pop().toLowerCase();
      const allowedGroup = link.allowedFileTypeGroup;
      const allowedExts =
        FILE_TYPE_OPTIONS.find((opt) => opt.value === allowedGroup)?.extensions || [];

      if (allowedExts.length > 0 && !allowedExts.includes(fileExtension)) {
        return res.status(415).json({
          success: false,
          message: `허용되지 않은 파일 형식입니다. (${fileExtension})`,
        });
      }

      if (link.maxFileSize < size) {
        return res.status(413).json({
          success: false,
          message: `파일 크기 제한(${formatFileSize(link.maxFileSize)})를 초과했습니다.`,
        });
      }
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
