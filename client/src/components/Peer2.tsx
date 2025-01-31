import React, { useEffect } from 'react'

function Peer2() {
  const videoRef = React.createRef<HTMLVideoElement>();
  
    useEffect(() => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          videoRef.current!.srcObject = stream;
        })
        .catch(console.error);
    }, [videoRef]);
  
    console.log(videoRef.current?.muted);
  
    return (
          <div  className="h-1/2 bg-gray-800 rounded-lg flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full bg-gray-700 rounded-lg" controls  autoPlay playsInline muted ></video>
          </div> 
    )
}

export default Peer2