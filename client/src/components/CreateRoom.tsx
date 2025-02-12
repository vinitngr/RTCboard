import React, { useState } from 'react'
import { useRoomStore } from '../store/roomStore';
import { useNavigate } from 'react-router-dom';
import { BedDouble, KeyRound } from 'lucide-react';
function CreateRoom() {
    const [roomData, setRoomData] = useState<{ roomName: string; roomPassword: string }>({ roomName: "", roomPassword: "" });

    const navigate = useNavigate();
    const { createRoom } = useRoomStore();
    const handleCreateSubmit = async (e : React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try {
            const roomId = await createRoom(roomData);
            console.log(roomId);
            setRoomData({ roomName: "", roomPassword: "" });
            navigate(`/room/${roomId}`)
        } catch (error) {
            console.log('Error' , error);            
        }
      }
      window.addEventListener("beforeunload", () => {
    });
    
  return (
    <div>
        <form onSubmit={handleCreateSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-zinc-300 text-sm font-medium pl-1">Room Name</label>
            <div className="relative">
              <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                type="text"
                value={roomData.roomName}
                onChange={(e) => setRoomData({ ...roomData, roomName: e.target.value })}
                
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-12 py-3 text-white placeholder-zinc-500
                  focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600
                  transition-all duration-300 hover:bg-zinc-800/70"
                placeholder="Enter room name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-zinc-300 text-sm font-medium pl-1">Room Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                type="password"
                value={roomData.roomPassword}
                onChange={(e) => setRoomData({ ...roomData, roomPassword: e.target.value })}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-12 py-3 text-white placeholder-zinc-500
                  focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600
                  transition-all duration-300 hover:bg-zinc-800/70"
                placeholder="Enter room password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-8 bg-white text-zinc-900 py-3 px-6 rounded-xl font-medium
              transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10
              focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-[0.98]"
          >
            Create Room
          </button>
        </form>
    </div>
  )
}

export default CreateRoom