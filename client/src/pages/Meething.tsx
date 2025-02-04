import { Calendar, Clock, Users, Video } from 'lucide-react';

function Meetings() {
  const meetings = [
    {
      id: 1,
      name: 'Product Design Review',
      date: '2024-03-15',
      time: '10:00 AM',
      duration: '1h 30m',
      participants: 8,
      type: 'Video Conference'
    },
    {
      id: 2,
      name: 'Team Sprint Planning',
      date: '2024-03-14',
      time: '2:00 PM',
      duration: '1h',
      participants: 12,
      type: 'Video Conference'
    },
    {
      id: 3,
      name: 'Client Presentation',
      date: '2024-03-13',
      time: '11:30 AM',
      duration: '45m',
      participants: 5,
      type: 'Video Conference'
    }
  ];

  return (
    <div className="flex flex-col flex-grow">
      <div className="w-[50vw] mx-auto mt-10">
        <h2 className="text-2xl font-bold text-white mb-6">Meeting History</h2>
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] border border-zinc-800/50 p-6
                transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-white/5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{meeting.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-zinc-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{meeting.date}</span>
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{meeting.time}</span>
                      <span className="mx-2">•</span>
                      <span>{meeting.duration}</span>
                    </div>
                    <div className="flex items-center text-zinc-400">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{meeting.participants} participants</span>
                      <span className="mx-2">•</span>
                      <Video className="w-4 h-4 mr-2" />
                      <span>{meeting.type}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="px-4 py-2 text-sm text-white bg-zinc-800 rounded-lg hover:bg-zinc-700
                    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Meetings