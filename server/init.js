const http = require("http");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cookie = require("cookie");
const { app } = require("./app");
const { User } = require("./db/models");
const onlineUsers = require("./onlineUsers");

const server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces, and sync database.
   */
  
  const io = require("socket.io")(server);

io.use((socket, next) => {
    const { messengerToken } = cookie.parse(socket.handshake.headers.cookie || "/");
    if (messengerToken) {
      jwt.verify(messengerToken, process.env.SESSION_SECRET, (err, decoded) => {
        if (err) {
          return next();
        }
        User.findOne({
          where: { id: decoded.id },
        }).then(async (user) => {
          socket.user = user;
          next();
        });
      });
    } else {
      socket.disconnect();
    }
});

io.on("connection", (socket) => {


  socket.on("go-online", async (id) => {
    await User.update({ socketId: socket.id}, { where: { id }})
    // send the user who just went online to everyone else who is already online
    socket.broadcast.emit("add-online-user", id);
  });

  socket.on("new-message", async (data) => {
    const { socketId } = await User.findOne({ where: { id: data.recipientId } })
    socket.to(socketId).emit("new-message", {
      message: data.message,
      sender: data.sender,
    });
  });

  socket.on("logout", async (id) => {
    await User.update({ socketId: null}, { where: { id }})
    
    socket.broadcast.emit("remove-offline-user", id)
  });

  
    
});

module.exports = { server }