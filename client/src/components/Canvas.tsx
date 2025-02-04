import { useEffect, useRef, useState } from 'react'
import { useRoomStore } from '../store/roomStore';
import { Copy, Eraser, Pen, PencilLine, Save, Trash } from 'lucide-react';

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setTool] = useState("pen");
  const [liveUser, setLiveUser] = useState(0);

  const { connection, exitRoom, roomDetails } = useRoomStore()

  useEffect(() => {
    setLiveUser(roomDetails?.participants?.length || 0);
  }, [roomDetails]);

  return (
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

        <button className="px-2 py-1 bg-gray-700 rounded-lg" >
          <Trash />
        </button>

        <button className="px-2 py-1 bg-gray-700 rounded-lg" >
          <Save color="white" size={20} />
        </button>

        <div className="bg-red-500 rounded-lg hover:cursor-pointer flex justify-center items-center p-2 sm:px-4 sm:py-2"
          onClick={() => {
            if (connection) {
              connection.peerConnection.close();
              connection.dataChannel.close();
              exitRoom(roomDetails?.roomId);
            }
          }}
        >Disconnect</div>


        <div
          onClick={() => connection?.dataChannel.send('hi')}
          className="px-2 py-1 bg-gray-700 rounded-lg text-center cursor-pointer">Check
        </div>
      </div>
    </div>
  )
}

export default Canvas