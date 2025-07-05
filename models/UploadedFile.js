import mongoose from "mongoose";

const uploadedFileSchema = new mongoose.Schema({
  fileId: { type: String, required: true, unique: true },
  originalFileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  serverFilePath: { type: String, required: true },
  uniqueUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("UploadedFile", uploadedFileSchema);
