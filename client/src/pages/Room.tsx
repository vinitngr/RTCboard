import { Copy, Eraser, Pen, PencilLine, Save, Trash } from "lucide-react";
import { useRoomStore } from "../store/roomStore";
import { useEffect, useRef, useState } from "react";
export default function Room() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setTool] = useState("pen");

  const { roomDetails , exitRoom } = useRoomStore()
  const [liveUser , setLiveUser] = useState(0)
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
//TODO : Add live user count , use socket when user 2 join || or use continous polling
  useEffect(() => {
    setLiveUser(roomDetails?.participants?.length || 0);
  }, [roomDetails])

  const handleDisconnect = async () => {
    try {
      await exitRoom(roomDetails?.roomId);
    } catch (error) {
      console.log('Error' , error);
    }
  }
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
      <div className="flex flex-col w-1/3 gap-4">
           <div  className="h-1/2 bg-gray-800 rounded-lg flex items-center justify-center">
            <video className="w-full h-full bg-gray-700 rounded-lg" autoPlay muted></video>
          </div>
          <div className="h-1/2 bg-gray-800 rounded-lg flex items-center justify-center">
            <video className="w-full h-full bg-gray-700 rounded-lg" autoPlay muted></video>
          </div>

      </div>

      <div className="flex flex-col w-2/3 gap-4">
        <div>
        <div  className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-black">Room ID: {roomDetails?.roomId}</span>
            <Copy color="black" size={20} onClick={()=>{navigator.clipboard.writeText(roomDetails?.roomId || "");}}/>
              <div className="text-black text-xs">Users : {liveUser}</div>
          </div>
          <div className="text-lg font-semibold text-black mx-5">Room Name : {roomDetails?.roomName}</div>
        </div>

      </div>
        <div className="relative flex-1 bg-gray-800 rounded-lg p-4">
          <canvas ref={canvasRef} className="w-full h-full bg-white rounded-lg"></canvas>
        </div>

        <div className="flex justify-center gap-3 bg-gray-900 p-3 rounded-lg">
          {[
            {icon: <Pen/>, name: 'Pen'},
            {icon: <PencilLine/>, name: 'Pencil'},
            {icon: <Eraser/>, name: 'Eraser'}
          ].map(({icon, name}) => (
            <button key={name} className="px-3 py-2 bg-gray-700 rounded-lg flex items-center gap-2" onClick={() => setTool(name.toLowerCase())}>
              {icon} {name}
            </button>
          ))}
          <button className="px-3 py-2 bg-gray-700 rounded-lg" onClick={clearCanvas}><Trash /></button>
          <button className="px-3 py-2 bg-gray-700 rounded-lg" onClick={saveCanvas}><Save color="white" size={20}/></button>
          <div className="bg-red-500 rounded-lg hover:cursor-pointer flex justify-center items-center p-2 justify-self-end"
          onClick={handleDisconnect}
          >Disconnect</div>
        </div>
      </div>
    </div>
  );
}
