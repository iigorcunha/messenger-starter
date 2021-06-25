const http = require("http");
const jwt = require("jsonwebtoken");
const { app } = require("./app");
const { User } = require("./db/models");
const onlineUsers = require("./onlineUsers");

const server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces, and sync database.
   */
  
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    }
  });


  



io.on("connection", (socket) => {

  const cookie = socket.handshake.headers.cookie;
  if(cookie) {
    const [_, messengerToken] = cookie.split("=")
    if (messengerToken) {
      jwt.verify(messengerToken, process.env.SESSION_SECRET, (err, decoded) => {
        if (err) {
          return next();
        }
        User.findOne({
          where: { id: decoded.id },
        }).then((user) => {
          socket.on("go-online", (id) => {
            if (!onlineUsers.includes(id)) {
              onlineUsers.push(id);
            }
            // send the user who just went online to everyone else who is already online
            socket.broadcast.emit("add-online-user", id);
          });
        
          socket.on("new-message", (data) => {
            socket.broadcast.emit("new-message", {
              message: data.message,
              sender: data.sender,
            });
          });
        
          socket.on("logout", (id) => {
            if (onlineUsers.includes(id)) {
              userIndex = onlineUsers.indexOf(id);
              onlineUsers.splice(userIndex, 1);
              socket.broadcast.emit("remove-offline-user", id);
            }
          });
        });
      });
    } else {
      io.on("disconnect", () => console.log("disconnect"))
    }
  }
});

module.exports = { server }