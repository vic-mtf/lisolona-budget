import { useLayoutEffect } from "react";
import { useSocket } from "../../../../utils/SocketIOProvider";
import { useData } from "../../../../utils/DataProvider";
import { useDispatch, useSelector } from "react-redux";
import { setCameraData, setMicroData } from "../../../../redux/meeting";
import { useMeetingData } from "../../../../utils/MeetingProvider";
import signal_src from '../../../../assets/ton-mobi.mp3';
import useAudio from "../../../../utils/useAudio";
import store from "../../../../redux/store";

export default function useClientJoin() {
    const [{videoStreamRef, audioStreamRef}] = useData();
    const [{localTrackRef, ringRef, timerRef}] = useMeetingData();
    const signalAudio = useAudio(signal_src);
    const socket = useSocket();
    const [{client}] = useData();
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        const handleUserJoin = async (event) => {
            const streams = [];
            const micro = store.getState().meeting.micro;
            const camera = store.getState().meeting.camera;
            const joined = store.getState().meeting.joined;
            const localAudioTrack = localTrackRef.current.audioTrack;
            const localVideoTrack = localTrackRef.current.videoTrack;
            signalAudio.audio.play();
            if(micro.active && audioStreamRef.current && !micro.published && localAudioTrack) 
                streams.push(localAudioTrack);
            if(camera.active && videoStreamRef.current && !camera.published && localVideoTrack)
                streams.push(localVideoTrack);
            if(streams.length && joined) {
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
        videoStreamRef, 
        audioStreamRef,
        localTrackRef, 
        ringRef, 
        timerRef,
        client,
        dispatch,
        signalAudio
    ]);

}