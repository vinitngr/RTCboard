import { useRoomStore } from "../store/roomStore";
import { useEffect } from "react";
import Peer1 from "../components/Peer1";
import Peer2 from "../components/Peer2";
// import Canva from "../components/Canvas";
import Canvas from "../components/Canvas";
export default function Room() {
  const { roomDetails, exitRoom, connection } = useRoomStore();
  const { setCanvasElement, setDocsElements } = useRoomStore()
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
            setCanvasElement(parsedData.canvasElements)
          }
        };
        channel.onopen = () => console.log('Data channel opened');
        channel.onclose = () => {
          console.log('data channel closed');
          if (connection) {
            connection.peerConnection.close()
            window.location.reload()
          }
          exitRoom(roomDetails?.roomId)
        };
      };
      connection.peerConnection.ondatachannel = dataChannelHandler;
    }

    return () => {
      if (connection) {
        connection.peerConnection.ondatachannel = null
      }
    }
  }, [connection, exitRoom, roomDetails?.roomId, setCanvasElement, setDocsElements]);

  return (
    <div className="flex h-screen text-white p-6 gap-6" style={{ 'backgroundColor': 'white' }}>
      <div className="flex flex-col gap-4">
        <Peer1 />
        <Peer2 />
      </div>
      <Canvas />
    </div>
  );
}