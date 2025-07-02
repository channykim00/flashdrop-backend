import express from "express";

import getLink from "./getLink.js";
import isOnline from "./isOnline.js";
import verifyPassword from "./verifyPassword.js";

const router = express.Router();

router.use("/", getLink);
router.use("/", verifyPassword);
router.use("/", isOnline);

export default router;
