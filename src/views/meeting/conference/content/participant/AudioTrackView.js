import { Avatar, Box as MuiBox } from "@mui/material";
import { useLayoutEffect, useRef } from "react";
import generateBackgroundFromImage from "../../../../../utils/generateBackgroundFromImage";
import generateBackgroundFromId from "../../../../../utils/generateBackgroundFromId";
import { AudioVisualizer } from "./AudioVisualizer";
import { useTheme } from "@emotion/react";
import { generateColorsFromId } from "../../../../../utils/genColorById";
import { useMemo } from "react";


export default function AudioTrackView ({avatarSrc, id, audioTrack}) {
    const rootRef = useRef();
    const theme = useTheme();
    const { background, text } = generateColorsFromId(id, theme.palette.mode);

    const avatarSx = useMemo(() => ({
        color: text,
        bgcolor: background,
        fontWeight: 'bold',
        fontSize: 40,
    }), [background, text]);

    useLayoutEffect(() => {
        if(avatarSrc || id) {
            const getBackground = avatarSrc ? 
            generateBackgroundFromImage : generateBackgroundFromId;
            const key = avatarSrc ? 'url' : 'id';
            const value = avatarSrc || id;
            getBackground({[key]: value}).then(img => {
                rootRef.current.style.background = `url(${img})`;
                rootRef.current.style.backgroundSize = 'cover';
            })
        }
    },[avatarSrc, id]);

    return (
        <MuiBox
            ref={rootRef}
            position="absolute"
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            className='audio-track'
            sx={{
                '& > div': {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            }}
        >
            <MuiBox
                sx={{
                    backdropFilter: theme => `blur(${theme.customOptions.blur})`
                }}
            >
            <AudioVisualizer
                audioTrack={audioTrack}
                size={100}
                maxSize={150}
                radius={5}
                color={avatarSx.color}
            />
                <MuiBox
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <Avatar
                        src={avatarSrc}
                        variant="rounded"
                        sx={{
                            ...avatarSx,
                            height: 97.5,
                            width: 97.5,
                        }}
                    />
                </MuiBox>
            </MuiBox>
        </MuiBox>
    );
}