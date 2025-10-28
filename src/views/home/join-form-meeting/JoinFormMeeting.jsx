import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import {
  Backdrop,
  Box,
  Fade,
  FormLabel,
  LinearProgress,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import useAxios from '../../../hooks/useAxios';
import CodeMeeting from './CodeMeeting';
import IdentifyForm from './IdentifyForm';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import PropTypes from 'prop-types';
import LocalSaveUser from './LocalSaveUser';
import { useSelector } from 'react-redux';

export default function JoinFormMeeting({ message }) {
  const { state, search } = useLocation();
  const meetingData = useMemo(() => state?.meeting, [state?.meeting]);

  const navigateTo = useNavigate();

  const code = useMemo(() => {
    let v;
    try {
      v = queryString.parse(search)?.code || null;
    } catch (error) {
      console.error(error);
    }
    return meetingData?._id || v;
  }, [search, meetingData?._id]);

  const [{ loading }, refetch] = useAxios(
    {
      url: `api/chat/room/call/${code}`,
      method: 'GET',
    },
    { manual: true }
  );
  const isGuest = useSelector((store) => store.user.isGuest);

  const [step, setStep] = useState(() => (isGuest ? 1 : 0));

  return (
    <>
      <Box
        position="relative"
        width="100%"
        display="flex"
        justifyItems="center"
        alignItems="center"
        sx={{
          '& > div': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
            flexDirection: 'column',
          },
        }}
      >
        <Fade unmountOnExit in={!meetingData}>
          <Box display="flex">
            <CodeMeeting loading={loading} code={code} refetch={refetch} />
          </Box>
        </Fade>
        <Fade
          unmountOnExit
          in={!!meetingData}
          style={{ position: 'absolute', top: 0, overflow: 'hidden' }}
        >
          <Box position="relative" display="flex" height={300}>
            <Toolbar sx={{ gap: 1, mb: 2 }} disableGutters variant="dense">
              <Tooltip title="Retour" arrow>
                <IconButton
                  onClick={() => {
                    setStep(isGuest ? 1 : 0);
                    if (step === 0 && isGuest) setStep(1);
                    else navigateTo('/', { replace: true });
                  }}
                >
                  <ArrowBackOutlinedIcon />
                </IconButton>
              </Tooltip>
              <FormLabel sx={{ flexGrow: 1 }}>
                Identifiez vous pour participer à la réunion
              </FormLabel>
            </Toolbar>
            <Box position="relative">
              <Slide in={step === 0} direction={isGuest ? 'left' : 'right'}>
                <Box>
                  <IdentifyForm
                    loading={loading}
                    code={code}
                    refetch={refetch}
                  />
                </Box>
              </Slide>
              <Slide
                in={step === 1}
                style={{ position: 'absolute', top: 0 }}
                direction="right"
              >
                <Box>
                  <LocalSaveUser
                    setStep={setStep}
                    refetch={refetch}
                    code={code}
                  />
                </Box>
              </Slide>
            </Box>
          </Box>
        </Fade>
      </Box>
      <Backdrop
        open={loading}
        sx={{
          background: (theme) =>
            theme.palette.background.paper + theme.customOptions.opacity,
        }}
      >
        <LinearProgress
          sx={{
            width: '100%',
            position: 'absolute',
            top: 0,
          }}
        />
        {message && <Typography mt={2}>{message}</Typography>}
      </Backdrop>
    </>
  );
}

JoinFormMeeting.propTypes = {
  message: PropTypes.string,
};
