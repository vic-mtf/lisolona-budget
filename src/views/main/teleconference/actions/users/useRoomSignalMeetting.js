import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "../../../../../utils/SocketIOProvider";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";

export default function useRoomSignalMeetting () {
    const socket = useSocket();
    const {isEmitted, meetingId, members, options, date} = useSelector(store => {
        const isEmitted = store.teleconference.mode === 'on';
        const meetingId = store.teleconference.meetingId;
        const chatGroups = store.data.chatGroups;
        const members = chatGroups?.find(({_id: id}) => id === meetingId)
        ?.members?.map(({_id: user, role}) => ({...user, role, id: user?._id, origin: user}));
        const date = store.teleconference.date;
        const options = store.teleconference.options;
        return {isEmitted, meetingId, members, options, date};
    });
    const [{participants}] = useTeleconference();

    useEffect(() => {
        const onSignalJoinMeeting = ({details}) => {
             const {uid, type, id} = details;
             if(type === "connexion" && meetingId === id) 
                if(members?.find(({id}) =>  id === uid)) {
                    const ids = [
                        uid?.toString(), 
                        ...participants.map(({uid}) => uid?.toString())
                    ].sort();
                    const isEligible = ids[0] === uid;
                    const details = {
                        type: 'current-meeting',
                        options,
                        meetingId: id,
                        participants,
                        members,
                        date,
                    };
                    if(isEligible)
                        socket.emit('signal', {to: uid, type: 'direct', details});
                }
        };
       if(isEmitted)
            socket?.on('signal', onSignalJoinMeeting);
        return () => {
            socket?.off('signal', onSignalJoinMeeting, isEmitted);
        }
    }, [socket, isEmitted, members, meetingId, participants, options, date]);
}