import { useLayoutEffect } from "react";
import { useSocket } from "../../../../utils/SocketIOProvider";
import { useData } from "../../../../utils/DataProvider";
import { setData } from "../../../../redux/meeting";
import { useMeetingData } from "../../../../utils/MeetingProvider";
import clearTimer from "../../../../utils/clearTimer";
import store from "../../../../redux/store";

export default function useJoin(callState, setCallState) {
    const [{videoStreamRef, audioStreamRef}] = useData();
    const [{localTrackRef, ringRef, timerRef}] = useMeetingData();
    const socket = useSocket();
    const [{client}] = useData();

    useLayoutEffect(() => {
        const handleUserJoin = async () => {
            clearTimer(timerRef.current);
            // ringRef.current?.clearAudio();
            if(callState === 'ringing') {
                const streams = [];
                const localAudioTrack = localTrackRef.current.audioTrack;
                const localVideoTrack = localTrackRef.current.videoTrack;
                const {micro, camera, joined} = store.getState().meeting;
                store.dispatch(setData({
                    data : { mode: joined ? 'on' : 'join' }
                }));
                if(micro.active && !micro.published) 
                    streams.push(localAudioTrack);
                if(camera.active && !camera.published )
                    streams.push(localVideoTrack);
                if(streams.length && joined) {
                    await client.publish(streams);
                    store.dispatch(setData({
                        data: {
                            micro: { published: Boolean(localAudioTrack) },
                            camera: { published: Boolean(localVideoTrack) }
                        }
                    }))
                }
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
        localTrackRef, 
        ringRef, 
        timerRef,
        client
    ]);

}