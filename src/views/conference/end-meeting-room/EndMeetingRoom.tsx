import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import AccessTime from '@mui/icons-material/AccessTime';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { alpha, AvatarGroup } from '@mui/material';
import CountdownTimer from '@/components/CountdownTimer';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import ListAvatar from '@/components/ListAvatar';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { darken, lighten } from '@mui/material/styles';
import {
  initConferenceData,
  updateConferenceData,
} from '@/redux/conference/conference';
import { useDispatch, useSelector } from 'react-redux';
import getFullName from '@/utils/getFullName';
import useLocalStoreData from '@/hooks/useLocalStoreData';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate } from 'react-router-dom';

const EndMeeting = React.forwardRef((_, ref) => {
  const [getData] = useLocalStoreData('conference.meeting.startedAt');
  const isGuest = useSelector((store) => store.user.isGuest);
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const participants = useSelector(
    (store) => store.conference.meeting.participants
  );

  const meetingDuration = formatElapsedTime(getData());

  const handleRejoin = () => {
    dispatch(
      updateConferenceData({
        key: ['step'],
        data: ['setup'],
      })
    );
  };

  const handleGoHome = () => {
    if (isGuest) {
      navigateTo('/', { replace: true });
      setTimeout(() => {
        dispatch(initConferenceData({ key: ['meeting', 'step'] }));
      }, 2000);

      return;
    }
    window.focus();
    window.close();
  };

  return (
    <Box
      ref={ref}
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 1,
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: '100%',
        }}
        elevation={0}
      >
        <CardContent>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <CountdownTimer seconds={30} onComplete={handleGoHome} />
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
              my={2}
            >
              <Typography variant="h6">Fin de la réunion</Typography>
            </Stack>
          </Box>

          {/* Meeting Stats */}
          <Box
            sx={{
              bgcolor: (t) =>
                t.palette.mode === 'dark'
                  ? lighten(t.palette.background.paper, 0.03)
                  : darken(t.palette.background.paper, 0.03),

              borderRadius: 2,
              p: 2.5,
              mb: 3,
            }}
          >
            <Box
              direction="row"
              justifyContent="center"
              gap={{
                xs: 2,
                md: 4,
              }}
              alignItems="center"
              display="flex"
              flexDirection={{
                xs: 'column',
                md: 'row',
              }}
              //justifyContent="center"
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                    borderRadius: 1.5,
                    p: 1,
                    display: 'flex',
                  }}
                >
                  <AccessTime />
                </Box>
                <Typography variant="body1" fontWeight={400} align="center">
                  {meetingDuration}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={3} alignItems="center">
                <Box
                  sx={{
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                    borderRadius: 1.5,
                    p: 1,
                    display: 'flex',
                  }}
                >
                  <GroupOutlinedIcon />
                </Box>
                <AvatarGroup
                  variant="rounded"
                  max={4}
                  sx={{
                    '& 	.MuiAvatar-root': {
                      width: 30,
                      height: 30,
                      fontSize: 14,
                      transform: 'rotate(45deg)',
                      borderColor: (t) =>
                        t.palette.mode === 'dark'
                          ? lighten(t.palette.background.paper, 0.03)
                          : darken(t.palette.background.paper, 0.03),
                    },
                  }}
                >
                  {Object.values(participants).map(({ identity }) => (
                    <ListAvatar
                      key={identity.id}
                      src={identity.image}
                      id={identity.id}
                    >
                      {getFullName(identity).charAt(0)}
                    </ListAvatar>
                  ))}
                </AvatarGroup>
              </Stack>
            </Box>
          </Box>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Évaluez votre expérience de la réunion
            </Typography>
            <Rating
              name="meeting-rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              size="large"
            />
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              fullWidth
              onClick={handleGoHome}
              endIcon={isGuest ? <HomeOutlinedIcon /> : <LogoutOutlinedIcon />}
            >
              {isGuest ? "Page d'accueil" : 'Fermer'}
            </Button>
            <Button
              variant="contained"
              size="large"
              fullWidth
              endIcon={<MeetingRoomOutlinedIcon />}
              onClick={handleRejoin}
            >
              Rejoindre
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
});

const formatElapsedTime = (timestamp) => {
  const elapsedMs = Date.now() - timestamp;
  const totalSeconds = Math.floor(elapsedMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num) => String(num).padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else {
    return `${pad(minutes)}:${pad(seconds)}`;
  }
};

EndMeeting.displayName = 'EndMeeting';

export default EndMeeting;
