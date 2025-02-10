import React, { useCallback, useEffect, useState } from 'react';
import { Bold, List, Link2, AtSign, Code, X, Save } from 'lucide-react';
import { Element, ToolbarButton } from '../types/types';
import { useRoomStore } from '../store/roomStore';

function App() {
    const {connection , docsElements  , roomDetails } = useRoomStore()

    const [content, setContent] = useState({
        title: roomDetails?.roomName || '',
        elements: [] as Element[],
    });
    
    const [selectedColor, setSelectedColor] = useState<string>('black');

    const toolbarButtons: ToolbarButton[] = [
        { title: "Bold", tag: "strong", icon: <Bold size={16} /> },
        { title: "Heading 1", tag: "h1", label: "H1", className: "text-3xl font-bold" },
        { title: "Heading 2", tag: "h2", label: "H2", className: "text-2xl font-semibold" },
        { title: "Heading 3", tag: "h3", label: "H3", className: "text-xl font-medium" },
        { title: "Paragraph", tag: "p", label: "P", className: "text-base" },
        { type: "divider" },
        { title: "•", tag: "ul", icon: <List size={16} />, className: "list-disc pl-5" },
        { type: "divider" },
        { title: "Link", tag: "a", icon: <Link2 size={16} />, className: "text-blue-600 underline", defaultText: "Click here" },
        { title: "Reference", tag: "cite", icon: <AtSign size={16} />, className: "italic" },
        { title: "Code", tag: "code", icon: <Code size={16} />, className: "bg-gray-200 px-1 py-0.5 rounded text-sm font-mono" },
        { type: "spacer" },
    ];

    const addElement = (tag: keyof JSX.IntrinsicElements, title: string, className = "", defaultText = title) => {
        const newRef = React.createRef<HTMLElement>();
        const newElement = { id: Date.now(), tag, text: defaultText, className, ref: newRef, color: selectedColor };
        setContent((prev) => ({ ...prev, elements: [...prev.elements, newElement] }));
        useRoomStore.setState((state) => ({
            docsElements: { ...state.docsElements, elements: [...state.docsElements.elements, newElement] }
        }))
        setTimeout(() => {
            newRef.current?.focus();
        }, 0);
    };

    const updateTitle = (newTitle: string) => {
        setContent((prev) => ({ ...prev, title: newTitle }));
        
        useRoomStore.setState((state) => ({
            docsElements: { ...state.docsElements, title: newTitle }
        }));
    };
    
    // useEffect(() => {
    //     // setContent((prev) => ({ ...prev ,elements: docsElements }));
    // }, [docsElements]);
    

    const sendData = useCallback(() => {
        if (connection?.dataChannel) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const deleteRefsFromArray = content.elements.map(({ ref, ...rest }) => rest);
    
            connection.dataChannel.send(JSON.stringify({ dataType : "docs" ,docsElements: { title : content.title , elements :deleteRefsFromArray}}));
            console.log("Sent Data", deleteRefsFromArray);
        }
    }, [content, connection]);  
    

    const updateElement = (id: number, text: string) => {
        setContent((prev) => ({
            ...prev,
            elements: prev.elements.map((el) =>
                el.id === id ? { ...el, text } : el
            ),
        }));
    };
    
    // const removeElement = (id: number) => {
    //     setContent((prev) => {
    //         const updatedElements = prev.elements.filter((el) => el.id !== id);
            
    //         // Sync changes with store
    //         useRoomStore.setState({ docsElements: { elements : updatedElements , title : content.title} });
    
    //         return { ...prev, elements: updatedElements };
    //     });
    // };
    
    console.log(content);

    useEffect(()=>{
        document.onkeydown = () => {
            sendData()
        }
        return () => {
            document.onkeydown = null
        }
    })
    return (
        <div className="bg-gray-50 text-black">
            <div className="max-w-4xl mx-auto">
            <input
                type="text"
                value={docsElements.title}
                onChange={(e) => updateTitle(e.target.value)}
                placeholder="Title"
                className="w-full px-3 py-2 text-xl font-semibold border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

                <div className="rounded-md bg-white">
                    <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-200 flex-wrap">
                        {toolbarButtons.map((btn, index) => {
                            if (btn.type === "divider") return <div key={index} className="w-px h-4 bg-gray-300 mx-1" />;
                            if (btn.type === "spacer") return <div key={index} className="flex-grow" />;
                            return (
                                <button
                                    key={index}
                                    className="p-1 hover:bg-gray-100 rounded"
                                    title={btn.title}
                                    onClick={() => addElement(btn.tag as keyof JSX.IntrinsicElements, btn.title as keyof JSX.IntrinsicElements, btn.className, btn.defaultText)}
                                >
                                    {btn.icon || btn.label}
                                </button>
                            );
                        })}

                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-full bg-gray-500 text-white selection:border-2 focus:border-4 border-gray-300" onClick={() => setSelectedColor('gray')}></button>
                            <button className="p-2 rounded-full bg-red-500 text-white focus:border-4 border-red-300" onClick={() => setSelectedColor('red')}></button>
                            <button className="p-2 rounded-full bg-black text-white focus:border-4 border-gray-700" onClick={() => setSelectedColor('black')}></button>
                        </div>
                    </div>

                    <div className="px-4 py-3 h-[430px] overflow-y-scroll">
                        {docsElements.elements.map((el) => (
                            <div key={el.id} className="relative group flex items-center gap-2">
                                {
                                    React.createElement(
                                    el.tag,
                                    {
                                        ref: el.ref,
                                        contentEditable: true,
                                        suppressContentEditableWarning: true,
                                        className: `outline-none mb-1 p-1 w-full ${el.className} ${el.tag === 'a' ? "cursor-pointer" : ""} ${el.tag === 'code' ? "bg-gray-200 px-5 py-5 rounded text-sm font-mono" : ""}`,
                                        onClick: el.tag === 'a' ? () => window.open(el.text, '_blank') : undefined,
                                        onInput: (e: React.FormEvent<HTMLDivElement>) => updateElement(el.id, e.currentTarget.innerText),
                                        style: { color: el?.color },
                                    },
                                    el.text
                                )}
                                <button
                                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    // onClick={() => removeElement(el.id)}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        <div 
                            title='Save to populate changes on user2'
                            onClick={sendData}
                            className='absolute bottom-4 right-8 bg-blue-500 text-white p-2 rounded-full'
                        >
                            <Save />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
