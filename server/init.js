const http = require("http");
const jwt = require("jsonwebtoken");
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
          socket.sessionId = decoded.sessionId;
          next();
        });
      });
    } else {
      next(new Error("Without credentials!"));
    }
});

io.on("connection", (socket) => {

  socket.on("go-online", async (id) => {
    
    if (onlineUsers) {
      const alreadyOnlineIndex = onlineUsers.findIndex(ou => ou.id === id);

      if (alreadyOnlineIndex >= 0) {
        const socketsList = onlineUsers[alreadyOnlineIndex].socketIds;
        const socketsIndex = socketsList.findIndex(si => si.sessionId === socket.sessionId);

        if (socketsIndex >= 0) {
          socketsList[socketsIndex] = { sessionId: socketsList[socketsIndex].sessionId, socketId: socket.id }
        } else {
          socketsList.push({ sessionId: socket.sessionId, socketId: socket.id })
        }
      }

      if (alreadyOnlineIndex === -1) {
        onlineUsers.push({ id, socketIds: [{ sessionId: socket.sessionId, socketId: socket.id}]})
      }
    }
    

    if(!onlineUsers) {
      onlineUsers.push({ id, socketIds: [{ sessionId: socket.sessionId, socketId: socket.id}]})
    }

    // send the user who just went online to everyone else who is already online
    socket.broadcast.emit("update-status-user", onlineUsers);
  });

  socket.on("new-message", async (data) => {
    const usersConvo = onlineUsers?.filter(ou => ou.id === data.recipientId || ou.id === data.message.senderId);
    if (usersConvo) {
      usersConvo.map(userConvo => {
        userConvo.socketIds.map(socketItem => {
          socket.to(socketItem.socketId).emit("new-message", {
            message: data.message,
            sender: data.sender,
          });
      })
    })}

  });

  socket.on("logout", async (id) => {

    const onlineUserIndex = onlineUsers.findIndex(ou => ou.id === id);
    
    
    if (onlineUsers[onlineUserIndex].socketIds.length > 1) {
        onlineUsers[onlineUserIndex].socketIds = onlineUsers[onlineUserIndex].socketIds.filter(socketItem => socketItem.sessionId !== socket.sessionId);
    } else {
        onlineUsers.splice(onlineUserIndex, 1);
    }
    
    socket.broadcast.emit("update-status-user", onlineUsers);
  });

  
    
});

module.exports = { server }