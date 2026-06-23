import { useRoomStore } from "../store/roomStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Peer1 from "../components/Peer1";
import Peer2 from "../components/Peer2";
// import Canva from "../components/Canvas";
import Canvas from "../components/Canvas";
export default function Room() {
  const { roomDetails, exitRoom, connection, cleanupRoom } = useRoomStore();
  const { setCanvasElements, setDocsElements } = useRoomStore()
  const navigate = useNavigate();
  
  useEffect(() => {
    // Cleanup on unmount (when navigating away)
    return () => {
      if (roomDetails) {
        exitRoom(roomDetails.roomId);
        cleanupRoom();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (connection) {
      const dataChannelHandler = (event: RTCDataChannelEvent) => {
        const channel = event.channel;
        channel.onmessage = ({ data }) => {
          const parsedData = JSON.parse(data)
          console.log('Received message', data);
          if (parsedData.dataType === 'docs') {
            setDocsElements(parsedData.docsElements)
          } else {
            setCanvasElements(parsedData.canvasElements)
          }
        };
        channel.onopen = () => console.log('Data channel opened');
        channel.onclose = () => {
          console.log('data channel closed');
          exitRoom(roomDetails?.roomId);
          cleanupRoom();
          navigate('/home');
        };
      };
      connection.peerConnection.ondatachannel = dataChannelHandler;
    }

    return () => {
      if (connection) {
        connection.peerConnection.ondatachannel = null
      }
    }
  }, [connection, exitRoom, roomDetails?.roomId, setCanvasElements, setDocsElements, cleanupRoom, navigate]);

  return (
    <div className="flex h-screen text-white p-6 gap-6" style={{ 'backgroundColor': 'white' }}>
      <div className="flex flex-col gap-4 w-[20%]">
        <Peer1 />
        <Peer2 />
      </div>
      <Canvas />
    </div>
  );
}