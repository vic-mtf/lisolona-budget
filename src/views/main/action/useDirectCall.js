import { useLayoutEffect } from "react";
import { useSocket } from "../../../utils/SocketIOProvider";
import openNewWindow from "../../../utils/openNewWindow";
import { encrypt } from "../../../utils/crypt";
import { setData } from "../../../redux/meeting";
import { useDispatch, useSelector } from "react-redux";
import { useData } from "../../../utils/DataProvider";
import useAxios from "../../../utils/useAxios";
import store from "../../../redux/store";

export default function useDirectCall () {
    const socket = useSocket();
    const mode = useSelector(store => store.meeting.mode);
    const [{secretCodeRef}] = useData();
    const token = useSelector(store => store.user.token);
    const [,refetch] = useAxios({
        headers: {Authorization: `Bearer ${token}`},
    }, {manual: true});
    const dispatch = useDispatch();
    
    useLayoutEffect(() => {
        const handleCall = event => {
            const user = event.who;
            const id = event?.where?._id;
            const url = '/api/chat/room/call/' + id;
            const type = event.where.type;
            console.log(event?.where);
            const target = {
                id: user._id,
                name: `${user?.fname} ${user?.lname} ${user?.mname || ''}`,
                type: 'direct',
                avatarSrc: user.imageUrl
            };

            if(mode === 'none') {
                if(type === 'direct') {
                    refetch({url}).then(({data: origin}) => {
                        const subWindow = openNewWindow({
                            url: '/meeting',
                        });
                        if(subWindow) {
                            subWindow.geidMeetingData = encrypt({
                                mode: 'incoming',
                                target,
                                secretCode: secretCodeRef.current,
                                defaultCallingState: 'incoming',
                                origin
                            });
                            dispatch(setData({data: {mode: 'incoming'}}));
                            subWindow.openerSocket = socket;
                        }
                    })
                } 
            } else {
                let counter = 0;
                const timer = setInterval(() => {
                    counter += 1;
                    if(store.getState().meeting.mode !== 'none')
                        socket.emit('busy', {
                            id,
                            type: target?.type,
                            target: target?.id,
                        });
                    if(counter === 20) 
                        window.clearInterval(timer)
                }, 1000);
                const handleHangUp = () => {
                    window.clearInterval(timer);
                    socket.off('hang-up', handleHangUp);
                };
                socket.on('hang-up', handleHangUp);
            }
        };
        socket?.on('call', handleCall);
        return () => {
            socket?.off('call', handleCall);
        };
    },[socket, secretCodeRef, dispatch, mode, refetch]);
}