import React, { useEffect } from 'react'
function Peer1() {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function getStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current!.srcObject = stream;
      } catch (error) {
        console.error(error);
      }
    }
    getStream();
  }, []);

  console.log(videoRef.current?.muted);

  return (
        <div  className="h-1/2 bg-gray-800 rounded-lg flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full bg-gray-700 rounded-lg" controls  autoPlay playsInline muted ></video>
        </div> 
  )
}

export default Peer1