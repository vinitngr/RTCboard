import { Excalidraw, MainMenu } from '@excalidraw/excalidraw';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { Github, Save, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRoomStore } from '../store/roomStore';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';

function ExcalidrawCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasElement, setCanvasElement] = useState<ExcalidrawElement[]>([]);
  const { connection, canvasElements } = useRoomStore();
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);

  useEffect(() => {
    console.log("Updated canvasElements", canvasElements);
    excalidrawAPI?.updateScene({ elements: canvasElements || [] });
  }, [canvasElements, excalidrawAPI]);

  const sendData = useCallback(() => {
    if (connection?.dataChannel) {
      connection.dataChannel.send(JSON.stringify({canvasElements: canvasElement, dataType: 'canvas'}));
      console.log("Sent Data", canvasElement);
    }
  }, [canvasElement, connection]);

  useEffect(() => {
    const handleMouseUp = () => {
      if (canvasElement.length > 0) {
        sendData();
      } else {
        console.log("No data to send");
      }
    };

    const currentCanvasRef = canvasRef.current;
    currentCanvasRef?.addEventListener("mouseup", handleMouseUp);

    return () => {
      currentCanvasRef?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvasElement, sendData]);

  return (
    <div className="h-full w-full custom-styles" ref={canvasRef}>
      <Excalidraw
      excalidrawAPI={(api)=> setExcalidrawAPI(api)}
        // key={canvasElements?.length}   //causing remounting but without it convas doents get updated (fix this issue using excalid api as on render excalid component dont remount)
        initialData={{ elements: canvasElements || [] }}
        onChange={(elements: readonly ExcalidrawElement[]) => {
          setCanvasElement(elements as ExcalidrawElement[]);
        }}
        renderTopRightUI={() => (
          <button
            className="bg-blue-500 text-white p-2 rounded-full"
            onClick={() => sendData()}> <Save/> 
          </button> //no use of it now, as it is being handled by mouse up event //use in context menu cases
        )}
        UIOptions={{ tools: { image: false } }}  //have to generate link (using storage) and pass it with link key option in excaclidrawELement
      >
        <MainMenu>
          <MainMenu.DefaultItems.Export />
          <MainMenu.ItemLink href="/" icon={<Github />}>
            Github
          </MainMenu.ItemLink>
          <div className="w-full h-[1px] bg-gray-300 "></div>
          <button className="flex items-center gap-1 m-2" onClick={() => window.location.reload()}>
            <X color="red" size={16} /> Disconnect
          </button>
        </MainMenu>
      </Excalidraw>
    </div>
  );
}

export default ExcalidrawCanvas;
