import { useParams } from "react-router-dom";
import { Key, LegacyRef, useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { useRoomStore } from "../store/roomStore";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";

function OldMeethings() {
  const { roomId } = useParams();
  const { getMeetingData, selectedMeetingData } = useRoomStore()
  const datafetched = useRef(false)
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);


  useEffect(() => {
    if (!roomId || datafetched.current) return;
    getMeetingData(roomId)
    excalidrawAPI?.updateScene({ elements: selectedMeetingData && JSON.parse(selectedMeetingData.canvasData) || [] });
    if (selectedMeetingData) console.log(JSON.parse(selectedMeetingData.canvasData), JSON.parse(selectedMeetingData.docsData));
    datafetched.current = true
  }, [excalidrawAPI, getMeetingData, roomId, selectedMeetingData]);

  return (
    <div className="flex h-screen gap-1 w-screen">
      <div className="w-1/2 border-gray-300 flex justify-center items-center">
        {selectedMeetingData && <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={{ elements: JSON.parse(selectedMeetingData.canvasData) || [] }} />}
      </div>
      <div className="w-1/2 flex justify-center text-white items-center">
        <div className="bg-gray-50 w-full h-full p-5    text-black">
          {
            selectedMeetingData?.docsData && (
              <div>
                <input
                  type="text"
                  value={JSON.parse(selectedMeetingData?.docsData).title || ''}
                  placeholder="Title"
                  className="w-full px-3 py-2 text-xl font-semibold border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <div className="rounded-md bg-white">

                  <div className="px-4 py-3 h-[430px] overflow-y-scroll">
                    {JSON.parse(selectedMeetingData?.docsData).elements.map((el: { id: Key | null | undefined; text: string | number | readonly string[] | undefined; ref: LegacyRef<HTMLInputElement> | undefined; className: string; tag: string; color: string | (string & {}) | undefined; }) => (
                      <div key={el.id} className="relative group flex items-center gap-2">
                        <input
                          type="text"
                          value={el.text}
                          ref={el.ref}
                          className={`outline-none mb-1 p-1 w-full ${el.className} ${el.tag === "code" ? "bg-gray-200 px-5 py-5 rounded text-sm font-mono" : ""
                            }`}
                          style={{ color: el.tag === "a" ? "blue" : el?.color }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default OldMeethings;
