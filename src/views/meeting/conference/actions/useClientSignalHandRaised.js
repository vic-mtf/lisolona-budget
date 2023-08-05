import { useEffect } from "react";
import { findUser } from "../../../../utils/MeetingProvider";
import { useSocket } from "../../../../utils/SocketIOProvider";
import useAudio from "../../../../utils/useAudio";
import signal_src from "../../../../assets/iPhone-Msg-Sent.mp3";
import useCustomSnackbar from "../../../../components/useCustomSnackbar";
import { isBoolean } from "lodash";
import useTableRef from "../../../../utils/useTableRef";
import AvatarStatus from "../../../../components/AvatarStatus";
import IconButton from "../../../../components/IconButton";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import store from "../../../../redux/store";
import getFullName from "../../../../utils/getFullName";
import AnimatedWavingHand from "../../../../components/WavingHand";
import { Stack } from "@mui/material";

export default function useClientSignalHandRaised() {
    const { enqueueCustomSnackbar, closeCustomSnackbar } = useCustomSnackbar();
    const socket = useSocket();
    const [, setterClientsKey] = useTableRef();
    const signalSong = useAudio(signal_src);

    useEffect(() => {
        const handleShowAlert = ({id, state}) => {
            const getKey = key => setterClientsKey.updateObject({id, key});
            const client = findUser(id)?.identity;
            const name = getFullName(client);
            const avatarSrc = client?.imageUrl;
            const isMe = store.getState().meeting.me.id === id;
            const onClose = () => {
                const key = setterClientsKey.getObjectById(id)?.key;
                if(key) closeCustomSnackbar(key);
                setterClientsKey.deleteObject(id);
            };
            if(state) {
                signalSong.audio.play();
                enqueueCustomSnackbar({
                    getKey,
                    message: `${isMe ?  'Vous avez levé' : `${name} a levé`} la main.`,
                    icon: (
                        <AvatarStatus
                            invisible
                            name={name}
                            id={id}
                            type="direct"
                            sx={{
                                width: 30,
                                height: 30,
                            }}
                            avatarSrc={avatarSrc}
                        />
                    ),
                    action: (
                        <Stack
                            spacing={1}
                            direction="row"
                            display="flex"
                            justifyContent="center"
                            alignContent="center"
                        >
                            <IconButton
                                disableTouchRipple
                            >
                                <AnimatedWavingHand/>
                            </IconButton>
                            <IconButton
                                onClick={onClose}
                            >
                                <CloseOutlinedIcon/>
                            </IconButton>
                        </Stack>
                    )
                })
            } else onClose();
        };
        const handleSignal = async event => {
            if(store.getState().meeting.meetingId === event?.where?._id) {
                const state = event?.what?.state?.handRaised;
                const id = event?.who?._id;
                const isHandRaiseAlert = isBoolean(state);
                if(isHandRaiseAlert) 
                    handleShowAlert({state, id});
            }
        };
        socket?.on('signal', handleSignal);
        return () => {
            socket.off('signal', handleSignal);
        }
    }, [
        socket, 
        closeCustomSnackbar, 
        enqueueCustomSnackbar, 
        setterClientsKey,
        signalSong
    ]);
}