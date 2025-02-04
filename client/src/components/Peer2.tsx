import { useEffect, useRef } from 'react';
import { useRoomStore } from '../store/roomStore';

function Peer2() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { connection } = useRoomStore();

  useEffect(() => {
    async function playVideoFromCamera() {
      try {
        const constraints = { video: true, audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
        stream.getTracks().forEach(track => {
          if (connection) {
            connection.peerConnection.addTrack(track, stream);
          }
        });
      } catch (error) {
        console.error('Error opening video camera.', error);
      } 
    } 

    playVideoFromCamera();

    return () => {
      const stream = streamRef.current;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [connection]);

  return (
    <div className="h-1/2 bg-gray-800 rounded-lg flex items-center justify-center">
      <video ref={videoRef} className="w-full object-cover h-full bg-gray-700 rounded-lg" autoPlay playsInline muted controls />
    </div>
  );
}

export default Peer2;
