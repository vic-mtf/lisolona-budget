import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
// import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ThreePOutlinedIcon from '@mui/icons-material/ThreePOutlined';
const MessageOptions = () => {
  const [messaging, setMessaging] = React.useState(false);

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
          onChange={(_, v) => setMessaging(v)}
          checked={messaging}
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
            <Switch edge="end" disabled={!messaging} size="small" />
          </ListItem>
        </List>
      </ListItem>
    </List>
  );
};

export default MessageOptions;
