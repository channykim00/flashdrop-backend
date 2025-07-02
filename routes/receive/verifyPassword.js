import express from "express";

import Link from "../../models/Link.js";

const router = express.Router();

router.post("/verify-password", async (req, res) => {
  const { uniqueUrl, password } = req.body;

  if (!uniqueUrl || !password) {
    return res.status(400).json({ success: false, message: "필수 정보 누락" });
  }

  try {
    const link = await Link.findOne({ uniqueUrl });

    if (!link) {
      return res.status(404).json({ success: false, message: "링크를 찾을 수 없습니다." });
    }

    if (link.password !== password) {
      return res.status(401).json({ success: false, message: "비밀번호가 틀렸습니다." });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("비밀번호 검증 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

export default router;
