import { useEffect, useRef, useState } from 'react';
import { useRoomStore } from '../store/roomStore';

function Peer1() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [negotiationInProgress, setNegotiationInProgress] = useState(false);
  const { createOffer, connection, roomDetails } = useRoomStore();
  useEffect(() => {
    async function playLocalVideo() {
      try {
        const constraints = { video: true, audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
      } catch (error) {
        console.error('Error opening video camera.', error);
      }
    }

    playLocalVideo();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => { track.stop() });
        streamRef.current = null;
      }
    };
  }, [connection]);


  useEffect(() => {
    if (connection && !negotiationInProgress) {
      const handleNegotiationNeeded = async () => {
        console.log('Renegotiation needed');
        setNegotiationInProgress(true);
        if (!roomDetails) return;
        const creatorId = roomDetails.participants[0].userId;
        console.log('Triggering createOffer with creatorId:', creatorId);
        createOffer(creatorId);
      };

      connection.peerConnection.onnegotiationneeded = handleNegotiationNeeded;

      return () => {
        connection.peerConnection.onnegotiationneeded = null;
      };
    }
  }, [connection, roomDetails, createOffer, negotiationInProgress]);

  useEffect(() => {
    if (connection) {
      const handleTrackEvent = (event: RTCTrackEvent) => {
        console.log('getting track');
        const [newRemoteStream] = event.streams;
        setRemoteStream(newRemoteStream);
      };

      connection.peerConnection.ontrack = handleTrackEvent;

      return () => {
        connection.peerConnection.ontrack = null;
      };
    }
  }, [connection]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && remoteStream) {
      videoElement.srcObject = remoteStream;
    }

    return () => {
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, [remoteStream]);


  
  return (
    <div className="h-1/2 bg-gray-800 rounded-lg flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full object-cover h-full bg-gray-700 rounded-lg"
        autoPlay playsInline muted controls
      />
    </div>
  );
}

export default Peer1;
