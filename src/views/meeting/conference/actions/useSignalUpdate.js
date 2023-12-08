import { useEffect } from "react";
import { useSocket } from "../../../../utils/SocketIOProvider";
import store from "../../../../redux/store";
import { updateParticipantState } from "../../../../redux/conference";

export default function useSignalUpdate() {
    const socket = useSocket();

    useEffect(() => {
        const handleSignal = async event => {
            console.log('********************************', event);
            if(store.getState().meeting.meetingId === event?.where?._id) {
                const users = Array.isArray(event?.who) ? event?.who : [event?.who];
                const ids =  users.map(user => typeof user === 'string' ? user : user?._id);
                const [key] = Object.keys(event.what);
                const data = {ids,...event.what, key};
                store.dispatch(updateParticipantState({data}));
            }
        }
        socket?.on('signal', handleSignal);
        return () => {
            socket.off('signal', handleSignal);
        }
    }, [socket]);
}