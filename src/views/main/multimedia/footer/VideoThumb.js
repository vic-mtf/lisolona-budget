import { 
    CardMedia,
    Box as MuiBox,
    Paper,
} from "@mui/material";
import { useState } from "react";
import Typography from "../../../../components/Typography";
import getFormatTime from "../../../../utils/getFormatTime";

export default function VideoThumb({src, coverUrl}) {
    const [duration, setDuration] = useState(null);

    return (
        <CardMedia
            sx={{
                height: 65,
                width: 65,
                position: 'relative',
                overflow: 'hidden',
            }}
            preload="metadata"
            height={65}
            width={65}
            src={src}
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
            {duration !== null &&
            <MuiBox
                component="span"
                m={.4}
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
                <Typography
                    variant="caption"
                    fontSize="80%"
                    component="span"
                    px={.5}
                >
                    {getFormatTime({currentTime: duration})}
                </Typography>
            </MuiBox>}
        </CardMedia>
    )
}