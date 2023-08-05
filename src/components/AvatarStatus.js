import { 
    ListItemAvatar, useTheme, 
} from "@mui/material";
import React, { useEffect, useMemo, useRef } from "react";
import Avatar from "./Avatar";
import CustomAvatarGroup from "./CustomAvatarGroup";
import CustomBadge from "./CustomBadge";
import { generateColorsFromId } from "../utils/genColorById";
import getShort from "../utils/getShort";
import { useSocket } from "../utils/SocketIOProvider";
import { useSelector } from "react-redux";

function AvatarStatus ({type, name, avatarSrc, id, invisible, sx, avatarsSrc}) {
    const images = Array.isArray(avatarsSrc) ? avatarsSrc : [];
    const status = useSelector(store => store.status[id]);
    const isEmittedRef = useRef(true);
    const socket = useSocket();
    const theme = useTheme();
    const { background, text } = generateColorsFromId(id, theme.palette.mode);
    
    const avatarSx = useMemo(() => ({
        ...sx,
        color: text,
        bgcolor: background,
        fontWeight: 'bold',
        fontSize: 15,
    }), [background, text, sx]);

    useEffect(() => {
        if(!status && !invisible) {
            isEmittedRef.current = true;
            if(type === 'direct' && isEmittedRef.current) {
                socket.emit('status', {who: id});
                isEmittedRef.current = false;
            }
        }
    }, [type, socket, id, status, invisible]);

    return (
        <ListItemAvatar>
            {type === 'direct'&&
            <CustomBadge 
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={status === 'online'}
                invisible={invisible}
            >
                <AvatarFadeLoading
                    src={avatarSrc}
                    srcSet={avatarSrc}
                    alt={name}
                    children={getShort(name)?.toUpperCase()}
                    sx={{
                        ...avatarSx,
                        textTransform: 'capitalize',
                        ...invisible ? {
                            border: 'none',
                        } : {}
                    }}
                />
            </CustomBadge>}
            {type === 'room'&& (
                avatarSrc ? 
                (
                    <AvatarFadeLoading
                        src={avatarSrc}
                        srcSet={avatarSrc}
                        alt={name}
                        children={getShort(name)?.toUpperCase()}
                        sx={{
                            ...avatarSx,
                            textTransform: 'capitalize',
                        }}
                    />
                    ):
                    (
                    <CustomAvatarGroup>
                        <Avatar
                            src={images[0]}
                            srcSet={images[0]}
                            sx={{...avatarSx}}
                        />
                        <Avatar
                            src={images[1]}
                            srcSet={images[1]}
                            alt={name}
                            sx={{...avatarSx}}
                        />
                    </CustomAvatarGroup>
                    )
                )
            }
        </ListItemAvatar>
    )
}

AvatarStatus.defaultProps = {
    type: 'direct',
    sx: {},
}

const AvatarFadeLoading = React.memo(({...props}) => {

    return  (
        <Avatar
            {...props}
            imgProps={{
                loading: "lazy",
            }}
        />
    );
})


export default React.memo(AvatarStatus);