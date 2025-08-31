import express from "express";

import Link from "../../models/Link.js";

const router = express.Router();

router.delete("/:uniqueUrl", async (req, res) => {
  try {
    const { uniqueUrl } = req.params;

    await Link.findOneAndDelete({ uniqueUrl });

    res.json({
      success: true,
      message: "링크가 성공적으로 삭제되었습니다.",
    });
  } catch (err) {
    console.error("링크 삭제 실패:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
