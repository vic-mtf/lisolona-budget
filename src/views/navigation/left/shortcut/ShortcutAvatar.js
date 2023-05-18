import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Avatar from "../../../../components/Avatar";
import getHueColorById from "../../../../utils/genColorById";
import getShort from "../../../../utils/getShort";
import { useSocket } from "../../../../utils/SocketIOProvider";

export default function ShortcutAvatar ({name, avatarSrc, id, len, title}) {
    const {rgb} = getHueColorById(id);
    const uid = useSelector(store => store.user.id);
    const socket = useSocket();
    const isEmited = useRef(true);
    const avatarSx = {
        color: `rgba(${rgb.r},${rgb.g},${rgb.b})`,
        bgcolor: 'white',
        backgroundImage: `
        radial-gradient(circle, transparent 0%, 
        rgba(${rgb.r},${rgb.g},${rgb.b},1) 250%);`,
        fontWeight: 'bold',
        fontSize: 15,
    };

    useEffect(() => {
        if(isEmited.current) {
            socket?.emit('signal', {
                details: {type: 'connexion', uid, id},
                to: id,
                type: 'room'
            });
            isEmited.current = false;
        }
    },[socket, id, uid]);

    return (
        <Avatar
            src={avatarSrc}
            srcSet={avatarSrc}
            alt={name}
            children={getShort(name, len)}
            title={title}
            sx={{...avatarSx}}
        />
    )
}