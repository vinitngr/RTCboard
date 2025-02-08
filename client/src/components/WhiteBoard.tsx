import { Excalidraw } from "@excalidraw/excalidraw";

function WhiteBoard() {
    return (
      <div className="bg-black">
        <div className="h-full w-[70vw]">
          <Excalidraw />
        </div>
      </div>
    );
  }

export default WhiteBoard