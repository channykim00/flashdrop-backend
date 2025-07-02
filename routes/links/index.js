import express from "express";

import createLink from "./createLink.js";
import getLink from "./getLink.js";

const router = express.Router();

router.use("/", createLink);
router.use("/", getLink);

export default router;
