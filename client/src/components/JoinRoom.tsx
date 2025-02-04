import React, { useState } from 'react'
import { useRoomStore } from '../store/roomStore';
import { useNavigate } from 'react-router-dom';
import { Hash, KeyRound } from 'lucide-react';

function JoinRoom() {
    const [joinRoomData, setJoinRoomData] = useState<{ roomId: string; roomPassword: string }>({ roomId: "", roomPassword: "" });
    const navigate = useNavigate()

    const { joinRoom } = useRoomStore();

    const handleJoinSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
      e.preventDefault();
        const roomId = await joinRoom(joinRoomData);
        setJoinRoomData({ roomId: "", roomPassword: "" });
        navigate(`/room/${roomId}`)
   
    }
    return (
      <div>
          <form onSubmit={handleJoinSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-zinc-300 text-sm font-medium pl-1">Room Id</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  type="text"
                  value={joinRoomData.roomId}
                  onChange={(e) => setJoinRoomData({ ...joinRoomData, roomId: e.target.value })}
                  
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-12 py-3 text-white placeholder-zinc-500
                    focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600
                    transition-all duration-300 hover:bg-zinc-800/70"
                  placeholder="Enter room id"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-zinc-300 text-sm font-medium pl-1">Room Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  type="password"
                  value={joinRoomData.roomPassword}
                  onChange={(e) => setJoinRoomData({ ...joinRoomData, roomPassword: e.target.value })}
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
              Join Room
            </button>
          </form>
      </div>
    )
  
}

export default JoinRoom