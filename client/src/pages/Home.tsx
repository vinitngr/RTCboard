import { LogIn, PlusCircle } from "lucide-react";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import { useState } from "react";
function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  return (
    <div className="bg-zinc-950 flex flex-col items-center justify-center flex-grow  p-6 relative">
      <div className="relative bg-zinc-900/50 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] border border-zinc-800/50 p-8">
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-400/10 to-zinc-300/10 transform rotate-12 rounded-3xl blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-500/10 to-zinc-400/10 rounded-3xl blur-2xl" />
        
        <div className="flex gap-4 mb-8 relative z-10">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
              ${activeTab === 'create' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <PlusCircle className="w-5 h-5" />
            Create Room
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
              ${activeTab === 'join' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <LogIn className="w-5 h-5" />
            Join Room
          </button>
        </div>
      

        <div className="w-[30vw] mx-auto px-6 space-y-8">
          {activeTab === 'create' && <CreateRoom />}
          {activeTab === 'join' && <JoinRoom />}
        </div>
      </div>
    </div>
  );
}


export default Home;
