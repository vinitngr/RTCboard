import { useState } from "react";

function Profile() {
  const [viewMode, setViewMode] = useState("grid");

  // Sample data
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
  };

  const rooms = [
    {
      name: "Room 1",
      status: "active",
      startedAt: "2025-01-28 10:00 AM",
    },
    {
      name: "Room 2",
      status: "ended",
      startedAt: "2025-01-27 03:00 PM",
    },
    {
      name: "Room 3",
      status: "ended",
      startedAt: "2025-01-26 02:00 PM",
    },
  ];

  return (
    <div className=" bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-8">
        <div className="flex justify-between mx-10">
          
          <div>
              <h2 className="text-3xl font-semibold text-gray-900">Profile</h2>
              <div className="mt-4 text-lg text-gray-700">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
          </div>
          <img
            src="https://avatars.githubusercontent.com/u/43305076?v=4"
            alt="Profile"
            className="size-32 rounded-full overflow-hidden"
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Your Rooms</h3>
            <div className="space-x-4">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg ${viewMode === "grid" ? "bg-black text-white" : "bg-gray-200"}`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg ${viewMode === "list" ? "bg-black text-white" : "bg-gray-200"}`}
              >
                List View
              </button>
            </div>
          </div>

          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4" : "space-y-4 mt-4"}>
            {rooms.map((room, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{room.name}</h4>
                    <p className={`text-sm font-semibold mt-2 w-fit px-3 rounded-full ${room.status === "active" ? "text-green-600 bg-green-200" : "text-red-600 bg-red-200"}`}>
                      {room.status === "active" ? "Active" : "Ended"}
                    </p>
                </div>
                <p className="text-sm text-gray-600">Started: {room.startedAt}</p>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
