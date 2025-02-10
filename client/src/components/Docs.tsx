import React, { LegacyRef, useCallback, useEffect, useState } from 'react';
import { Bold, List, Link2, AtSign, Code, X, Save } from 'lucide-react';
import {  ToolbarButton } from '../types/types';
import { useRoomStore } from '../store/roomStore';

function Docs() {
    const { connection, docsElements , roomDetails } = useRoomStore()

    const [selectedColor, setSelectedColor] = useState<string>('black');

    const toolbarButtons: ToolbarButton[] = [
        {  tag: "strong", className : "font-bold", icon: <Bold size={16} /> },
        {  tag: "h1", label: "H1", className: "text-3xl font-bold" },
        {  tag: "h2", label: "H2", className: "text-2xl font-semibold" },
        {  tag: "h3", label: "H3", className: "text-xl font-medium" },
        {  tag: "p", label: "P", className: "text-base" },
        { type: "divider" },
        { title: "•", tag: "ul", icon: <List size={16} />, className: "list-disc pl-5" },
        { type: "divider" },
        { title: "example@gmail.com", tag: "a", icon: <Link2 size={16} />, className: "underline"},
        { title: "@", tag: "cite", icon: <AtSign size={16} />, className: "italic" },
        { tag: "code", icon: <Code size={16} />, className: "bg-gray-200 px-1 py-0.5 rounded text-sm font-mono" },
        { type: "spacer" },
    ];

    const addElement = (tag: keyof JSX.IntrinsicElements, title: string, className = "") => {
        const newRef = React.createRef<HTMLElement>();  
        const newElement = { id: Date.now(), tag, text: title, className, ref: newRef as LegacyRef<HTMLInputElement>, color: selectedColor };
        useRoomStore.setState((state) => ({
            docsElements: { ...state.docsElements, elements: [...state.docsElements.elements, newElement] }
        }))
        setTimeout(() => {
            newRef.current?.focus();
        }, 0); //setTimeout ensures focus runs after React commits updates to the DOM.
    };

    const updateTitle = (newTitle: string) => {
        useRoomStore.setState((state) => ({
            docsElements: { ...state.docsElements, title: newTitle }
        }));
    };

    const removeElement = (id: number) => {
        useRoomStore.setState((state) => ({
            docsElements: {
                ...state.docsElements, elements: state.docsElements.elements.filter((el) => el.id !== id)
            }
        }))
    }
    const sendData = useCallback(() => {
        if (connection?.dataChannel) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const deleteRefsFromArray = docsElements.elements.map(({ ref, ...rest }) => rest);

            connection.dataChannel.send(JSON.stringify({ dataType: "docs", docsElements: { title: docsElements.title, elements: deleteRefsFromArray } }));
            console.log("Sent Data", deleteRefsFromArray);
        }
    }, [connection?.dataChannel, docsElements.elements, docsElements.title]);

    //TODO - getting reversed string on typeing 
    const updateElement = (id: number, text: string = '') => {
        console.log(typeof text);
        useRoomStore.setState((state) => ({
            docsElements: {
                ...state.docsElements, elements: state.docsElements.elements.map((el) =>
                    el.id === id ? { ...el, text } : el
                )
            }
        }))
    };

    // console.log(docsElements);
    useEffect(() => {
        document.onkeydown = () => {
            sendData()
        }
        // const sendDatainterval =setInterval(() => {
        //    sendData()
        // }, 1000); causing issues sometime 
        return () => {
            document.onkeydown = null
            // clearInterval(sendDatainterval)
        }
    })


    return (
        <div className="bg-gray-50 text-black">
            <div className="max-w-4xl mx-auto">
                <input
                    type="text"
                    value={docsElements.title || roomDetails?.roomName}
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
                                    onClick={() => addElement(btn.tag as keyof JSX.IntrinsicElements, btn.title as keyof JSX.IntrinsicElements, btn.className)}
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
                        <input
                            type="text"
                            ref={el.ref}
                            value={el.text}
                            onChange={(e) => updateElement(el.id, e.target.value)}
                            className={`outline-none mb-1 p-1 w-full ${el.className}${
                                el.tag === 'code' ? 'bg-gray-200 px-5 py-5 rounded text-sm font-mono' : ''}`}
                            style={{ color: `${el.tag =='a' ?  'blue' : el?.color}` }}
                        />
                        <button
                            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeElement(el.id)}
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

export default Docs;
