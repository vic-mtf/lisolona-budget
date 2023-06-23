import { createContext, useContext, useMemo, useRef, useState } from "react"
import AgoraRTC from 'agora-rtc-sdk-ng';

const Data = createContext();
export const useData = () => useContext(Data);

export default function DataProvider({children}) {
    const [db, setDataBases] = useState(null);
    const messagesRef = useRef({});
    const downloadsRef = useRef([]);
    const voicesRef = useRef([]);
    const videosRef = useRef([]);
    const audioStreamRef = useRef(null);
    const videoStreamRef = useRef(null);

    const client = useMemo(() => 
        AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    , []);

    const pushMessages = ({id, messages, total}) => messagesRef.current[id] = {messages, total};
    
    const values = [
        {
            messagesRef, 
            downloadsRef, 
            voicesRef, 
            videosRef,
            audioStreamRef,
            videoStreamRef,
            client,
            db
        },
        {
            pushMessages, 
            setDataBases
        }
    ];
    return (<Data.Provider value={values}>{children}</Data.Provider>)
}