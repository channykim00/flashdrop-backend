import path from "path";

import express from "express";

import Link from "../../models/Link.js";
import UploadedFile from "../../models/UploadedFile.js";
import getTotalChunksFromS3 from "../../utils/getTotalChunksFromS3.js";

const router = express.Router();

router.post("/by-unique-urls", async (req, res) => {
  const { uniqueUrls } = req.body;

  if (!Array.isArray(uniqueUrls) || uniqueUrls.length === 0) {
    return res.sendStatus(400);
  }

  try {
    const files = await UploadedFile.find({ uniqueUrl: { $in: uniqueUrls } });
    const links = await Link.find({ uniqueUrl: { $in: uniqueUrls } });

    const linkMap = new Map();
    for (const link of links) {
      linkMap.set(link.uniqueUrl, link);
    }

    const finalFiles = [];
    for (const file of files) {
      const link = linkMap.get(file.uniqueUrl);
      const totalChunks = await getTotalChunksFromS3(file.fileId);

      const uploadData = {
        title: (link && link.title) || "",
        fileId: file.fileId,
        filename: file.originalFileName,
        extension: path.extname(file.originalFileName),
        chunkIndex: 0,
        totalChunks,
        finalSavePath: (link && link.folderPath) || "",
        size: file.fileSize,
        uniqueUrl: file.uniqueUrl,
        startedAt: Date.now(),
        autoAccept: !!(link && link.autoAccept),
      };

      if (file.senderName) {
        uploadData.senderName = file.senderName;
      }

      finalFiles.push(uploadData);
    }

    res.json({ success: true, files: finalFiles });
  } catch (err) {
    console.error("파일 목록 조회 실패:", err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

export default router;
