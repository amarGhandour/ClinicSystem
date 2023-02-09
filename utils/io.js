const socketIO = require("socket.io");
let io;
module.exports = {
  init(server) {
    io = socketIO(server, {
      cors: {
        origin: "*",
      },
    });
    return io;
  },
  getIo() {
    if (!io) {
      throw new Error("Socket.io not initialized");
    }
    return io;
  },
};

