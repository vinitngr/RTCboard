import { Mail, Calendar } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

function Profile() {

  const {authUser} = useAuthStore();


  return (
    <div className="flex flex-col flex-grow">
      <div className=" mx-auto w-[50vw] mt-10 bg-[#101013]">
        
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] border border-zinc-800/50 overflow-hidden">
          
          <div className="px-8 pt-8 pb-6">
            
            <div className="flex items-center space-x-6">
              <img
                src={authUser?.profilepic}
                alt={authUser?.fullName}
                className="w-24 h-24 rounded-full border-4 border-zinc-800"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">{authUser?.fullName}</h1>
                <p className="text-zinc-400">{authUser?.profession || 'unspecified'}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800/50 px-8 py-6 space-y-4">
            <div className="flex items-center space-x-3 text-zinc-300">
              <Mail className="w-5 h-5 text-zinc-400" />
              <span>{authUser?.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-zinc-300">
              <Calendar className="w-5 h-5 text-zinc-400" />
              <span>
                Joined {authUser?.createdAt ? new Date(authUser?.createdAt).toLocaleString('us-en', { month: 'long', day: 'numeric' }) : 'UnKnown'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile