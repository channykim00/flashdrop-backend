export default function formatFileSize(bytes) {
  if (bytes >= 1024 ** 3) {
    return (bytes / 1024 ** 3).toFixed(1) + "GB";
  } else if (bytes >= 1024 ** 2) {
    return (bytes / 1024 ** 2).toFixed(1) + "MB";
  } else if (bytes >= 1024) {
    return (bytes / 1024).toFixed(1) + "KB";
  } else {
    return bytes + "B";
  }
}
