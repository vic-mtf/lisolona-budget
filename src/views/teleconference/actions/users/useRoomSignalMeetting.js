import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "../../../../utils/SocketIOProvider";

export default function useRoomSignalMeetting () {
    const socket = useSocket();
    const {isEmitted} = useSelector(store => {
        const isEmitted = store.teleconference.meetingMode === 'on';
        return {isEmitted}
    });

    useEffect(() => {
        const name = '_join-meeting';
        const root = document.getElementById('root');
        const onSignalJoinMeeting = ({detail}) => {
            const {id} = detail;
            console.log(id);
        };

        root.addEventListener(name, onSignalJoinMeeting);
        return () => {
            root.removeEventListener(name, onSignalJoinMeeting);
        }
    }, [socket, isEmitted]);
}