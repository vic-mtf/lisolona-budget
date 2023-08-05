import { useLayoutEffect } from "react";
import { useSocket } from "../../../../utils/SocketIOProvider";
import { useData } from "../../../../utils/DataProvider";
import { setData } from "../../../../redux/meeting";
import { useMeetingData } from "../../../../utils/MeetingProvider";
// import signal_src from '../../../../assets/ton-mobi.mp3';
// import useAudio from "../../../../utils/useAudio";
import store from "../../../../redux/store";

export default function useClientJoin() {
    const [{videoStreamRef, audioStreamRef}] = useData();
    const [{localTrackRef}] = useMeetingData();
    const socket = useSocket();
    const [{client}] = useData();

    useLayoutEffect(() => {
        const handleUserJoin = async event => {
            const { micro, camera, joined, meetingId } = store.getState().meeting;
            const streams = [];
            const data = {};
            const localAudioTrack = localTrackRef.current.audioTrack;
            const localVideoTrack = localTrackRef.current.videoTrack;
            const id = event.where._id;
            if(meetingId === id) {
                if(micro.active  && !micro.published && localAudioTrack) {
                    streams.push(localAudioTrack);
                    data.micro = { published: true };
                }  
                if(camera.active && !camera.published && localVideoTrack) {
                    streams.push(localVideoTrack);
                    data.camera = { published: true };
                }
                if(streams.length && joined) {
                    await client.publish(streams);
                    store.dispatch(setData({ data }));
                }
            }
        };
        socket.on('join', handleUserJoin);
        return () => {
            socket.off('join', handleUserJoin);;
        };
    }, [socket, videoStreamRef, audioStreamRef, localTrackRef, client]);

}