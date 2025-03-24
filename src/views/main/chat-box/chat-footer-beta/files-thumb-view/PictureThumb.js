import { CardMedia, Box as MuiBox } from "@mui/material";
import resizeImage from "../../../../../utils/resizeImage";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { FastDetail } from "./FileThumb";

export default function PictureThumb ({src: url, name, size}) {
    const [src, setSrc] = useState(null);

    useLayoutEffect(() => {
        if(url) (async () => {
            const {normal} = await resizeImage({
                url, 
                quality: .5, 
                maxWidth: 98, 
                maxHeight: 98,
                scale: 2.5,
                imageSmoothingQuality: 'low',
            })
            setSrc(normal);
        })();
    }, [url]);

    return (
        <CardMedia
        sx={{
            height: 98,
            width: 98,
            position: 'relative',
            overflow: 'hidden',
        }}
        height={98}
        width={98}
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
                width: '98%',
                height: '98%',
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