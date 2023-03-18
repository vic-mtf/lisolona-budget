import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import AgoraRTC from "agora-rtc-sdk-ng";
import { useDispatch, useSelector } from "react-redux";
import { addTeleconference } from "../redux/teleconference";

const Teleconference = createContext(null);
export const useTeleconference = () => useContext(Teleconference);
const AGORA_PARAMS = {
    codec: 'vp8', 
    mode: 'rtc'
};

export default function TeleconferenceProvider ({children}) {
    const [stream, setStream] = useState(null);
    const [displayStream, setDisplayStream] = useState(null);
    const [participants, setParticipants] = useState([]);
    const {id, options, mediaType} = useSelector(store => {
        const options = store.teleconference?.options;
        const mediaType = store.teleconference?.mediaType;
        const id = store.user?.id;
        return {id, options, mediaType};
    });
    const tracksRef = useRef(null);
    const dispatch = useDispatch();
    const audio = useMemo(() => new Audio() ,[]);
    const localTracks = useMemo(() => {
        let tracks = null;
        if(stream) {
           const [streamVideoTrack] = stream.getVideoTracks();
           const [streamAudioTrack] = stream.getAudioTracks();
           const videoTrack = AgoraRTC.createCustomVideoTrack({
            mediaStreamTrack: streamVideoTrack,
           });
           const audioTrack = AgoraRTC.createCustomAudioTrack({
            mediaStreamTrack: streamAudioTrack,
           });
           tracks = {
            uid: id,
            videoTrack,
            audioTrack
           };
        }
        return tracks;
    }, [stream, id]);
    
    const agoraEngine = useMemo(() => {
        let agoraClient = null;
        if(stream) 
            agoraClient = AgoraRTC.createClient(AGORA_PARAMS);
        return agoraClient;
    }, [stream]);

    const handleJoinChannel = useCallback(async (calback) => {
        if(options && stream) {
            const {appId, channel, channelToken} = options;
            let status;
            dispatch(addTeleconference({
                key: 'loading',
                data: true,
            }));
            try {
                await agoraEngine.join(appId, channel, channelToken, id);
                status = 'success';
                dispatch(addTeleconference({
                    key: 'joined',
                    data: true,
                }));
            } catch (error) {
                dispatch(addTeleconference({
                    key: 'date',
                    data: {loading: false, error: 'call'}
                }));
                status = 'error';
            }
            if(typeof calback === 'function')
                calback(status, agoraEngine);
            
        }
    }, [options, id, agoraEngine, dispatch, stream]);

    const handlePublishLocalTracks =  useCallback(async () => {
        if(stream) {
            dispatch(addTeleconference({key: 'loading', data: true}));
            try {
                const tracks = [
                    mediaType === 'video' && localTracks?.videoTrack,
                    localTracks?.audioTrack
                ].filter(track => track);
                await agoraEngine.publish(tracks);
            } catch (error) {
                dispatch(addTeleconference({key: 'error', data: 'call'}));
            }
            dispatch(addTeleconference({key: 'loading', data: false}));
        }
    },[localTracks, agoraEngine, dispatch, addTeleconference, stream, mediaType]);

    const getters = {
        stream, 
        localTracks, 
        participants,
        audio,
        agoraEngine,
        displayStream,
        tracksRef
    };
    const setters = {
        setStream, 
        setParticipants, 
        handleJoinChannel,
        handlePublishLocalTracks,
        setDisplayStream,
    };

    return (
        <Teleconference.Provider 
            value={[getters, setters]}
        >
          {children}
        </Teleconference.Provider>
    )
};
