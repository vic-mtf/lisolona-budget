import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../../../utils/SocketIOProvider";
import signal_audio  from '../../../../assets/Eventually-Sms.mp3';
import getData from '../../../../utils/getData';
import { setStatus } from "../../../../redux/status";
import useAudio from "../../../../utils/useAudio";
import JoinMeetingByCode from "./JoinMeetingByCode";
import db from "../../../../database/db";

export default function ActionWrapper () {
    const targetId = useSelector(store => store.data?.targetId);
    const chatGroups = useSelector(store => store.data.chatGroups);
    const user = useSelector(store => store.user);
    const signalAudio = useAudio(signal_audio);
    const savedChatIdRef = useRef(targetId);
    const socket = useSocket();
    const dispatch = useDispatch();

    useEffect(() => {
        const handelGetChat = ({chats, ...otherPros}) => {
            getData({chats});
        };
        const handleSignaling = ({invitations}) => {
            if(invitations?.length) {
                signalAudio.audio.play();
            }
        };
        const toggleStatus = ({status, who}) => {
            dispatch(setStatus({id: who, status}));
        };
        const getCallHistory = ({callHistory}) => {
           
        };
        const callStatusChange = async ({_id, status}) => {
            if(await db?.calls?.get(_id))
                await db?.calls?.update(_id, {status});
        };
        const onGetContact = ({contacts}) => getData({contacts});
        socket?.on('chats', handelGetChat);
        socket?.on('invitations', handleSignaling);
        socket?.on('status', toggleStatus);
        socket?.on('contacts', onGetContact);
        socket?.on('call-history', getCallHistory);
        socket?.on('call-status', callStatusChange);
        return () => {
            socket?.off('chats', handelGetChat);
            socket?.off('invitations', handleSignaling);
            socket?.off('status', toggleStatus);
            socket?.off('contacts', onGetContact);
            socket?.off('call-status', callStatusChange);
            socket?.off('call-history', getCallHistory);
        };
    }, [socket, dispatch, user, chatGroups, signalAudio]);

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

    return (
        <>
            <JoinMeetingByCode/>
        </>
    )
}