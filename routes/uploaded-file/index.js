import express from "express";

import deleteFile from "./deleteFile.js";
import fetchByUniqueUrls from "./fetchByUniqueUrls.js";

const router = express.Router();

router.use("/", deleteFile);
router.use("/", fetchByUniqueUrls);

export default router;
