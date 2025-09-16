import {
  Backdrop,
  Box,
  Fade,
  Typography,
  LinearProgress,
  alpha,
} from "@mui/material";
import SetupRoom from "./setup-room/SetupRoom";
import { useSelector } from "react-redux";
import ListerStream from "./ListerStream";
import MeetingRoom from "./meeting-room/MeetingRoom";
import ConferenceInboundEventDetector from "../../components/ConferenceInboundEventDetector";

const Conference = () => {
  const step = useSelector((store) => store.conference.step);
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flex: 1,
          "& > div": {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
        }}>
        <Fade in={step === "setup"} unmountOnExit appear={false}>
          <SetupRoom />
        </Fade>
        <Fade in={step === "meeting"} unmountOnExit appear={false}>
          <MeetingRoom />
        </Fade>
      </Box>
      <ListerStream />
      <ConferenceInboundEventDetector />
      <Loading />
    </>
  );
};

const Loading = () => {
  const loading = useSelector((store) => store.conference.loading);
  return (
    <Backdrop
      open={loading}
      component={Typography}
      timeout={600}
      sx={{
        background: (t) =>
          alpha(
            t.palette.common[t.palette.mode === "light" ? "white" : "black"],
            0.98
          ),
        zIndex: (t) => t.zIndex.modal,
        backdropFilter: (t) => `blur(${t.spacing(2)})`,
        flexDirection: "column",
      }}>
      <LinearProgress
        color='inherit'
        sx={{ position: "absolute", top: 0, width: "100%" }}
      />
      <Box
        mx={2}
        textAlign='center'
        display='flex'
        flexDirection='column'
        alignItems='center'
        gap={2}>
        <Typography component='span' variant='h6'>
          Démarrage dans quelques instants...
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default Conference;
