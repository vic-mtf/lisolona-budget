import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import RecommendOutlinedIcon from '@mui/icons-material/RecommendOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../../../../utils/SocketIOProvider';
import { setConferenceData } from '../../../../../redux/conference';
import store from '../../../../../redux/store';

export default function MeetingManagementOptions() {
    const checked = useSelector(store => store.conference.moderatorOptions.meetingManagement);
    const dispatch = useDispatch();
    const socket = useSocket();
    const participants = useSelector(store => store.conference.participants);
    const disabled = React.useMemo(() => !checked,[checked]);
  

  return (
    <List
      subheader={
        <ListSubheader
            sx={{
                fontSize: 12
            }}
        >AUTORISATIONS APPLIQUÉE À TOUS</ListSubheader>
      }
     sx={{
        p: 2
     }}
    >
        {options.map(({key, icon, label, description}) => {
            const auth = getAuth(participants, key);
            const disabledAuth = auth === undefined;
            const state = Boolean(auth);
            return (
                <ListItem
                    key={key}
                    disabled={disabled || disabledAuth}
                    alignItems="flex-start"
                >
                    <ListItemIcon>
                        {icon}
                    </ListItemIcon>
                    <ListItemText 
                        id={`switch-list-label-${label}`}
                        primary={label}
                        secondary={description}
                        secondaryTypographyProps={{
                            variant: 'caption'
                        }}
                    />
                    <Switch
                        edge="end"
                        size="small"
                        checked={state}
                        disabled={disabled || disabledAuth}
                        onChange={() => {
                            // dispatch(setConferenceData({ data: { handRaised: state }}));
                            console.log(participants.map(({identity}) => identity?._id))
                            socket.emit('signal', {
                                id: store.getState().meeting.meetingId,
                                type: 'auth',
                                obj: {[key]: !state},
                                who: participants.map(({identity}) => identity?._id),
                            });
                        }}
                    />
            </ListItem>
            )
        })}
    </List>
  );
}

export const options = [
    {
        label: 'Partage écran',
        key: 'shareScreen',
        icon: <ScreenShareOutlinedIcon fontSize="small" />,
        // description: `
        // Ceci est valable pour toutes 
        // les personnes appartenant au groupe, 
        // à l’exception des invités.`
    },
    {
        label: 'Réaction',
        icon: <RecommendOutlinedIcon fontSize="small" />,
        key: 'reaction',
    },
    {
        label: 'Envoie des messages',
        key: 'sendMessage',
        icon: <MessageOutlinedIcon fontSize="small" />,
        description: ``
    },
    {
        label: 'Activer le micron',
        key: 'activeMicro',
        icon: <KeyboardVoiceOutlinedIcon fontSize="small" />,
        description: ``
    },
    {
        label: 'Activer la caméra',
        key: 'activeCamera',
        icon: <VideocamOutlinedIcon fontSize="small" />,
        description: ``
    }
];

const getAuth = (participants, key) => 
participants.every(({auth}) => auth[key] === undefined) ?
undefined : participants.every(({auth}) => auth[key])