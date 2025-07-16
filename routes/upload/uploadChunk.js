import path from "path";

import multer from "multer";

import { FILE_TYPE_OPTIONS } from "../../constants.js";
import formatFileSize from "../../utils/formatFileSize.js";
import getLinkByUniqueUrl from "../../utils/getLinkByUniqueUrl.js";
import linkCache from "../../utils/linkCache.js";
import { uploadFileToS3 } from "../../utils/uploadToS3.js";

const upload = multer();

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

    try {
      await uploadFileToS3({
        fileId,
        chunkIndex,
        buffer: chunk,
      });

      return res.status(200).json({
        message: "업로드 완료",
        fileId,
        receivedChunks: parseInt(chunkIndex) + 1,
        totalChunks: parseInt(totalChunks),
        progress: Math.min(
          100,
          (((parseInt(chunkIndex) + 1) / parseInt(totalChunks)) * 100).toFixed(1),
        ),
      });
    } catch (err) {
      console.error("업로드 실패:", err);
      return res.status(500).json({ message: "업로드 실패" });
    }
  },
];

export default uploadChunk;
