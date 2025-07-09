import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
  uniqueUrl: { type: String, required: true, unique: true },
  deviceId: { type: String, required: true },
  folderPath: { type: String, required: true },
  expireTime: { type: Number, required: true },
  allowedFileTypes: { type: [String], default: [] },
  maxFileSize: { type: Number, default: 0 },
  autoAccept: { type: Boolean, default: false },
  requireSenderName: { type: Boolean, default: false },
  password: { type: String, default: null },
  title: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Link", LinkSchema);
