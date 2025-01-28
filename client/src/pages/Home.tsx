import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [roomData, setRoomData] = useState<{ roomName: string; roomPassword: string }>({
    roomName: "",
    roomPassword: "",
  });
  const [joinRoomId, setJoinRoomId] = useState<string>("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!roomData.roomName || !roomData.roomPassword) {
      alert("Please provide a room name and password.");
      return;
    }
    // Implement your room creation logic here
    console.log("Creating room with:", roomData);
    navigate(`/room/${roomData.roomName}`);
  };

  const handleJoinRoom = () => {
    if (!joinRoomId || !roomData.roomPassword) {
      alert("Please provide a room ID and password.");
      return;
    }
    // Implement your join room logic here
    console.log("Joining room with ID:", joinRoomId);
    navigate(`/room/${joinRoomId}`);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6 space-y-8">

        {/* Flex layout for Create and Join Room */}
        <div className="md:flex-row flex flex-col items-center gap-5 justify-center">
          {/* Create Room Card */}
          <div className="w-full p-6 bg-white rounded-lg shadow-lg border border-gray-200 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Create Room</h3>
            <div>
              <input
                type="text"
                placeholder="Enter Room Name"
                value={roomData.roomName}
                onChange={(e) => setRoomData({ ...roomData, roomName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter Room Password"
                value={roomData.roomPassword}
                onChange={(e) => setRoomData({ ...roomData, roomPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <button
              onClick={handleCreateRoom}
              className="w-full py-2 bg-black text-white rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-black"
            >
              Create Room
            </button>
          </div>

          {/* Join Room Card */}
          <div className="w-full p-6 bg-white rounded-lg shadow-lg border border-gray-200 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Join Room</h3>
            <div>
              <input
                type="text"
                placeholder="Enter Room ID"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter Room Password"
                value={roomData.roomPassword}
                onChange={(e) => setRoomData({ ...roomData, roomPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <button
              onClick={handleJoinRoom}
              className="w-full py-2 bg-black text-white rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-black"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
