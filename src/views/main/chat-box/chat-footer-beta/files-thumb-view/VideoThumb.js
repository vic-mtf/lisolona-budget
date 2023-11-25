import { 
    CardMedia,
    Box as MuiBox,
    Paper,
} from "@mui/material";
import { useState } from "react";
import Typography from "../../../../../components/Typography";
import formatTime from "../../../../../utils/formatTime";
import humanReadableSize from "../../../../../utils/humanReadableSize";
import { FastDetail } from "./FileThumb";

export default function VideoThumb({src, coverUrl, size}) {
    const [duration, setDuration] = useState(null);

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
            <video
                src={src}
                onLoadedData={event => setDuration(event.target.duration)}
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
                <FastDetail size={size} duration={duration}/>
            </MuiBox>
        </CardMedia>
    )
}