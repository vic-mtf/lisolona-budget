import { CardMedia, Box as MuiBox, Stack } from "@mui/material";
import Typography from "../../../../../components/Typography";
import { useLayoutEffect, useMemo } from "react";
import fileBaseExtension from "../../../../../utils/fileExtensionBase";
import getFileExtension, {getName} from "../../../../../utils/getFileExtension";
import getFormatTime from "../../../../../utils/getFormatTime";
import { useState } from "react";
import humanReadableSize from "../../../../../utils/humanReadableSize";
import { FastDetail } from "./FileThumb";

export default function DocThumb ({name, src, type, size}) {
    console.log(type, name, src);
    const [duration, setDuration] = useState(null);
    const doc = useMemo(() =>
        fileBaseExtension.find(
            ({exts}) =>exts.find(ext => ext === getFileExtension(name))
        )
    ,[name]);

    useLayoutEffect(() => {
        if(duration === null) {
             const audio = new Audio();
             audio.onloadeddata = event => {
                setDuration(event.target.duration);
             }
             audio.src = src;
        }   
    }, [duration, src]);

    return (
        <CardMedia
            sx={{
                height: 100,
                width: 100,
                p: .5,
                position: 'relative',
                bgcolor: 'background.paper',
                border: theme => `.5px solid ${theme.palette.divider}`,
                borderRadius: 1,
            }}
            component="div"
            title={name}
            height={100}
            width={100}
        >
            <Stack 
                //spacing={.25} 
                //position="absolute" 
                top={0} 
                left={0}
                direction="row"
                mt={.5}
            >
                <CardMedia
                    component="img"
                    width={30}
                    height={30}
                    sx={{
                        width: 30,
                        height: 30
                    }}
                    src={doc?.icon}
                />
            </Stack>
            <Typography
                width="100%"
                noWrap
                 mt={.5}
                textOverflow="ellipsis"
                fontWeight="bold"
            >
                {getName(name)}
            </Typography>
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
                <FastDetail 
                    duration={duration}
                    size={size}
                />
            </MuiBox>
        </CardMedia>
    );
}


