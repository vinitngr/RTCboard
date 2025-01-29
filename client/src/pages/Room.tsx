import { Copy } from "lucide-react";
import { useRoomStore } from "../store/roomStore";
import { useRef, useState } from "react";
export default function Room() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setTool] = useState("pen");

  const { roomDetails } = useRoomStore()
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
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
      <div className="flex flex-col w-1/3 gap-4">
           <div  className="h-1/2 bg-gray-800 rounded-lg flex items-center justify-center">
            <video className="w-full h-full bg-gray-700 rounded-lg" autoPlay muted></video>
          </div>
          <div className="h-1/2 bg-gray-800 rounded-lg flex items-center justify-center">
            <video className="w-full h-full bg-gray-700 rounded-lg" autoPlay muted></video>
          </div>

      </div>

      <div className="flex flex-col w-2/3 gap-4">
        <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-black">Room ID: {roomDetails?.roomId}</span>

        <Copy color="black" size={20} 
            onClick={()=>{
            navigator.clipboard.writeText(roomDetails?.roomId || "");
            }}/>

      </div>
        <div className="relative flex-1 bg-gray-800 rounded-lg p-4">
          <canvas ref={canvasRef} className="w-full h-full bg-white rounded-lg"></canvas>
        </div>

        <div className="flex justify-center gap-3 bg-gray-900 p-3 rounded-lg">
          {["Pen", "Pencil", "Erase"].map((toolName) => (
            <button key={toolName} className="px-3 py-2 bg-gray-700 rounded-lg" onClick={() => setTool(toolName.toLowerCase())}>
              {toolName}
            </button>
          ))}
          <button className="px-3 py-2 bg-gray-700 rounded-lg" onClick={clearCanvas}>Clear</button>
          <button className="px-3 py-2 bg-gray-700 rounded-lg" onClick={saveCanvas}>Save</button>
        </div>
      </div>
    </div>
  );
}
