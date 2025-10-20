import { useCallback, useMemo } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
// import Divider from '@mui/material/Divider';
import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import { useDispatch, useSelector } from 'react-redux';
import useSocket from '../../../../../hooks/useSocket';

const ModerationOptions = () => {
  const socket = useSocket();
  const dispatch = useDispatch();

  const controlled = useSelector(
    (state) => state.conference.meeting.organizerAuth.controlAuthorization
  );
  const shareScreen = useSelector(
    (state) => state.conference.meeting.organizerAuth.shareScreen
  );
  const reaction = useSelector(
    (state) => state.conference.meeting.organizerAuth.react
  );
  const activateCam = useSelector(
    (state) => state.conference.meeting.organizerAuth.activateCam
  );
  const activateMic = useSelector(
    (state) => state.conference.meeting.organizerAuth.activateMic
  );

  const isOrganizer = useSelector(
    (state) =>
      state.conference.meeting.participants[state.user.id].state.isOrganizer
  );

  const controls = useMemo(
    () => ({
      shareScreen,
      activateCam,
      activateMic,
      react: reaction,
    }),
    [shareScreen, activateCam, activateMic, reaction]
  );

  const handleToggle = useCallback(
    (type) => (_, v) => {
      if (!isOrganizer) return;
      socket.emit('update-auth-room', { [type]: v });
      dispatch({
        type: 'conference/updateConferenceData',
        payload: {
          data: { meeting: { organizerAuth: { [type]: v } } },
        },
      });
    },
    [socket, dispatch, isOrganizer]
  );

  return (
    <List
      sx={{ width: '100%', mt: 2 }}
      subheader={
        <ListSubheader
          sx={{
            fontWeight: 'bold',
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
            borderTop: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          Modération de la réunion
        </ListSubheader>
      }
    >
      <ListItem alignItems="flex-start">
        <ListItemText
          primary="Gestion des hôtes"
          slotProps={{
            primary: {
              sx: { fontWeight: 'bold' },
            },
            secondary: {
              color: 'text.secondary',
              display: 'inline',
              variant: 'caption',
            },
          }}
          secondary={
            'vous offrent la possibilité de restreindre les actions que les participants peuvent entreprendre lors de la réunion.'
          }
        />
        <Switch
          edge="end"
          onChange={handleToggle('controlAuthorization')}
          checked={controlled}
        />
      </ListItem>
      <ListItem alignItems="flex-start" sx={{ m: 0, p: 0, pl: 2 }}>
        <List
          sx={{ width: '100%' }}
          subheader={
            <ListSubheader sx={{ fontWeight: 'bold' }} disableSticky>
              Modération de la réunion
            </ListSubheader>
          }
        >
          {options.map(({ id, label, icon: Icon = 'div' }) => (
            <ListItem key={id}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText
                id={id}
                primary={label}
                slotProps={{ primary: { variant: 'body2' } }}
              />
              <Switch
                edge="end"
                onChange={handleToggle(id)}
                checked={controls[id]}
                disabled={!controlled}
              />
            </ListItem>
          ))}
        </List>
      </ListItem>
    </List>
  );
};

const options = [
  {
    id: 'shareScreen',
    label: 'Partager d’écran',
    icon: ScreenShareOutlinedIcon,
  },
  {
    id: 'react',
    label: 'Envoyer des réactions',
    icon: SentimentSatisfiedAltOutlinedIcon,
  },
  {
    id: 'activateCam',
    label: 'Caméra',
    icon: VideocamOutlinedIcon,
  },
  {
    id: 'activateMic',
    label: 'Micro',
    icon: MicNoneOutlinedIcon,
  },
];

export default ModerationOptions;
