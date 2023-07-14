import { useLayoutEffect } from "react";
import { useSocket } from "../../../../utils/SocketIOProvider";
import { useData } from "../../../../utils/DataProvider";
import { useDispatch, useSelector } from "react-redux";
import { setCameraData, setData, setMicroData } from "../../../../redux/meeting";
import { useMeetingData } from "../../../../utils/MeetingProvider";
import clearTimer from "../../../../utils/clearTimer";
;

export default function useJoin(callState, setCallState) {
    const [{videoStreamRef, audioStreamRef}] = useData();
    const [{localTrackRef, ringRef, timerRef}] = useMeetingData();
    ///const mode = useSelector(store => store.meeting.)
    const joined = useSelector(store => store.meeting.joined);
    const micro = useSelector(store => store.meeting.micro);
    const camera = useSelector(store => store.meeting.camera);
    const socket = useSocket();
    const [{client}] = useData();
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        const handleUserJoin = async () => {
            clearTimer(timerRef.current);
            ringRef.current?.clearAudio();
            if(callState === 'ringing') {
                const streams = [];
                const localAudioTrack = localTrackRef.current.audioTrack;
                const localVideoTrack = localTrackRef.current.videoTrack;
                dispatch(setData({
                    data : { mode: joined ? 'on' : 'join' }
                }));
                if(micro.active && audioStreamRef.current && !micro.published && localAudioTrack) 
                    streams.push(localAudioTrack);
                if(camera.active && videoStreamRef.current && !camera.published && localVideoTrack)
                    streams.push(localVideoTrack);
                if(streams.length && joined)
                    await client.publish(streams);
                if(localAudioTrack)
                    dispatch(setMicroData({data: { published: true }}));
                if(localVideoTrack)
                    dispatch(setCameraData({data: { published: true }}));
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
        camera,
        micro,
        localTrackRef, 
        ringRef, 
        timerRef,
        client,
        joined,
        dispatch
    ]);

}