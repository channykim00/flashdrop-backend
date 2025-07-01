import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import linkRoutes from "./routes/linkRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use("/api/links", linkRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`성공 http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("연결 실패:", err);
    process.exit(1);
  });
