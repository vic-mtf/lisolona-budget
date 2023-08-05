import { Toolbar } from "@mui/material";
import React, { useCallback } from "react";
import VideoCallButton from "./VideoCallButton";
import VoiceCallButton from "./VoiceCallButton";
import CancelCallButton from "./CancelCallButton";
import HangupButton from "./HangupButton";
import CameraButton from "./CameraButton";
import MicroButton from "./MicroButton";
import AnswerButton from "./AnswerButton";
import useGetMediaStream from "../actions/useGetMediaStream";

export default function FooterOptions ({handleCall, callState, setCallState}) {
    const handleGetMediaStream = useGetMediaStream();
    const showButton = useCallback((...states) => states.includes(callState), [callState]);

    return (
        <Toolbar
            variant="dense"
            disableGutters
            sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                mb: '2.5%',
                zIndex: theme => theme.zIndex.fab,
                "&  > *" : {
                    width: 70
                }
            }}
        >
            {showButton('before') &&
                <React.Fragment>
                    <VideoCallButton
                        handleCall={() => handleCall()}
                    />
                    <CancelCallButton/>
                    <VoiceCallButton
                        handleCall={() => handleCall('audio')}
                    />
                </React.Fragment>
            }
            {showButton('waiting', 'outgoing', 'incoming', 'busy', 'ringing') &&
                <React.Fragment>
                    <CameraButton
                        getVideoStream={() => handleGetMediaStream('video')}
                    />
                    <MicroButton
                        getAudioStream={() => handleGetMediaStream('audio')}
                    />
                    {showButton('incoming') && 
                        <AnswerButton
                            handleCall={() => handleCall('video')}
                        />
                    }
                    <HangupButton
                        setCallState={setCallState}
                    />
                </React.Fragment>
            }
        </Toolbar>
    );
}
