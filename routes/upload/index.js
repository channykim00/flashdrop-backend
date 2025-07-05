import express from "express";

import completeUpload from "./completeUpload.js";
import uploadChunk from "./uploadChunk.js";

const router = express.Router();

router.post("/chunk", uploadChunk);
router.post("/complete", completeUpload);

export default router;
