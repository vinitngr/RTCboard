import { io } from "../lib/socket";
import { Namespace } from "socket.io";

export const rtc: Namespace = io.of("/rtc");
export const userInRoom = new Map<string, string>();


rtc.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId as string;
  if (userId) userInRoom.set(userId, socket.id); 
 
  console.log(userInRoom);

  socket.on("Test-message", (message) => {
    console.log("Received message:", message);
    socket.emit("Test-message", message + 'back');
  })

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    userInRoom.delete(userId); 
    console.log(userInRoom);
  });
})
