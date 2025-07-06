import { deviceSocketMap } from "../socket/socketStore.js";

const isDeviceOnline = (deviceId) => {
  if (!deviceId) return false;
  return deviceSocketMap.has(deviceId);
};

export default isDeviceOnline;
