import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  updateStatusUser,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("update-status-user", (sessions) => {
    store.dispatch(updateStatusUser(sessions));
  })

  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
  });
});

export default socket;
