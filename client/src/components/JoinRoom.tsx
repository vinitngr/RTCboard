import React, { useState } from 'react'
import { useRoomStore } from '../store/roomStore';
import { useNavigate } from 'react-router-dom';

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
    <div className="w-full p-6 bg-white rounded-lg shadow-lg border border-gray-200 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Join Room</h3>
        <form
        className="w-full p-6 bg-white rounded-lg shadow-lg border border-gray-200 space-y-4"
        onSubmit={handleJoinSubmit}
        >
        <input
        required
        type="text"
        placeholder="Enter Room ID"
        value={joinRoomData.roomId}
        onChange={(e) => setJoinRoomData({ ...joinRoomData, roomId: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <input
        required
        type="text"
        placeholder="Enter Room Password"
        value={joinRoomData.roomPassword}
        onChange={(e) => setJoinRoomData({ ...joinRoomData , roomPassword: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button 
        type="submit"
        className="w-full py-2 bg-yellow-400 text-white font-semibold rounded-md hover:bg-yellow-500 focus:outline-none focus:yellow-2">
        Join Room
        </button>
        </form>
    </div>
  )
}

export default JoinRoom