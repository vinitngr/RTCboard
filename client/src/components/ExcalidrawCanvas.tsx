import { Excalidraw, MainMenu } from '@excalidraw/excalidraw';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { Github, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useRoomStore } from '../store/roomStore';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';

function ExcalidrawCanvas() {
  const [canvasElement, setCanvasElement] = useState<ExcalidrawElement[]>([]);
  const { connection, canvasElements } = useRoomStore();
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);

  useEffect(() => {
    console.log("Updated canvasElements", canvasElements);
    excalidrawAPI?.updateScene({ elements: canvasElements || [] });
  }, [canvasElements, excalidrawAPI]);

  const sendData = useCallback(() => {
    if (connection?.dataChannel) {
      connection.dataChannel.send(JSON.stringify(canvasElement));
      console.log("Sent Data", canvasElement);
    }
  }, [canvasElement, connection]);


  return (
    <div className="h-full w-full custom-styles">
      <Excalidraw
      excalidrawAPI={(api)=> setExcalidrawAPI(api)}
        // key={canvasElements?.length}   //causing remounting but without it convas doents get updated
        // initialData={{ elements: canvasElements || [] }}
        onChange={(elements: readonly ExcalidrawElement[]) => {
          setCanvasElement(elements as ExcalidrawElement[]);
          // if(connection?.dataChannel.readyState === 'open') sendData(); //causing lag
        }}
        renderTopRightUI={() => (
          <button
            className="bg-blue-500 border-none text-white w-max font-bold p-1 rounded"
            onClick={() => sendData()}
          >
            Apply Change
          </button>
        )}
        UIOptions={{ tools: { image: false } }}
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
