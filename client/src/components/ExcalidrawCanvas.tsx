import { Excalidraw, MainMenu } from '@excalidraw/excalidraw'
import { Github, X } from 'lucide-react'

function ExcalidrawCanvas() {
    
  return (
    <div className="h-full w-full custom-styles">
        <Excalidraw UIOptions={{
            tools: {
                image : false,
            },
            
        }}>
            <MainMenu>
            <MainMenu.DefaultItems.Export />
            
            <MainMenu.ItemLink href='/' icon={<Github/>}>
                Github
            </MainMenu.ItemLink>
            <div className='w-full h-[1px] bg-gray-300 '></div>
            <button className='flex items-center gap-1 m-2' onClick={()=> window.location.reload()}><X color='red' size={16}/> disconnect</button>
            </MainMenu>
        </Excalidraw>
    </div>
  )
}

export default ExcalidrawCanvas