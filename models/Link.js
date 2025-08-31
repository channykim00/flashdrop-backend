import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
  uniqueUrl: { type: String, required: true, unique: true },
  deviceId: { type: String, required: true },
  folderPath: { type: String, required: true },
  expireTime: { type: Number, required: true },
  allowedFileTypeGroup: { type: String, default: "all" },
  maxFileSize: { type: Number, default: 0 },
  autoAccept: { type: Boolean, default: false },
  requireSenderName: { type: Boolean, default: false },
  password: { type: String, default: null },
  title: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date },
});

LinkSchema.pre("save", function (next) {
  this.expireAt = new Date(Date.now() + this.expireTime * 60 * 1000);
  next();
});

LinkSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Link", LinkSchema);
