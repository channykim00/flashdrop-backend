import UploadedFile from "../../models/UploadedFile.js";

const completeUpload = async (req, res) => {
  const { fileId, fileName, totalChunks, uniqueUrl, size } = req.body;

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

    return res.status(200).json({ message: "DB 기록 성공" });
  } catch (err) {
    console.error("DB 저장 실패:", err);
    return res.status(500).json({ message: "DB 기록 실패" });
  }
};

export default completeUpload;
