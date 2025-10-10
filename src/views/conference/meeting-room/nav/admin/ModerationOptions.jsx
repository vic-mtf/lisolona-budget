import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
const ModerationOptions = () => {
  const [controlled, setControlled] = React.useState(true);
  const [checked, setChecked] = React.useState(['wifi']);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

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
          onChange={(_, v) => setControlled(v)}
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
                onChange={handleToggle('screen')}
                checked={checked.includes('screen')}
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
    id: 'screenSharing',
    label: 'Partager d’écran',
    icon: ScreenShareOutlinedIcon,
  },
  {
    id: 'react',
    label: 'Envoyer des réactions',
    icon: SentimentSatisfiedAltOutlinedIcon,
  },
  {
    id: 'Activer la vidéo',
    label: 'Caméra',
    icon: VideocamOutlinedIcon,
  },
  {
    id: 'Allumer micro',
    label: 'Microphone',
    icon: MicNoneOutlinedIcon,
  },
];

export default ModerationOptions;
