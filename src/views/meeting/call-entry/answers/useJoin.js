import { useLayoutEffect } from "react";
import { useSocket } from "../../../../utils/SocketIOProvider";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useData } from "../../../../utils/DataProvider";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../../../../redux/meeting";
import { useMeetingData } from "../../../../utils/MeetingProvider";
import clearTimer from "../../../../utils/clearTimer";
;

export default function useJoin(callState, setCallState) {
    const [{videoStreamRef, audioStreamRef}] = useData();
    const [{localTrackRef, ringRef, timerRef}] = useMeetingData();
    const joined = useSelector(store => store.meeting.joined);
    const microActive = useSelector(store => store.meeting.micro.active);
    const cameraActive = useSelector(store => store.meeting.camera.active);
    const socket = useSocket();
    const [{client}] = useData();
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        const handleUserJoin = async (e) => {
            clearTimer(timerRef.current);
            ringRef.current?.clearAudio();
            if(callState === 'ringing') {
                dispatch(setData({
                    data : { mode: joined ? 'on' : 'join' }
                }));
                const streams = [];
                if(microActive && audioStreamRef.current) {
                    const audioTracks = audioStreamRef.current.getAudioTracks();
                    const [mediaStreamTrack] = audioTracks;
                    const localAudioTrack = AgoraRTC.createCustomAudioTrack({ mediaStreamTrack })
                    localTrackRef.current.audioTrack =  localAudioTrack;
                    streams.push(localAudioTrack);
                }
    
                if(cameraActive && videoStreamRef.current) {
                    const videoTracks = videoStreamRef.current.getVideoTracks();
                    const [mediaStreamTrack] = videoTracks;
                    const localVideoTrack = AgoraRTC.createCustomVideoTrack({ mediaStreamTrack })
                    localTrackRef.current.videoTrack =  localVideoTrack;
                    streams.push(localVideoTrack);
                }
                if(streams.length && joined)
                    await client.publish(streams);
            }
        };
        socket.on('join', handleUserJoin);
        return () => {
            socket.off('join', handleUserJoin);;
        };
    }, [
        socket, 
        callState, 
        setCallState, 
        videoStreamRef, 
        audioStreamRef,
        cameraActive,
        microActive,
        localTrackRef, 
        ringRef, 
        timerRef,
        client,
        joined,
        dispatch
    ]);

}