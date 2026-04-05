import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListAvatar from '../../../../../../components/ListAvatar';
import WavingHand from '../../../../../../components/WavingHand';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Box from '@mui/material/Box';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import getFullName from '../../../../../../utils/getFullName';
import ParticipantItemMicButton from './ParticipantItemMicButton';
import { useRef } from 'react';
import { useState } from 'react';
import RemoteOptions from './RemoteOptions';
import LocalOptions from './LocalOptions';
import { useDispatch, useSelector } from 'react-redux';
import { updateConferenceData } from '../../../../../../redux/conference/conference';
import { useNotifications } from '@toolpad/core/useNotifications';
import useSocket from '../../../../../../hooks/useSocket';

const ParticipantItem = ({ variant, type, identity, mode, state }) => {
  const name = getFullName(identity);

  return (
    <ListItem
      secondaryAction={
        mode !== 'waiting' && (
          <Box display="flex" gap={1}>
            {state?.handRaised && <WavingHand />}
            <ParticipantItemMicButton
              type={type}
              isMicActive={state?.isMicActive}
              name={name}
              id={identity?.id}
            />
            <MoreOptions type={type} id={identity?.id} />
          </Box>
        )
      }
      alignItems="flex-start"
    >
      <ListItemAvatar>
        <ListAvatar id={identity.id} invisible src={identity.image}>
          {name?.charAt(0)}
        </ListAvatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            {name} {type === 'local' && '(vous)'}
          </>
        }
        slotProps={{
          primary: {
            variant: 'body2',
            noWrap: true,
            textOverflow: 'ellipsis',
          },
          secondary: {
            variant: 'caption',
          },
        }}
        secondary={
          mode === 'waiting' ? (
            <WaitingModeActions identity={identity} />
          ) : (
            texts.variants[variant]
          )
        }
      />
    </ListItem>
  );
};

const WaitingModeActions = ({ identity }) => {
  const dispatch = useDispatch();
  const bulkGuests = useSelector((store) => store.conference.meeting.guests);
  const roomId = useSelector((store) => store.conference.roomId);
  const notifications = useNotifications();
  const socket = useSocket();

  const handleResponse = (status) => () => {
    const guests = { ...bulkGuests };
    delete guests[identity.id];
    dispatch(
      updateConferenceData({
        key: ['meeting.guests'],
        data: [guests],
      })
    );
    const key = `${identity.id}-request-join-room`;
    notifications.close(key);
    socket.emit('response-join-room', { status, userId: identity.id, roomId });
  };
  return (
    <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
      <Button
        variant="contained"
        size="small"
        endIcon={<DoneOutlinedIcon />}
        onClick={handleResponse('accepted')}
      >
        Accepter
      </Button>
      <Button
        size="small"
        endIcon={<PersonRemoveOutlinedIcon />}
        variant="outlined"
        onClick={handleResponse('declined')}
      >
        Refuser
      </Button>
    </Box>
  );
};
const MoreOptions = ({ type, id }) => {
  const anchorElRef = useRef();
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <>
      <div>
        <Tooltip title="Plus d'options">
          <IconButton size="small" ref={anchorElRef} onClick={handleClick}>
            <MoreVertOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
      <Menu
        open={open}
        anchorEl={anchorElRef.current}
        onClose={onClose}
        slotProps={{ list: { dense: true } }}
      >
        {type === 'remote' ? (
          <RemoteOptions onClose={onClose} remoteId={id} />
        ) : (
          <LocalOptions onClose={onClose} />
        )}
      </Menu>
    </>
  );
};

const texts = {
  variants: {
    guest: 'Invité',
    moderator: 'Modérateur',
    collaborator: 'Collaborateur',
  },
};

export default React.memo(ParticipantItem);
