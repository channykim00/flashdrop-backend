import express from "express";

import Link from "../../models/Link.js";

const router = express.Router();

router.get("/:uniqueUrl", async (req, res) => {
  try {
    const { uniqueUrl } = req.params;
    const link = await Link.findOne({ uniqueUrl }).lean();

    if (!link) {
      return res.status(404).json({ success: false, message: "링크를 찾을 수 없습니다." });
    }

    const filteredLink = {
      title: link.title,
      expireTime: link.expireTime,
      allowedFileTypeGroup: link.allowedFileTypeGroup,
      maxFileSize: link.maxFileSize,
      requireSenderName: link.requireSenderName,
      requirePassword: !!link.password,
    };

    res.json({ success: true, link: filteredLink });
  } catch (err) {
    console.error("수신 링크 조회 오류:", err);
    res.status(500).json({ success: false, message: "링크 조회 중 오류 발생" });
  }
});

export default router;
