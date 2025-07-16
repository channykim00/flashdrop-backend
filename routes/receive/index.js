import express from "express";

import getLink from "./getLink.js";
import verifyPassword from "./verifyPassword.js";

const router = express.Router();

router.use("/", getLink);
router.use("/", verifyPassword);

export default router;
