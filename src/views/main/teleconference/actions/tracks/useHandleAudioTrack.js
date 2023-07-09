import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";
import { useSelector } from "react-redux";

//denied granted prompt

export default function useHandleAudioTrack () {
    const [error, setError] = useState(null);
    const [,{setAudioTrack}] = useTeleconference();
    const [microStream, setMicroStream] = useState(null);
    const mode = useSelector(store => store.teleconference.mode);
    const audio = useSelector(store => store.teleconference.audio);

    useEffect(() => {
        if(mode !== 'none' && !microStream && audio)
            (async() => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
                    const [mediaStreamTrack] = stream.getAudioTracks();
                    setAudioTrack(AgoraRTC.createCustomAudioTrack({mediaStreamTrack}))
                    setMicroStream(stream);
                } catch (error) {
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    const findMicro = devices.find(({kind}) => kind === 'audioinput');
                    if(error.code !== 'PERMISSION_DENIED' && !findMicro)
                        setError('microNotFound');
                }
            })();
        if(mode === 'none' && microStream) {
            const tracks = microStream.getTracks();
            tracks.forEach((track) => track.stop());
            setMicroStream(null);
            setAudioTrack(null);
        }
    }, [mode, setAudioTrack, audio, microStream]);
    return error;
} 