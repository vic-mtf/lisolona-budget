import { CardMedia, Box as MuiBox, Stack } from "@mui/material";
import Typography from "../../../../../components/Typography";
import { useLayoutEffect, useMemo } from "react";
import fileBaseExtension from "../../../../../utils/fileExtensionBase";
import getFileExtension, {getName} from "../../../../../utils/getFileExtention";
import getFormatTime from "../../../../../utils/getFormatTime";
import { useState } from "react";

export default function DocThumb ({name, src, type}) {
    const [duration, setDuration] = useState(null);
    const doc = useMemo(() =>
        fileBaseExtension.find(
            ({exts}) => Boolean(
                exts.find(ext => ext === getFileExtension(name))
            )
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
    }, [duration]);

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
                spacing={.25} 
                //position="absolute" 
                top={0} 
                left={0}
                direction="row"
                mt={1}
            >
                <CardMedia
                    component="img"
                    width={28}
                    height={28}
                    sx={{
                        width: 28,
                        height: 28
                    }}
                    src={doc.icon}
                />
                <Typography
                    align="center"
                    justifyContent="center"
                    alignItems="center"
                    noWrap
                    textOverflow="ellipsis"
                    variant="caption"
                    fontSize="11px"
                    display="flex"

                >
                    {doc.type}
                </Typography>
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
        </CardMedia>
    );
}
