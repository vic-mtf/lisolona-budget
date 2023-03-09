import { useState } from "react";
import IconButton from "../../../components/IconButton";
import { Tooltip } from "@mui/material";
import PresentToAllRoundedIcon from '@mui/icons-material/PresentToAllRounded';
import CancelPresentationRoundedIcon from '@mui/icons-material/CancelPresentationRounded';

export default function ScreenSharingButton () {
  const [turnOn, setTurnOn] = useState(false);

 return (
  <Tooltip
    arrow
    title={turnOn  ? 'Présenter maitenant' : 'Arreter la présentation'}
  >
    <IconButton
        onClick={() => setTurnOn(turnOn => !turnOn)}
        sx={{mx: .5}}
        size="medium"
    >
      {turnOn ? 
      (<CancelPresentationRoundedIcon/> ) :
      (<PresentToAllRoundedIcon/>)
      }
    </IconButton>
  </Tooltip>
 )
}