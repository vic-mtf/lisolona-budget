import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
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
import useAxios from '../../../hooks/useAxios';
import CodeMeeting from './CodeMeeting';
import IdentifyForm from './IdentifyForm';
import { useNavigate } from 'react-router-dom';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import PropTypes from 'prop-types';
export default function JoinFormMeeting({ message }) {
  const location = useLocation();
  const meetingData = useMemo(
    () => location?.state?.meeting,
    [location.state?.meeting]
  );

  const navigateTo = useNavigate();

  const code = useMemo(() => {
    try {
      return queryString.parse(location.search)?.code;
    } catch (error) {
      console.error(error);
    }
    return null;
  }, [location.search]);

  const [{ loading }, refetch] = useAxios(
    {
      url: `api/chat/room/call/${code}`,
      method: 'GET',
    },
    { manual: true }
  );

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
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          },
        }}
      >
        <Fade unmountOnExit in={!meetingData}>
          <Box display="flex">
            <CodeMeeting loading={loading} code={code} refetch={refetch} />
          </Box>
        </Fade>
        <Fade unmountOnExit in={!!meetingData}>
          <Box display="flex" gap={2}>
            <Toolbar sx={{ gap: 1 }} disableGutters variant="dense">
              <Tooltip title="Retour" arrow>
                <IconButton onClick={() => navigateTo('/', { replace: true })}>
                  <ArrowBackOutlinedIcon />
                </IconButton>
              </Tooltip>
              <FormLabel sx={{ flexGrow: 1 }}>
                Identifiez vous pour participer à la réunion
              </FormLabel>
            </Toolbar>
            <IdentifyForm
              loading={loading}
              code={code || meetingData?._id}
              refetch={refetch}
            />
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
