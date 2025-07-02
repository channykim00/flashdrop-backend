import express from "express";

import { deviceSocketMap } from "../../socket/socketStore.js";

const router = express.Router();

router.get("/is-online/:deviceId", (req, res) => {
  const { deviceId } = req.params;

  const isOnline = deviceSocketMap.has(deviceId);
  return res.json({ success: true, isOnline });
});

export default router;
