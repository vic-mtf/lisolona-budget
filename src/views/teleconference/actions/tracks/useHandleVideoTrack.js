import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import { useTeleconference } from "../../../../utils/TeleconferenceProvider";
import { useSelector } from "react-redux";

//denied granted prompt

export default function useHandleVideoTrack () {
    const [error, setError] = useState();
    const [{localTracks, agoraEngine},{setVideoTrack}] = useTeleconference();
    const [stream, setStream] = useState();
    const {mode, video, isNotScreenSharing} = useSelector(store => {
        const mode = store.teleconference.meetingMode;
        const video = store.teleconference.video;
        const isNotScreenSharing = !store.teleconference.screenSharing;
        return {mode, video, isNotScreenSharing};
    });

    useEffect(() => {
        if(mode !== 'none' && !localTracks?.videoTrack && video)
            (async() => {
                try {
                    const videoTrack = await AgoraRTC.createCameraVideoTrack({
                        encoderConfig: {
                            height: {ideal: window.innerHeight},
                            width: {ideal: window.innerWidth},
                        }
                    });
                    const mediaStream = new MediaStream([videoTrack.getMediaStreamTrack()]);
                    setVideoTrack(videoTrack);
                    setStream(mediaStream);
                    
                } catch (error) {
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    const findCamera = devices.find(({kind}) => kind === 'videoinput');
                    if(error.code !== 'PERMISSION_DENIED' && !findCamera)
                        setError('cameraNotFound');
                }
            })();
        if(mode === 'none' && stream) {
            const videoTrack = localTracks.videoTrack;
            videoTrack?.stop();
            videoTrack?.close();
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            setVideoTrack(null);
            setStream(null)
        }
    }, [mode, localTracks, setVideoTrack, video, agoraEngine, stream]);

    useEffect(() => {
        const videoTrack = localTracks?.videoTrack;
        const notFoundTrack = !agoraEngine?.localTracks.find(
            ({trackMediaType}) => trackMediaType === 'video'
        );
            if(mode === 'on' && videoTrack && notFoundTrack && isNotScreenSharing && video)
                (async () => await agoraEngine.publish(videoTrack))();
    },[mode, localTracks, agoraEngine, video, isNotScreenSharing])

    return error;
} 