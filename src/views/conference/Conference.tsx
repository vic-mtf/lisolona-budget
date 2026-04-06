import {
  Backdrop,
  Box,
  Fade,
  Typography,
  LinearProgress,
  alpha,
} from '@mui/material';
import SetupRoom from './setup-room/SetupRoom';
import { useSelector } from 'react-redux';
import ListerStream from './ListerStream';
import MeetingRoom from './meeting-room/MeetingRoom';
import ConferenceInboundEventDetector from '@/components/ConferenceInboundEventDetector';
import EndMeeting from './end-meeting-room/EndMeetingRoom';

const Conference = () => {
  const step = useSelector((store) => store.conference.step);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flex: 1,
        }}
      >
        {steps.map(({ id, children }) => (
          <Fade
            in={id === step}
            appear={false}
            key={id}
            unmountOnExit
            timeout={500}
            style={{
              display: 'flex',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <div>{children}</div>
          </Fade>
        ))}
      </Box>
      <ListerStream />
      <ConferenceInboundEventDetector />
      <Loading />
    </>
  );
};
const steps = [
  { id: 'setup', children: <SetupRoom /> },
  { id: 'meeting', children: <MeetingRoom /> },
  { id: 'end', children: <EndMeeting /> },
];

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
            t.palette.common[t.palette.mode === 'light' ? 'white' : 'black'],
            0.98
          ),
        zIndex: (t) => t.zIndex.modal,
        backdropFilter: (t) => `blur(${t.spacing(2)})`,
        flexDirection: 'column',
      }}
    >
      <LinearProgress
        color="inherit"
        sx={{ position: 'absolute', top: 0, width: '100%' }}
      />
      <Box
        mx={2}
        textAlign="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Typography component="span" variant="h6">
          Démarrage dans quelques instants...
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default Conference;
