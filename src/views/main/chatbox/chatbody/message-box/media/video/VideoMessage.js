import { 
    CardMedia,
    Box as MuiBox
} from "@mui/material";
import { useState } from "react";
import Typography from "../../../../../../../components/Typography";
import getFormatTime from "../../../../../../../utils/getFormatTime";
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';

export default function VideoMessage ({src, width, height}) {
    const [duration, setDuration] = useState(null);
   
    return (
        <MuiBox
            display="flex"
            height={height}
            width={width}
            justifyContent="center"
            alignItems="center"
            position="relative"
            overflow="hidden"
        >
            <CardMedia
                component="video"
                preload="metadata"
                onLoadedData={event => setDuration(event.target.duration)}
                src={src.toString()}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />
            {duration !== null &&
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
                <Typography
                    variant="caption"
                    fontSize="80%"
                    component="span"
                    px={.5}
                >
                    {getFormatTime({currentTime: duration})}
                </Typography>
            </MuiBox>}
            <MuiBox
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                justifyContent="center"
                alignItems="center"
                display="flex"
            >
                <MuiBox
                    display="inline-block"
                    bgcolor="divider"
                    borderRadius={1}
                    sx={{
                        backdropFilter: theme => `blur(${theme.customOptions.blur})`
                    }}
                >
                    <PlayArrowOutlinedIcon 
                        sx={{color: 'rgba(255,255,255, .8)'}}
                    />
                </MuiBox>
            </MuiBox>
        </MuiBox>
    )
}