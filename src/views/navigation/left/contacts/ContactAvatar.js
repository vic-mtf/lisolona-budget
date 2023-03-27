import { 
    ListItemAvatar, 
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Avatar from "../../../../components/Avatar";
import CustomAvatarGroup from "../../../../components/CustomAvatarGroup";
import CustomBadge from "../../../../components/CustomBadge";
import getHueColorById from "../../../../utils/genColorById";
import getShort from "../../../../utils/getShort";
import { useSocket } from "../../../../utils/SocketIOProvider";
import useOnLine from '../../../../utils/useOnLine';

export default function ContactAvatar ({type, name, avatarSrc, id}) {
    const [online, setOnline] = useState(null);
    const isEmited = useRef(true);
    const localOnline = useOnLine();
    const socket = useSocket();
    const {rgb} = getHueColorById(id);
    
    const {members, mode} = useSelector(store => {
        const chatGroups = store.data.chatGroups;
        const meetingId = store.teleconference.meetingId;
        const mode = store.teleconference.meetingMode;
        const members = chatGroups?.find(({_id: id}) => id === meetingId)
        ?.members?.map(
            ({_id: user, role}) => store.user?.id !== user?._id && 
            ({...user, role, id: user?._id, origin: user})
        )?.filter(name => name);
        return {members, mode};
    });
   
    
    const avatarSx = {
        color: `rgba(${rgb.r},${rgb.g},${rgb.b})`,
        bgcolor: theme => theme.palette.background.paper,
        backgroundImage: `
        radial-gradient(circle, transparent 0%, 
        rgba(${rgb.r},${rgb.g},${rgb.b},1) 250%);`,
        fontWeight: 'bold',
        fontSize: 15,
    };

    const handleSignalMeeting = useCallback(() => {

        if(mode);

    }, [members, mode, id, type]);

    useEffect(() => {
        const toggleStatus = ({status, who}) => {
            console.log(who === id, status)
            if(who === id && !online && status === 'online') {
                handleSignalMeeting();
                setOnline(true);
            }
            if(who === id && online && status !== 'online')
                setOnline(false);
        };
        socket.on('status', toggleStatus);
        return () => {
            socket.off('status', toggleStatus);
        }

    },[socket, localOnline, id, type, members, online, handleSignalMeeting]);

    useEffect(() => {
        if(type === 'direct' && isEmited.current && online === null){
            socket.emit('status', {who: id});
            isEmited.current = false;
        }
    }, [type, online, socket, id]);
    
    // useEffect(() => {
    //     if(online && members?.find(user => user.id === id)) {
    //         const name ='_join-meeting';
    //         const customEvent = new CustomEvent(name, {detail : {name, id}});
    //         const root = document.getElementById('root');
    //         root.dispatchEvent(customEvent);
    //     }
    // },[members, online, id]);

    return (
        <ListItemAvatar>
            {type === 'direct'&&
            <CustomBadge 
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={Boolean(online)}
            >
                <Avatar
                    src={avatarSrc}
                    srcSet={avatarSrc}
                    alt={name}
                    children={getShort(name)}
                    sx={{
                        ...avatarSx,
                        textTransform: 'capitalize'
                    }}
                />
            </CustomBadge>}
            {type === 'room'&&
            <CustomAvatarGroup>
                <Avatar
                    src={avatarSrc}
                    srcSet={avatarSrc}
                    sx={{
                        ...avatarSx
                    }}
                />
                <Avatar
                    src={avatarSrc}
                    srcSet={avatarSrc}
                    alt={name}
                    sx={{
                        ...avatarSx
                    }}
                />
            </CustomAvatarGroup>}
        </ListItemAvatar>
    )
}

ContactAvatar.defaultProps = {
    type: 'direct'
}