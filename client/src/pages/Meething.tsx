import { Calendar, Clock, Loader, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRoomStore } from '../store/roomStore';
import { useNavigate } from 'react-router-dom';
function Meetings() {
  const { meetings, getMeetings } = useRoomStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  useEffect(() => {
    if (meetings.length === 0) {
      setLoading(true);
      getMeetings()
      setLoading(false)
    } else {
      setLoading(false);
    }
  }, [getMeetings, meetings.length]);

  const handleclick = (roomId : string) =>{
    if(!roomId) return
    navigate(`/meeting/${roomId}`)
  }
  return (
    <div className="flex flex-col flex-grow">
      <div className="w-[50vw] mx-auto mt-10">
        <h2 className="text-2xl font-bold text-white mb-6">Meeting History</h2>

        {loading ? (
          <div className="text-white text-center flex justify-center h-[60vh] items-center">
            <Loader className="w-6 h-6 animate-spin" />
          </div>
        ) : meetings.length === 0 ? (
          <div className="text-white text-center h-[60vh] flex justify-center items-center">
            No Meetings Found
          </div>
        ) : (
          <div className="space-y-4">
            {[...meetings].reverse().map((meeting) => ( // Avoid mutating the original state by creating a new reversed array.
              <div
                key={meeting.roomId}
                className="bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] border border-zinc-800/50 p-6
                  transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-white/5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{meeting.roomName}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-zinc-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(meeting.roomCreated).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{new Date(meeting.roomCreated).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center text-zinc-400">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{meeting.participants.length} participants</span>
                        <div>
                          <span className="mx-2">•</span>
                          <span>{meeting.participants[0].fullName}</span>
                          <span className="mx-2">•</span>
                          <span>{meeting.participants[1].fullName}</span>
                        </div>
                        <div className='flex flex-col'>
                          <span className='px-2 rounded mx-2 '>RoomId : <span className='text-blue-400'>{meeting.roomId}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                  onClick={()=> handleclick(meeting.roomId) }
                    className="px-4 py-2 text-sm text-white bg-zinc-800 rounded-lg hover:bg-zinc-700
                      transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Meetings;
