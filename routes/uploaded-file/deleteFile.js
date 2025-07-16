import express from "express";

import UploadedFile from "../../models/UploadedFile.js";
import { deleteChunksFromS3 } from "../../utils/deleteChunksFromS3.js";

const router = express.Router();

router.delete("/:fileId", async (req, res) => {
  const { fileId } = req.params;

  try {
    const deleted = await UploadedFile.deleteOne({ fileId });

    if (deleted.deletedCount === 0) {
      console.log("해당 파일 없음");
      return res.status(404).json({
        success: false,
        message: "해당 파일이 없습니다.",
      });
    }

    try {
      await deleteChunksFromS3(fileId);
    } catch (error) {
      console.warn(`청크 삭제 중 오류 발생:`, error.message);
    }

    res.status(200).json({
      success: true,
      message: `파일 삭제 완료`,
    });
  } catch (error) {
    console.error("파일 삭제 실패:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류로 인해 삭제 실패",
    });
  }
});

export default router;
