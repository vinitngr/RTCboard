import { useEffect, useRef } from 'react'
function Peer1() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function playVideoFromCamera() {
      try {
          const constraints = {'video': true, 'audio': true};
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
      } catch(error) {
          console.error('Error opening video camera.', error);
      }
    }

    playVideoFromCamera();
  })
  return (
    <div
      className="h-1/2 bg-gray-800 rounded-lg flex items-center justify-center">
      <video  
        ref={videoRef} 
        className='w-full object-cover h-full bg-gray-700 rounded-lg'
        autoPlay playsInline muted controls >ddsfsgdsgads</video>
    </div>
  )
} 

export default Peer1