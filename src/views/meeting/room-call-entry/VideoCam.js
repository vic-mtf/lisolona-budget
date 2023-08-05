import { Box as MuiBox } from "@mui/material";
import AvatarProfile from "./AvatarProfile";
import FooterButtons from "../../home/checking/FooterButtons";
import { useRef } from "react";
import useGetMediaStream from "../actions/useGetMediaStream";
import useVideoStreamState from "../actions/useVideoStreamState";

export default function VideoCam () {
    const videoRef = useRef();
    const handleGetMediaStream = useGetMediaStream();
    useVideoStreamState(videoRef);
    
    return (
        <MuiBox
            position="relative"
            display="flex"
            alignItems="end"
            width={{
                lg: 600,
                md: 450,
                sm: 400,
                xs: '100%'
            }}
            height={{
                lg: 600 * 9 / 16,
                md: 450 * 9 / 16,
                sm: 400 * 9 / 16,
                xs: window.innerWidth * 9 / 16
            }}
            borderRadius={1}
            sx={{
                backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                "& video, & .avatar-profile": {
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    bgcolor: 'black',
                    borderRadius: 1,
                    transform: 'scaleX(-1)',
                    boxShadow: 1,
                    zIndex: -1,
                },
                '& .avatar-profile': {
                    boxShadow: 0,
                    transform: 'none',
                    background: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zindex: 1,
                } 
            }}
        >
            <video 
                ref={videoRef}
                autoPlay
                muted
            />
            <AvatarProfile/>
            <FooterButtons
                handleGetMediaStream={handleGetMediaStream}
            />
        </MuiBox>
    )
}