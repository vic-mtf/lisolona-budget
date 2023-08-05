import { useSelector } from "react-redux";
import useAxios from "../../../utils/useAxios";
import { useCallback } from "react";
import { useMeetingData } from "../../../utils/MeetingProvider";
import db from "../../../database/db";
import store from "../../../redux/store";
import { setData } from "../../../redux/meeting";
import getData from "../../../utils/getData";
import useJoinedAndPublishedLocalClient from "./useJoinedAndPublishedLocalClient";
import { addParticipants } from "../../../redux/conference";

export default function useCreateMeeting() {
    const token = useSelector(store => store.user.token);
    const [{target}] = useMeetingData();
    const [,refetch] = useAxios({
        url: '/api/chat/room/call/',
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`},
    }, {manual: true});
    const handleUserJoined = useJoinedAndPublishedLocalClient();
    const handleCreateMeetingRequest = useCallback(async (published = true) => {
        const data = {
            target: target?.id,
            type: target?.type,
            tokenType: 'uid',
            role: 'publisher',
            start: Date.now(),
        };
        const result = await refetch({data});
        const meetingData = result?.data;
        let room = null;
        if(typeof meetingData === 'object') {
            if(target?.type === 'room') {
                const roomData = await db.discussions.get(target?.id);
                room = roomData.origin;
                if(room) delete room.messages;
                else room = null;
            }
            meetingData.room = room;
            const id = store.getState().user?.id;
            const uid = meetingData?.participants?.find(({identity: {_id}}) => _id === id)?.uid;
            const options = meetingData?.callDetails;
            const {createdAt, location, participants, _id: meetingId} = meetingData;
            getData({meetings: [meetingData]});
            store.dispatch(addParticipants({
                participants:  participants.map(
                    participant => ({
                        ...participant, 
                        id: participant?.identity._id,
                        state: participant?.identity._id === id ? {
                            ...participant.state,
                            inRoom: true,
                        }: participant.state,
                    })
                )
            }));

            store.dispatch(
                setData({
                    data: {
                        options, 
                        createdAt, 
                        location, 
                        meetingId,
                        ...(await handleUserJoined({
                            ...options, 
                            uid, 
                            CHANEL: location
                        }, published)),
                    }
                })
            );
        }
        return meetingData;
    }, [refetch, target, handleUserJoined]);
    return handleCreateMeetingRequest;
}