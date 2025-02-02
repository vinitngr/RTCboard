import { Copy, Eraser, Pen, PencilLine, Save, Trash } from "lucide-react";
import { useRoomStore } from "../store/roomStore";
import { useEffect, useRef, useState } from "react";
import Peer1 from "../components/Peer1";
import Peer2 from "../components/Peer2";

// import { dataChannel , peerConnection } from "../lib/rtc";

export default function Room() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ , setTool] = useState("pen");
  const [liveUser, setLiveUser] = useState(0);
  
  const { roomDetails, exitRoom , connection } = useRoomStore();

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
  useEffect(() => {
    if (connection && connection.peerConnection) {

      connection.peerConnection.ontrack = async () => {
        console.log('received track');
      }
     
      const dataChannelHandler = (event : RTCDataChannelEvent) => {
      const channel = event.channel;
      channel.onmessage = ({ data }) => {console.log('Received message:', data);};
      channel.onopen = () => console.log('Data channel opened');
      channel.onclose = () => exitRoom(roomDetails?.roomId);
      };

      connection.peerConnection.ondatachannel = dataChannelHandler;
    }

    }, [connection, exitRoom, roomDetails]);
    
  

  useEffect(() => {
    setLiveUser(roomDetails?.participants?.length || 0);
  }, [roomDetails]);

  const handleDisconnect = async () => {
    try {
      await exitRoom(roomDetails?.roomId);
    } catch (error) {
      console.log("Error", error);
    }
  };
  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "canvas.png";
      link.click();
    }
  };

  return (
    <div className="flex h-screen text-white p-6 gap-6">
      <div className="flex flex-col gap-4">
        <Peer1 />
        <Peer2 />
      </div>

      <div className="flex flex-col w-2/3 gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-black">
                Room ID: {roomDetails?.roomId}
              </span>
              <Copy
                color="black"
                size={20}
                onClick={() => {
                  navigator.clipboard.writeText(roomDetails?.roomId || "");
                }}
              />
              <div className="text-black text-xs">Users : {liveUser}</div>
            </div>
            <div className="text-lg font-semibold text-black mx-5">
              Room Name : {roomDetails?.roomName}
            </div>
          </div>
     
        <div className="relative flex-1 bg-gray-800 rounded-lg p-4">
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-white rounded-lg"
          ></canvas>
        </div>

        <div className="flex flex-wrap justify-center text-xs md:text-base gap-3 bg-gray-900 p-3 rounded-lg">
        {[
          { icon: <Pen />, name: "Pen" },
          { icon: <PencilLine />, name: "Pencil" },
          { icon: <Eraser />, name: "Eraser" },
        ].map(({ icon, name }) => (
          <button
            key={name}
            className="px-2 py-1 bg-gray-700 rounded-lg flex items-center gap-2 "
            onClick={() => setTool(name.toLowerCase())}
          >
            {icon} {name}
          </button>
        ))}
        
        <button className="px-2 py-1 bg-gray-700 rounded-lg" onClick={clearCanvas}>
          <Trash />
        </button>
        
        <button className="px-2 py-1 bg-gray-700 rounded-lg" onClick={saveCanvas}>
          <Save color="white" size={20} />
        </button>

        <div className="bg-red-500 rounded-lg hover:cursor-pointer flex justify-center items-center p-2 sm:px-4 sm:py-2"
          onClick={handleDisconnect}>Disconnect</div>

        <div className="px-2 py-1 bg-gray-700 rounded-lg text-center cursor-pointer"
          onClick={() => {
            connection?.dataChannel.send("hi");
            console.log(connection?.peerConnection.connectionState);
          }}>Check</div>

        <div className="px-2 py-1 bg-gray-700 rounded-lg text-center cursor-pointer"
          onClick={() => {
            connection?.dataChannel.close();
            connection?.dataChannel.close();
          }}>DClose</div>
        </div>  

      </div>
    </div>
  );
}