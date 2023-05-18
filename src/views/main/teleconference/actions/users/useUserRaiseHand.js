import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Typography from "../../../../../components/Typography";
import { useSocket } from "../../../../../utils/SocketIOProvider";
import db from '../../../../../database/db';

export default function useUserRaiseHand () {
    const socket = useSocket();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const mode = useSelector(store => store.teleconference?.mode);
    const target = useSelector(store => store.teleconference?.target);
    const members = target?.members?.map(({_id: user, role}) => ({
        avatarSrc: user.imageUrl,
        email: user.email,
        id: user._id,
        name: `${user.fname || ''} ${user.lname || ''} ${user.mname || ''}`.trim(),
        role,
        origin: user,
    }))
    

    useEffect(() => {
        const handleRaiseHand = async ({from, details}) => {
            const {variant} = details;
            let user = members?.find(({id}) => id === from);
            if(!user) user = (await db?.contacts?.get({id: from}));
            
            if(variant === 'raise-hand')
                enqueueSnackbar({
                    message: (
                        <Typography color="inerhit">
                            {user?.name} a levé la main
                        </Typography>
                    )
                });
        };
        if(mode === 'on')
            socket?.on('signal', handleRaiseHand);
        return () => {
            socket?.off('signal', handleRaiseHand);
        }
    }, [socket, mode, members]);
}