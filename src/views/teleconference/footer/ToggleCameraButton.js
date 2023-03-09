import { useEffect, useState } from "react";
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import IconButton from "../../../components/IconButton";
import { Tooltip } from "@mui/material";
import { useTeleconference } from "../../../utils/useTeleconferenceProvider";
import { useSelector } from "react-redux";

export default function ToggleCameraButton () {
  const type= useSelector(store => store.teleconference.type)
 const [turnOn, setTurnOn] = useState(type === 'video');
 const {calls: [user]} = useTeleconference();

 useEffect(() => {
  const videoTrack = user?.videoTrack;
  if(typeof videoTrack?.setEnabled === 'function')
      videoTrack.setEnabled(turnOn);
  console.log(turnOn);
},[user, turnOn]);

 return (
  <Tooltip
    arrow
    title={`${turnOn ? 'Arreter' : 'Allumer'} la caméra`}
  >
    <IconButton
        onClick={() => setTurnOn(turnOn => !turnOn)}
        sx={{mx: .5}}
        size="medium"
    >
      {turnOn ? 
      (<VideocamOutlinedIcon/> ) :
      (<VideocamOffOutlinedIcon/>)
      }
    </IconButton>
  </Tooltip>
 )
}