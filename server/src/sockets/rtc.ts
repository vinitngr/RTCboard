import { io } from "../lib/socket";
import { Namespace } from "socket.io";

const rtc: Namespace = io.of("/rtc");
const userInRoom = new Map<string, string>();


rtc.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId as string;
  if (userId) userInRoom.set(userId, socket.id); 
 
  console.log(userInRoom);
  // io.emit("getOnlineUsers", Array.from(userInRoom.keys())); 

  socket.on("Test-message", (message) => {
    console.log("Received message:", message);
  })

  socket.on('userExited' , (data) => {
    data.messageTo.forEach((participant : any) => {
      const participantSocketId = userInRoom.get(participant.userId);
      if (participantSocketId) {
        console.log('participant id ' , participantSocketId);
        socket.to(participantSocketId).emit('userExitedBackend', { success: true });
      } else {
        console.log('User not found in the room:', participant.userId);
      }
    });
  })

  socket.on('UserJoined' , (data) => {
    const messageTo = userInRoom.get(data.participants[0].userId);
    if (messageTo) {
      socket.to(messageTo).emit('anotherUserJoined', data);
      console.log('antoher User Joined called');
    } else {
        console.log('User not found in the room:', data.participants[0].userId);
    }

  })

  

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    userInRoom.delete(userId); 
    console.log(userInRoom);
  });
})
