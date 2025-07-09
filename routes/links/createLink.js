import express from "express";
import { nanoid } from "nanoid";

import Link from "../../models/Link.js";

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
      title,
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
      title,
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
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
