import { CardMedia, Box as MuiBox } from "@mui/material";
import resizeImage from "../../../../../utils/resizeImage";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { FastDetail } from "./FileThumb";

export default function MediaThumb ({src: url, type, name, loaded }) {
    const [src, setSrc] = useState(null);
    const [duration, setDuration] = useState(null);
    const MediaComponent = type === 'image' ? 'img' : 'video';

    useLayoutEffect(() => {
        if(url && type === 'image') (async () => {
            const {normal} = await resizeImage({
                url, 
                quality: .5, 
                maxWidth: 200, 
                maxHeight: 200,
                scale: 2.5,
                imageSmoothingQuality: 'low',
            })
            setSrc(normal);
        })();
    }, [url, type]);

    return (
        <CardMedia
        sx={{
            height: 100,
            width: 100,
            position: 'relative',
            overflow: 'hidden',
        }}
        height={100}
        width={100}
        component="div"
    >
        <img
            src={src}
            alt={name}
            style={{
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
            }}
        />
        <MuiBox
            component="span"
            m={.5}
            position="absolute"
            left={0}
            bottom={0}
            sx={{
                background: theme => theme.palette.background.paper + 
                theme.customOptions.opacity,
                border: theme => `1px solid ${theme.palette.divider}`,
                backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                borderRadius: 1,
                display: 'inline-block',
            }}
        >
            <FastDetail size={size}/>
        </MuiBox>
    </CardMedia>
    )
}