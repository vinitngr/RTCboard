import React, { useState } from 'react'
import { useRoomStore } from '../store/roomStore';
import { useNavigate } from 'react-router-dom';
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
    <div className="w-full p-6 bg-white rounded-lg shadow-lg border border-gray-200 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Create Room</h3>

            <form
            className="w-full p-6 bg-white rounded-lg shadow-lg border border-gray-200 space-y-4"
            onSubmit={handleCreateSubmit}>
              <input
                required
                type="text"
                placeholder="Enter Room Name"
                value={roomData.roomName}
                onChange={(e) => setRoomData({ ...roomData, roomName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                required
                type="text"
                placeholder="Enter Room Password"
                value={roomData.roomPassword}
                onChange={(e) => setRoomData({ ...roomData, roomPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
              type="submit"
              className="w-full py-2 bg-black text-white rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-black">
                Create Room
              </button>
            </form>
          </div>
  )
}

export default CreateRoom