import express from "express";

import Link from "../../models/Link.js";

const router = express.Router();

router.get("/:uniqueUrl", async (req, res) => {
  const { uniqueUrl } = req.params;

  try {
    const link = await Link.findOne({ uniqueUrl }).lean();

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "해당하는 링크를 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      link,
    });
  } catch (error) {
    console.error("링크 조회 실패:", error);
    res.status(500).json({
      success: false,
      message: "링크 조회 중 오류가 발생했습니다.",
    });
  }
});

export default router;
