import express from "express";

import createLink from "./createLink.js";
import deleteLink from "./deleteLink.js";
import getLink from "./getLink.js";
import updateLink from "./updateLink.js";

const router = express.Router();

router.use("/", createLink);
router.use("/", getLink);
router.use("/", updateLink);
router.use("/", deleteLink);

export default router;
