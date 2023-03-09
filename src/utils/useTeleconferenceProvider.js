import AgoraRTC from "agora-rtc-sdk-ng";
import { 
    createContext, 
    useCallback, 
    useContext, 
    useEffect, 
    useMemo, 
    useState 
} from "react";
import conSong from '../assets/ton-mobi.mp3';
import { useSelector } from "react-redux";
//import agoraOptionsTest from '../configs/agora-options.test.json';

const Teleconference = createContext(null);
export const useTeleconference = () => useContext(Teleconference);

export default function TeleconferenceProvider ({children, options: initOpts}) {
    const [options, setOptions] = useState(initOpts);
    const [pickedUp, setPickedUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('calling');
    const {userId, type} = useSelector(store => {
        const userId = store.user.id;
        const type = store.teleconference?.type;
        return {userId, type};
    });
    const isCompatible = useMemo(() => AgoraRTC.checkSystemRequirements(), []);
    const agoraEngine = useMemo(() => AgoraRTC.createClient({ 
            mode: "rtc", 
            codec: "vp8" 
        }), []
    );
    const [calls, setCalls] = useState([]);
    const handelJoinChannel = useCallback(async() => {
        if(isCompatible) { 
        // Join a channel.
        const user = {};
        if(options && pickedUp) {
            setLoading(true);
            await agoraEngine.join(
                options?.appId, 
                options?.channel, 
                options?.token, 
                userId,
            );
            user.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            user.videoTrack = await AgoraRTC.createCameraVideoTrack();
            user.videoTrack?.setEnabled(type === 'video');
            user.uid = userId;
        };
        if(user?.audioTrack && user?.videoTrack) {
            await agoraEngine.publish([
                user.audioTrack, 
                user.videoTrack
            ]);
            setCalls([user, {}]);
            setLoading(false);
        }
        }
    }, [pickedUp, options, userId, type, agoraEngine, isCompatible]);
    const values = { 
        agoraEngine, calls, pickedUp, options, 
        setOptions, setPickedUp, isCompatible, 
        loading, status, setStatus
    };
    useEffect(() => {
    handelJoinChannel();
    }, [handelJoinChannel]);

    useEffect(() => {
        const handleUserPublished = async (user, mediaType) => {
            // Subscribe to the remote user when the SDK triggers the "user-published" event.
            await agoraEngine.subscribe(user, mediaType);
            if (mediaType === "video")
                    setCalls(calls => {
                        const index = calls.findIndex(({uid}) => 
                            uid === user?.uid || uid === undefined
                        );
                        const clients = [...calls];
                        if(index > -1)
                            clients[index] = user;
                        else clients.push(user);
                        return clients;
                    });
            // Subscribe and play the remote audio track If the remote user publishes the audio track only.
            if (mediaType === "audio") {
                user.audioTrack.play();
                setCalls(calls => {
                    const index = calls.findIndex(({uid}) => 
                        uid === user?.uid || uid === undefined
                    );
                    const clients = [...calls];
                    if(index > -1)
                        clients[index] = user;
                    else clients.push(user);
                    return clients;
                });
            }  
        }
        const handleUserUnPublished = user => {
            //console.log(user.uid+ "has left the channel");
        }
        agoraEngine.on('user-published', handleUserPublished);
        agoraEngine.on('user-unpublished', handleUserUnPublished);
        return () => {
            agoraEngine.off('user-published', handleUserPublished);
            agoraEngine.off('user-unpublished', handleUserUnPublished);
        }

    },[calls, agoraEngine]);

    useEffect(() => {
        const handleUserLeft = user =>  {
            setCalls(calls => 
                [...calls].filter(({uid}) => uid !== user.uid)
            );
        };
        agoraEngine.on('user-left', handleUserLeft);
        return () => {
            agoraEngine.off('user-left', handleUserLeft);
        }
    }, [agoraEngine]);

    useEffect(() => {
        const audio = new Audio();
        if(calls.length === 1 && pickedUp)
            audio.src = conSong;
        audio.autoplay = true;
    },[calls, pickedUp]);

   return (
    <Teleconference.Provider value={values}>{children}</Teleconference.Provider>
   )
   
}