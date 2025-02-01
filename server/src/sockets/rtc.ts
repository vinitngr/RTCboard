import { io } from "../lib/socket";
import { Namespace } from "socket.io";

export const rtc: Namespace = io.of("/rtc");
export const userInRoom = new Map<string, string>();


rtc.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId as string;
  if (userId) userInRoom.set(userId, socket.id); 
 
  console.log(userInRoom);

  socket.on("joinSocketRoom" , (roomId : string) => {
    console.log('room Joined');
    socket.join(roomId); 
  })

  socket.on('userDisconnected' , (roomId : string ) => {
    socket.to(roomId).emit('userExited' , { userExited : true });
    // socket.leave(roomId);
  })

  socket.on("Test-message", (message) => {
    console.log("Received message:", message);
    socket.emit("Test-message", message + 'back');
  })

  
  socket.on("RTCoffer" , async (data : {offer : RTCSessionDescription , creatorId : string}) => {
    const creatorSocketId = userInRoom.get(data.creatorId)
    socket.to(creatorSocketId).emit("RTCoffer" , { offer : data.offer });
  })
  
  socket.on("RTCanswer" , (data : {answer : RTCSessionDescription , joinerId : string}) => {
    const senderSocketId = userInRoom.get(data.joinerId)
    socket.to(senderSocketId).emit("RTCanswer" , { answer : data });
  })
  
  socket.on('new-ice-candidate' , (candidate) => {
    console.log('Ice candidate gathering server-side');
    const creatorSocketId = userInRoom.get(candidate.id)
    socket.to(creatorSocketId).emit('new-ice-candidate' , candidate);
  })
  
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    userInRoom.delete(userId); 
    console.log(userInRoom);
  });
})
