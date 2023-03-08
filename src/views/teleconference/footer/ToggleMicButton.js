import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import { Tooltip } from '@mui/material';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import IconButton from "../../../components/IconButton";
import { useTeleconference } from '../../../utils/useTeleconferenceProvider';

export default function ToggleMicButton () {
    const [turnOn, setTurnOn] = useState(true);
    const {calls: [user]} = useTeleconference();
    useEffect(() => {
      const audioTrack = user?.audioTrack;
      if(typeof audioTrack?.setEnabled === 'function')
          audioTrack?.setEnabled(turnOn);
    },[user, turnOn]);

 return (
  <Tooltip
    arrow
    title={`${turnOn ? 'Arreter' : 'Allumer'} le micro`}
  >
    <IconButton
        onClick={() => setTurnOn(turnOn => !turnOn)}
        sx={{mx: 1}}
    >
      {turnOn ? 
      (<KeyboardVoiceOutlinedIcon fontSize="small" /> ) :
      (<MicOffOutlinedIcon fontSize="small" />)
      }
    </IconButton>
  </Tooltip>
 )
}