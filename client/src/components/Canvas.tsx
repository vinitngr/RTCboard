import { useEffect,  useState } from 'react'
import { useRoomStore } from '../store/roomStore';
import { Check, Copy, FileText, PenTool, Save } from 'lucide-react';
import ExcalidrawCanvas from './ExcalidrawCanvas';
import Docs from './Docs';

function Canvas() {
  const [liveUser, setLiveUser] = useState(0);
  const [copied, setCopied] = useState(false);
  const {  exitRoom, roomDetails , saveRoom } = useRoomStore()
  const [mode, setMode] = useState<'draw' | 'view'>('draw');
  
  useEffect(() => {
    setLiveUser(roomDetails?.participants?.length || 0);
  }, [roomDetails]);

  const copyRoomId = async () => {
      await navigator.clipboard.writeText(roomDetails?.roomId || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () =>{
    if(roomDetails && roomDetails?.participants.length < 2){
      console.log('Peer 2 required to save');
      return
    }
    saveRoom()
    exitRoom(roomDetails?.roomId)
  }

  return (
    <div className="flex flex-col w-2/3 gap-4 flex-grow" >
      <div className="flex items-center justify-between gap-2 ">
        <div className="flex items-center gap-2">

          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg">
            <span className="text-sm text-gray-600">Room ID:</span>
            <code className="font-mono font-medium text-indigo-600">{roomDetails?.roomId}</code>
            <button
              onClick={copyRoomId}
              className="ml-2  hover:bg-gray-200  transition-colors "
              title="Copy Room ID"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <div className="text-sm text-gray-600 pl-2 border-l-2" >Users : {liveUser}</div>
            <div className="text-sm text-gray-600 pl-2 border-l-2">
              Room Name : {roomDetails?.roomName}
            </div>
          </div>

        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
          title='save and Disconnect'
          className=' bg-red-600 gap-2 mr-4 left-6 bottom-2 flex text-white p-2 rounded-lg'
          onClick={handleSave}
          >
            <Save size={18}/>
          </button>
          <button
            onClick={() => setMode('draw')}
            className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-all ${mode === 'draw'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <PenTool className="size-4" />
          </button>
          <button
            onClick={() => setMode('view')}
            className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-all ${mode === 'view'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <FileText className="size-4" />
          </button>
        </div>
      </div>
      {mode === 'draw' ? 
        <ExcalidrawCanvas/> : <Docs/>
      }
    </div>
  )
}

export default Canvas