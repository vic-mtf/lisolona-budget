import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeleconference } from "../../../../redux/teleconference";
import { useSocket } from "../../../../utils/SocketIOProvider";
import mssAudio  from '../../../../assets/Eventually-Sms.mp3';
import getData from '../../../../utils/getData';
import { setStatus } from "../../../../redux/status";

export default function ActionWrapper () {
    const targetId = useSelector(store => store.data?.targetId);
    const chatGroups = useSelector(store => store.data.chatGroups);
    const user = useSelector(store => store.user);
    const savedChatIdRef = useRef(targetId);
    const socket = useSocket();
    const dispatch = useDispatch();

    useEffect(() => {
        const handelGetChat = ({chats, ...otherPros}) => {
            getData({chats});
        };
        const handleSignaling = ({invitations}) => {
            if(invitations?.length) {
                const audio = new Audio();
                audio.src = mssAudio;
                audio.autoplay = true;
            }
        };
        const handleSignalCurrentMeeting = ({from, details}) => {
            const {type, meetingId, options, date} = details;
            if(type === 'current-meeting') {
                const  room = chatGroups?.find(({_id}) => _id === meetingId);
                if(room) dispatch(addTeleconference({
                        key: 'currentCalls',
                        data: [{
                            id: meetingId,
                            name: room.name,
                            date,
                            options,
                            from,
                        }]
                }));
            }
        };
        const toggleStatus = ({status, who}) => {
            dispatch(setStatus({id: who, status}));
        };
        const getCallHistory = ({callHistory}) => {
           
        };
        const onGetContact = ({contacts}) => getData({contacts});
        socket?.on('chats', handelGetChat);
        socket?.on('invitations', handleSignaling);
        socket?.on('signal', handleSignalCurrentMeeting);
        socket?.on('status', toggleStatus);
        socket?.on('contacts', onGetContact);
        socket?.on('call-history', getCallHistory);

        return () => {
            socket?.off('chats', handelGetChat);
            socket?.off('invitations', handleSignaling);
            socket?.off('signal', handleSignalCurrentMeeting);
            socket?.off('status', toggleStatus);
            socket?.off('contacts', onGetContact);
            socket?.off('call-history', getCallHistory);
        };
    }, [socket, dispatch, user, chatGroups]);

    useEffect(() => {
        if(targetId !== savedChatIdRef.current) {
            const name = '_user-infos';
            const customEvent = new CustomEvent(name, {
                detail: {name, state: false}
            });
            document.getElementById('root')
            .dispatchEvent(customEvent);
            savedChatIdRef.current = targetId;
        }
    },[targetId]);

    return null;
}