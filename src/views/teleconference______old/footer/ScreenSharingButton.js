import { useCallback, useRef, useState } from "react";
import IconButton from "../../../components/IconButton";
import { Tooltip } from "@mui/material";
import PresentToAllRoundedIcon from '@mui/icons-material/PresentToAllRounded';
import CancelPresentationRoundedIcon from '@mui/icons-material/CancelPresentationRounded';
import { useTeleconference } from "../../../utils/useTeleconferenceProvider";
import AgoraRTC from "agora-rtc-sdk-ng";

export default function ScreenSharingButton () {
  const [turnOn, setTurnOn] = useState(false);
  const { agoraEngine, setCalls, setLoading } = useTeleconference();
  const screenTrackRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const [disabled, setDisabled] = useState(false);
  const handleScreenShare = useCallback(async () => {
    setDisabled(true);
    setLoading(true);
    if(!turnOn) {
      const screenTrack = await AgoraRTC.createScreenVideoTrack();
      let localVideoTrack;
      agoraEngine?.localTracks.forEach(strack => {
          if(strack?.mediaType === 'video')
            localVideoTrack = strack;
      });
      localVideoTrackRef.current = localVideoTrack;
      localVideoTrack?.stop();
      // Unpublish the local video track.
      await agoraEngine.unpublish(localVideoTrack);
      // Publish the screen track.
      await agoraEngine.publish(screenTrack);
      // Play the screen track on local container.
      setCalls(_calls => {
        const calls = [..._calls];
        const localStrack = calls[0];
        calls[0] = {
          ...localStrack,
          videoTrack: screenTrack,
        };
        return calls;
      });
      screenTrackRef.current = screenTrack;
      setTurnOn(true);
    } else {
      const screenTrack = screenTrackRef.current;
       // Stop playing the screen track.
       screenTrack.stop();
       // Unpublish the screen track.
       await agoraEngine.unpublish(screenTrack);
       // Publish the local video track.
       const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
       await agoraEngine.publish(localVideoTrack);
       //Play the local video on the local container.
       setCalls(_calls => {
        const calls = [..._calls];
        const localStrack = calls[0];
        calls[0] = {
          ...localStrack,
          videoTrack: localVideoTrack,
        };
        return calls;
      });
       setTurnOn(false);
    }
    setDisabled(false);
    setLoading(false);
  }, [setCalls, AgoraRTC, agoraEngine, turnOn, setLoading])
 return (
  <Tooltip
    arrow
    title={turnOn  ? 'Présenter maitenant' : 'Arreter la présentation'}
  >
    <IconButton
        onClick={handleScreenShare}
        sx={{mx: .5}}
        size="medium"
        disabled={disabled}
    >
      {turnOn ? 
      (<CancelPresentationRoundedIcon/> ) :
      (<PresentToAllRoundedIcon/>)
      }
    </IconButton>
  </Tooltip>
 )
}