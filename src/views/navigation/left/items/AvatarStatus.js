import { 
    ListItemAvatar, 
} from "@mui/material";
import React, { useEffect, useMemo, useRef } from "react";
import Avatar from "../../../../components/Avatar";
import CustomAvatarGroup from "../../../../components/CustomAvatarGroup";
import CustomBadge from "../../../../components/CustomBadge";
import getHueColorById from "../../../../utils/genColorById";
import getShort from "../../../../utils/getShort";
import { useSocket } from "../../../../utils/SocketIOProvider";
import { useSelector } from "react-redux";

export default function AvatarStatus ({type, name, avatarSrc, id}) {
    const status = useSelector(store => store.status[id]);
    const isEmited = useRef(true);
    const socket = useSocket();
    const { rgb } = getHueColorById(id);
    
    const avatarSx = useMemo(() => ({
        color: `rgba(${rgb.r},${rgb.g},${rgb.b})`,
        bgcolor: 'white',
        backgroundImage: `
        radial-gradient(circle, transparent 0%, 
        rgba(${rgb.r},${rgb.g},${rgb.b},1) 250%);`,
        fontWeight: 'bold',
        fontSize: 15,
    }), [rgb.b, rgb.g, rgb.r]);

    useEffect(() => {
        if(!status) {
            isEmited.current = true;
            if(type === 'direct' && isEmited.current) {
                socket.emit('status', {who: id});
                isEmited.current = false;
            }
        }
    }, [type, socket, id, status]);

    return (
        <ListItemAvatar>
            {type === 'direct'&&
            <CustomBadge 
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={status === 'online'}
            >
                <Avatar
                    src={avatarSrc}
                    srcSet={avatarSrc}
                    alt={name}
                    children={getShort(name)}
                    imgProps={{
                        loading: "lazy"
                    }}
                    sx={{
                        ...avatarSx,
                        textTransform: 'capitalize',
                        width: 40,
                        height: 40,
                    }}
                />
            </CustomBadge>}
            {type === 'room'&&
            <CustomAvatarGroup>
                <Avatar
                    src={avatarSrc}
                    srcSet={avatarSrc}
                    sx={{...avatarSx}}
                />
                <Avatar
                    src={avatarSrc}
                    srcSet={avatarSrc}
                    alt={name}
                    sx={{...avatarSx}}
                />
            </CustomAvatarGroup>}
        </ListItemAvatar>
    )
}

AvatarStatus.defaultProps = {
    type: 'direct'
}