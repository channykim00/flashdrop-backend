import express from "express";

import Link from "../../models/Link.js";

const router = express.Router();

router.patch("/:uniqueUrl", async (req, res) => {
  try {
    const { uniqueUrl } = req.params;
    const updateFields = req.body;

    const updated = await Link.findOneAndUpdate({ uniqueUrl }, updateFields, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "링크를 찾을 수 없습니다." });
    }

    res.json({ success: true, link: updated });
  } catch (err) {
    console.error("링크 업데이트 실패:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
