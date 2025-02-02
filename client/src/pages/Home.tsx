import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import { PeerConnection } from "../lib/rtc";
function Home() {
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="md:flex-row flex flex-col items-center gap-5 justify-center">
          <CreateRoom/>
          <JoinRoom/>
        </div>
      </div>
    </div>
  );
}

export default Home;
