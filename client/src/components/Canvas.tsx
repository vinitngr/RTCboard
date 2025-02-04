import { useEffect, useRef, useState } from 'react'
import { useRoomStore } from '../store/roomStore';
import { Check, Circle, Copy, Eraser, FileText, Minus, PenTool,  Save,  Square, Trash2 } from 'lucide-react';

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [liveUser, setLiveUser] = useState(0);
  const [copied, setCopied] = useState(false);
  const [tool, setTool] = useState('pen');
  const {  exitRoom, roomDetails } = useRoomStore()
  const [mode, setMode] = useState<'draw' | 'view'>('draw');
  useEffect(() => {
    setLiveUser(roomDetails?.participants?.length || 0);
  }, [roomDetails]);

  const copyRoomId = async () => {
      await navigator.clipboard.writeText(roomDetails?.roomId || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  
  return (
    <div className="flex flex-col w-2/3 gap-4">
      <div className="flex items-center justify-between gap-2">
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
            onClick={() => setMode('draw')}
            className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-all ${mode === 'draw'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <PenTool className="size-4" />
            <span>Canvas</span>
          </button>
          <button
            onClick={() => setMode('view')}
            className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-all ${mode === 'view'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <FileText className="size-4" />
            <span>Document</span>
          </button>
        </div>
      </div>
      {mode === 'draw' ? (
        <>
          <div className="flex space-x-2 justify-between text-black">
            <div>
              <button
                onClick={() => setTool('pen')}
                className={`p-2 rounded ${tool === 'pen' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
              >
                <PenTool className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTool('rectangle')}
                className={`p-2 rounded ${tool === 'rectangle' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
              >
                <Square className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTool('circle')}
                className={`p-2 rounded ${tool === 'circle' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
              >
                <Circle className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTool('line')}
                className={`p-2 rounded ${tool === 'line' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`p-2 rounded ${tool === 'eraser' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
              >
                <Eraser className="w-5 h-5" />
              </button>
              <button
                className="p-2 rounded hover:bg-gray-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                className="p-2 ml-3 bg-blue-500 rounded text-white hover:bg-blue-700"
              >
                <Save className="w-5 h-5" />
              </button>
            </div>
            <button
               onClick={() => exitRoom(roomDetails?.roomId)}
                className="px-3 py-1.5  bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1"
              >
                <span>Disconnect</span>
              </button>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            className="border border-gray-200 rounded-lg flex-1 w-full"
          />
        </>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className=" space-y-6 text-gray-900 bg-zinc-50 ">
            <h1 className="text-3xl font-bold outline-none p-2" contentEditable contextMenu='vinit' >Document Title</h1>
            <div
              className="prose prose-lg outline-none p-2"
              contentEditable
              onInput={(e) => console.log((e.target as HTMLDivElement).innerText)}
            >
              <p>This is the document view of your canvas. You can add text, headings, and other content here to explain your drawings and collaborate with others.</p>
              <h2>Section 1</h2>
              <p>Add your content here...</p>
              <h2>Section 2</h2>
              <p>Continue with more sections and explanations...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Canvas