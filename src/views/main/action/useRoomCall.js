import { useLayoutEffect, useRef } from "react";
import { useSocket } from "../../../utils/SocketIOProvider";
import openNewWindow from "../../../utils/openNewWindow";
import { encrypt } from "../../../utils/crypt";
import { setData } from "../../../redux/meeting";
import { useDispatch, useSelector } from "react-redux";
import { useData } from "../../../utils/DataProvider";
import useAxios from "../../../utils/useAxios";
import { useSnackbar } from "notistack";
import newMeetingSnackbar from "./newMeetingSnackbar";
import db from "../../../database/db";
import clearTimer from "../../../utils/clearTimer";
import { useTheme } from "@mui/material";
import useAudio from '../../../utils/useAudio';
import signal_src from "../../../assets/Samsung-Wing-SMS.mp3";
import getFullName from "../../../utils/getFullName";

export default function useRoomCall () {
    const socket = useSocket();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const mode = useSelector(store => store.meeting.mode);
    const timerRef = useRef();
    const [{secretCodeRef}] = useData();
    const token = useSelector(store => store.user.token);
    const signalAudio = useAudio(signal_src);
    const theme = useTheme();
    const [,refetch] = useAxios({
        headers: {Authorization: `Bearer ${token}`},
    }, {manual: true});
    const dispatch = useDispatch();
    
    useLayoutEffect(() => {
        const handleJoinMeeting = ({timer, data:target, origin}) => {
            window.clearInterval(timer);
            const mode = 'prepare';
            const wd = openNewWindow({
                url: '/meeting/',
            });
            
            wd.geidMeetingData = encrypt({
                target,
                mode,
                secretCode: secretCodeRef.current,
                defaultCallingState: 'incoming',
                origin
            });
            if(wd) {
                dispatch(setData({ data: {mode}}));
                wd.openerSocket = socket;
            }
        };
        const handleCancelMeeting = ({timer, target, origin}) => {
            window.clearInterval(timer);
            socket.emit('hang-up',{
                target: target.id,
                id: origin?._id,
                type: target.type,
            });
        };
        const handleCall = event => {
            const user = event.who;
            const id = event?.where?._id;
            const location = event?.where?.location;
            const url = '/api/chat/room/call/' + id;
            const type = event.where.type;
            const target = {
                id: user._id,
                name: getFullName(user),
                type: 'direct',
                avatarSrc: user.imageUrl
            };

            if(type === 'room') {
                refetch({url}).then(({data: origin}) => {
                    db.discussions.get(location).then(data => {
                        signalAudio.audio.play();
                        let counter = 0;
                        const timer = setInterval(() => {
                            counter += 1;
                            socket.emit('ringing', {
                                id: origin?._id,
                                type: target?.type,
                                target: target?.id,
                            });
                            if(counter === 30) {
                                clearTimer(timerRef.current);
                                closeSnackbar();
                            }
                        }, 500);

                        enqueueSnackbar({
                            persist: true,
                            ...newMeetingSnackbar({
                                avatarSrc: data.avatarSrc,
                                id: location,
                                name: data.name,
                                type: data.type,
                                theme,
                                onCancelMeeting() {
                                    handleCancelMeeting({target, origin, timer});
                                    closeSnackbar();
                                },
                                onJoinMeeTing() {
                                    handleJoinMeeting({data, origin, timer});
                                    closeSnackbar();
                                }
                            })
                        });

                        const handleHangUp = () => {
                            window.clearInterval(timer);
                            socket.off('hang-up', handleHangUp);
                        };
                        socket.on('hang-up', handleHangUp);
                    }) 
                })
            }
        }
        socket?.on('call', handleCall);
        return () => {
            socket?.off('call', handleCall);
        };
    },[socket, secretCodeRef, dispatch, mode, refetch, enqueueSnackbar, closeSnackbar, signalAudio, theme]);
}