import { createContext, useContext, useMemo, useRef } from "react"
import AgoraRTC from 'agora-rtc-sdk-ng';

const Data = createContext();
export const useData = () => useContext(Data);

export default function DataProvider({children}) {
    const messagesRef = useRef({});
    const downloadsRef = useRef([]);
    const voicesRef = useRef([]);
    const videosRef = useRef([]);
    const audioStreamRef = useRef(null);
    const videoStreamRef = useRef(null);
    const secretCodeRef = useRef((Date.now() * 100).toString(16));
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
            secretCodeRef,
            client,
        },
        {
            pushMessages, 
        }
    ];
    return (<Data.Provider value={values}>{children}</Data.Provider>)
}