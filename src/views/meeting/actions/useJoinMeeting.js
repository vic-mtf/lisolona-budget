import { useSelector } from "react-redux";
import useAxios from "../../../utils/useAxios";
import { useCallback } from "react";
import store from "../../../redux/store";
import { setData } from "../../../redux/meeting";
import getData from "../../../utils/getData";
import useJoinedAndPublishedLocalClient from "./useJoinedAndPublishedLocalClient";
import { useSocket } from "../../../utils/SocketIOProvider";
import { addParticipants } from "../../../redux/conference";

export default function useJoinMeeting() {
    const token = useSelector(store => store.user.token);
    const [,refetch] = useAxios({
        headers: {Authorization: `Bearer ${token}`},
    }, {manual: true});
    const handleUserJoined = useJoinedAndPublishedLocalClient();
    const socket = useSocket();
    const handleJoinMeetingRequest = useCallback(async (meetingId) => {
        const result = await refetch({
            url: '/api/chat/room/call/' + meetingId,
        });
        const meetingData = result?.data;
        if(typeof meetingData === 'object') {
            const id = store.getState().user?.id;
            const uid = meetingData?.participants?.find(({identity: {_id}}) => _id === id)?.uid;
            const options = meetingData?.callDetails;
            const {createdAt, location, participants, _id: meetingId} = meetingData;
            
            store.dispatch(addParticipants({
                participants:  participants.map(
                    participant => ({
                        ...participant, 
                        id: participant?.identity._id,
                        state: participant?.identity._id === id ? {
                            ...participant.state,
                            isInRoom: true,
                        }: participant.state,
                    })
                )
            }));
            getData({meetings: [meetingData]});
            socket.emit('join', {id: meetingId});
            store.dispatch(
                setData({
                    data: {
                        options, 
                        createdAt, 
                        location, 
                        meetingId,
                        ...(await handleUserJoined({
                            ...options, 
                            CHANEL: location, 
                            uid
                        })),
                    }
                })
            );
        }
        return meetingData;
    }, [refetch, handleUserJoined, socket]);
    return handleJoinMeetingRequest;
}