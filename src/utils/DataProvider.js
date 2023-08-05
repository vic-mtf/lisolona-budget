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
    const screenStreamRef = useRef(null);
    const videoStreamRef = useRef(null);
    const mediaStreamRef = useRef(null);
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
            screenStreamRef,
            mediaStreamRef,
            secretCodeRef,
            client,
            streams: [
                audioStreamRef,
                videoStreamRef,
                screenStreamRef,
                mediaStreamRef
            ],
        },
        {
            pushMessages, 
        }
    ];
    return (<Data.Provider value={values}>{children}</Data.Provider>)
}