import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Typography from "../../../../components/Typography";
import { useSocket } from "../../../../utils/SocketIOProvider";

export default function useUserRaiseHand () {
    const socket = useSocket();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {mode, members} = useSelector(store => {
        const mode = store.teleconference.meetingMode;
        const type = store.teleconference.type;
        const meetingId = store.teleconference.meetingId;
        const members = type === 'direct' ? 
        store.data.contacts :
        store.data.chatGroups?.find(({_id}) => _id === meetingId)
        ?.members.map(({_id: user, role}) => ({
            avatarSrc: user.imageUrl,
            email: user.email,
            id: user._id,
            name: `${user.fname || ''} ${user.lname || ''} ${user.mname || ''}`.trim(),
            role,
            origin: user,
        }));
        return {mode, members};
    });

    useEffect(() => {
        const handleRaiseHand = ({from, details}) => {
            const {variant} = details;
            const user = members.find(({id}) => id === from);
            if(variant === 'raise-hand')
                enqueueSnackbar({
                    message: (
                        <Typography color="inerhit">
                            {user?.name} a levé la main
                        </Typography>
                    )
                });
            //console.log(details);
        };
        if(mode === 'on')
            socket?.on('signal', handleRaiseHand);
        return () => {
            socket?.off('signal', handleRaiseHand);
        }
    }, [socket, mode, members]);
}