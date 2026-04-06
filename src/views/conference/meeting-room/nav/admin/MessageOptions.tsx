import { useCallback } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
// import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ThreePOutlinedIcon from '@mui/icons-material/ThreePOutlined';
import { useDispatch, useSelector } from 'react-redux';
import useSocket from '@/hooks/useSocket';

const MessageOptions = () => {
  const writeMessage = useSelector(
    (store) => store.conference.meeting.organizerAuth.writeMessage
  );
  const allowPrivateMessage = useSelector(
    (store) => store.conference.meeting.organizerAuth.allowPrivateMessage
  );
  const dispatch = useDispatch();
  const socket = useSocket();

  const isOrganizer = useSelector(
    (store) =>
      store.conference.meeting.participants[store.user.id].state.isOrganizer
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
          Modération de la messagerie
        </ListSubheader>
      }
    >
      <ListItem alignItems="flex-start">
        <ListItemText
          primary="Autoriser les participants à envoyer des messages"
          secondary="Si cette autorisation est désactivée, seuls les modérateurs peuvent envoyer des messages. Cela permet de limiter les interruptions ou de garder le contrôle sur les échanges pendant la session."
          slotProps={{
            primary: {
              fontWeight: 'bold',
            },
            secondary: {
              variant: 'caption',
              color: 'text.secondary',
            },
          }}
        />
        <Switch
          edge="end"
          onChange={handleToggle('writeMessage')}
          checked={writeMessage}
        />
      </ListItem>
      <ListItem alignItems="flex-start" sx={{ m: 0, p: 0, pl: 2 }}>
        <List sx={{ width: '100%' }}>
          <ListItem>
            <ListItemIcon>
              <ThreePOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary="Autoriser les messages privés"
              slotProps={{ primary: { variant: 'body2' } }}
            />
            <Switch
              edge="end"
              disabled={!writeMessage}
              size="small"
              checked={allowPrivateMessage}
              onChange={handleToggle('allowPrivateMessage')}
            />
          </ListItem>
        </List>
      </ListItem>
    </List>
  );
};

export default MessageOptions;
