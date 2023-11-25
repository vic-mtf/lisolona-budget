import { useLayoutEffect } from "react";
import { useSocket } from "../../../../utils/SocketIOProvider";
import { useData } from "../../../../utils/DataProvider";
import { setData } from "../../../../redux/meeting";
import { findUser, useMeetingData } from "../../../../utils/MeetingProvider";
import clearTimer from "../../../../utils/clearTimer";
import store from "../../../../redux/store";

export default function useJoin(callState, setCallState) {
    const [{videoStreamRef, audioStreamRef}] = useData();
    const [{localTrackRef, ringRef, timerRef}] = useMeetingData();
    const socket = useSocket();
    const [{client}] = useData();

    useLayoutEffect(() => {
        const handleUserJoin = async ({who}) => {
            const userId = store.getState().user.id;
            if(findUser(who._id) && who._id !== userId) {
                clearTimer(timerRef.current);
                ringRef.current?.clearAudio();
                if(callState === 'ringing') {
                    const tracks = [];
                    const localAudioTrack = localTrackRef.current.audioTrack;
                    const localVideoTrack = localTrackRef.current.videoTrack;
                    const {micro, camera, joined} = store.getState().meeting;
                    
                    const data = { mode: 'on', joined: true};
                    store.dispatch(setData({data}))
                    if(micro.active && !micro.published) {
                        tracks.push(localAudioTrack);
                        data.micro = {published: true};
                    }
                    if(camera.active && !camera.published) {
                        tracks.push(localVideoTrack);
                        data.camera = {published: true};
                    }
                    if(tracks.length && joined) {
                        await client.publish(tracks);
                        store.dispatch(setData({data}));
                    }
                        
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