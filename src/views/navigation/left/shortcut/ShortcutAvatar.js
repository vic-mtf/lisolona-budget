import React, { useEffect } from "react";
import Avatar from "../../../../components/Avatar";
import getHueColorById from "../../../../utils/genColorById";
import getShort from "../../../../utils/getShort";

export default function ShortcutAvatar ({name, avatarSrc, id, len, title}) {
    const {rgb} = getHueColorById(id);
    const avatarSx = {
        color: `rgba(${rgb.r},${rgb.g},${rgb.b})`,
        bgcolor: theme => theme.palette.background.paper,
        backgroundImage: `
        radial-gradient(circle, transparent 0%, 
        rgba(${rgb.r},${rgb.g},${rgb.b},1) 250%);`,
        fontWeight: 'bold',
        fontSize: 15,
    };

    return (
        <Avatar
            src={avatarSrc}
            srcSet={avatarSrc}
            alt={name}
            children={getShort(name, len)}
            title={title}
            sx={{
                ...avatarSx
                
            }}
        />
    )
}