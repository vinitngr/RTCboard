import { io } from "../lib/socket";
import { Namespace } from "socket.io";

const rtc: Namespace = io.of("/rtc");

rtc.on("connection", (socket) => {
  console.log("a user connected" , socket.id);

  socket.on("message", (data) => {
    console.log(data);
    socket.emit('message', 'login html page')
  })
})
