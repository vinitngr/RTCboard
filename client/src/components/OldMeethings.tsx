import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { useRoomStore } from "../store/roomStore";

function OldMeethings() {
  const { roomId } = useParams(); 
  const {getMeetingData  , selectedMeetingData } = useRoomStore()
  const datafetched = useRef(false)
  
  useEffect(() => {
    if (!roomId || datafetched.current) return;
    getMeetingData(roomId)
    datafetched.current = true
  }, [getMeetingData, roomId]);

  return (
    <div className="flex h-screen w-screen">
      <div className="w-1/2 border-r-2 border-gray-300 flex justify-center items-center">
        {selectedMeetingData && <Excalidraw initialData={{ elements: JSON.parse(selectedMeetingData.canvasData) || []}} />}
      </div>
      <div className="w-1/2 flex justify-center items-center">
        docs data
      </div>
    </div>
  );
}

export default OldMeethings;
