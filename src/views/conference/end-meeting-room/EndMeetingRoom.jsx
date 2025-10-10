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
import CountdownTimer from '../../../components/CountdownTimer';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import ListAvatar from '../../../components/ListAvatar';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { darken, lighten } from '@mui/material/styles';
import { updateConferenceData } from '../../../redux/conference/conference';
import { useDispatch, useSelector } from 'react-redux';
import getFullName from '../../../utils/getFullName';

const EndMeeting = React.forwardRef((_, ref) => {
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const participants = useSelector(
    (store) => store.conference.meeting.participants
  );

  const meetingDuration = '45 min 32 sec';

  const handleRejoin = () => {
    dispatch(
      updateConferenceData({
        key: ['step'],
        data: ['setup'],
      })
    );
  };

  const handleGoHome = () => {
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
            <CountdownTimer seconds={20} onComplete={handleGoHome} />
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
              <Stack direction="row" spacing={2} alignItems="center">
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
                  //variant="rounded"
                  max={4}
                  sx={{
                    '& 	.MuiAvatar-root': {
                      width: 30,
                      height: 30,
                      fontSize: 14,
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
              endIcon={<LogoutOutlinedIcon />}
            >
              Fermer
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

EndMeeting.displayName = 'EndMeeting';

export default EndMeeting;
