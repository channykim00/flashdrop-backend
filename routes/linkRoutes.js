import express from "express";
import { nanoid } from "nanoid";

import Link from "../models/Link.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      deviceId,
      folderPath,
      expireTime,
      allowedFileTypes,
      maxFileSize,
      autoAccept,
      requireSenderName,
      password,
    } = req.body;

    const uniqueUrl = nanoid(10);

    const newLink = new Link({
      uniqueUrl,
      deviceId,
      folderPath,
      expireTime,
      allowedFileTypes,
      maxFileSize,
      autoAccept,
      requireSenderName,
      password,
    });

    const savedLink = await newLink.save();

    res.status(201).json({
      success: true,
      link: {
        ...savedLink.toObject(),
      },
    });
  } catch (err) {
    console.error("링크 생성 실패:", err);
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "이미 같은 폴더에 연결된 링크가 존재합니다.",
      });
    }
    res.status(500).json({ success: false, message: "링크 생성 중 오류 발생" });
  }
});

export default router;
