import { SpeedDial, styled } from "@mui/material";

const CustomSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: 'absolute',
    height: 35,
    [
        `&.MuiSpeedDial-directionUp, 
         &.MuiSpeedDial-directionLeft,
         &.MuiSpeedDial-directionDown, 
         &.MuiSpeedDial-directionRight
        `
    ]: {
        bottom: 0,
        left: 0,
        margrin: 0,
    },
  }));

  export default CustomSpeedDial