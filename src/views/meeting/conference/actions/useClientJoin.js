import { useLayoutEffect } from "react";
import { useSocket } from "../../../../utils/SocketIOProvider";
import { useData } from "../../../../utils/DataProvider";
import { setData } from "../../../../redux/meeting";
import { findUser, useMeetingData } from "../../../../utils/MeetingProvider";
// import signal_src from '../../../../assets/ton-mobi.webm';
// import useAudio from "../../../../utils/useAudio";
import store from "../../../../redux/store";
import { addParticipants } from "../../../../redux/conference";

export default function useClientJoin() {
    const [{videoStreamRef, audioStreamRef}] = useData();
    const [{localTrackRef}] = useMeetingData();
    const socket = useSocket();
    const [{client}] = useData();

    useLayoutEffect(() => {
        const handleUserJoin = async event => {
            const { micro, camera, joined, meetingId, me, screenSharing } = store.getState().meeting;
            const streams = [];
            const data = {};
            const localAudioTrack = localTrackRef.current.audioTrack;
            const localVideoTrack = localTrackRef.current.videoTrack;
            const userId = event.who?._id;
            const isSelf = me?.id === event?.who?._id;
            const isCurrentMeeting = meetingId === event.where._id;
            const isGuest = event?.who?.isGuest;
            const found = findUser(userId);
            const participant = event.details;
            if(isCurrentMeeting) {
                if(isGuest && !found  && !isSelf) {
                    store.dispatch(addParticipants({
                        participants:  [{
                                ...participant, 
                                id: userId,
                                isGuest,
                                state:  {
                                    ...participant.state,
                                    isInRoom: true,
                                }
                        }]
                    }));
                }
                if(micro.active  && !micro.published && localAudioTrack) {
                    streams.push(localAudioTrack);
                    data.micro = { published: true };
                }  
                if(camera.active && !camera.published && localVideoTrack && !screenSharing.published) {
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