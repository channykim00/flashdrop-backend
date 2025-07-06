export const deviceSocketMap = new Map();
export let io = null;

export const setIoInstance = (ioInstance) => {
  io = ioInstance;
};
