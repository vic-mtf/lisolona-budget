import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import AgoraRTC from "agora-rtc-sdk-ng";
import { useSelector } from "react-redux";

const Teleconference = createContext(null);
export const useTeleconference = () => useContext(Teleconference);
const AGORA_PARAMS = {codec: 'vp8', mode: 'rtc'};

export default function TeleconferenceProvider ({children}) {
    const [videoTrack, setVideoTrack] = useState(null);
    const [audioTrack, setAudioTrack] = useState(null);
    const [screenVideoTrack, setScreenVideoTrack] = useState(null);
    const [participants, setParticipants] = useState([]);
    const mode = useSelector(store => store.teleconference?.mode);
    const values = useMemo(() => {
        const audio = new Audio();
        const timers = [];
        return {audio, timers};
    }, []);

    const localTracks = useMemo(() => {
        let tracks = {};
        if(videoTrack) tracks.videoTrack = videoTrack;
        if(audioTrack) tracks.audioTrack = audioTrack;
        if(screenVideoTrack) tracks.screenVideoTrack = screenVideoTrack;
        return Object.keys(tracks).length === 0 ? null : tracks;
    }, [videoTrack, audioTrack, screenVideoTrack]);

    const customerIsAvailableing = useMemo(() => Boolean(localTracks), [localTracks]);
    const agoraEngine = useMemo(() => {
        let agoraClient = null;
        if(customerIsAvailableing) { 
            agoraClient = AgoraRTC.createClient(AGORA_PARAMS);
            values.agoraEngine = agoraClient;
        }
        return agoraClient;
    }, [customerIsAvailableing, values]);

    const onLeaveChannel = useCallback(async() => {
        const agoraEngine = values.agoraEngine;
        if(agoraEngine && mode === 'none') {
            await agoraEngine.leave();
            delete values.agoraEngine;
            setParticipants([]);
        }
    }, [values.agoraEngine, setParticipants, mode]);

    const getters = {
        ...values,
        localTracks, 
        participants,
        agoraEngine,
    };
    const setters = {
        setParticipants, 
        setVideoTrack,
        setAudioTrack,
        setScreenVideoTrack,
    };
    
    useEffect(()=> {
        const {timers, audio} = values;
        if(mode === 'on' || mode === 'none') {
            timers.forEach(timer => window.clearTimeout(timer));
            audio.src = null;
            while(timers.length) timers.pop();
        }
        onLeaveChannel();
    }, [mode, values, onLeaveChannel]);

    return (
        <Teleconference.Provider value={[getters, setters]}>
            {children}
        </Teleconference.Provider>
    )
};