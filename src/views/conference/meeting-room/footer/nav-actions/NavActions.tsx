import React from 'react';
import Box from '@mui/material/Box';

import BottomNavigation from '@mui/material/BottomNavigation';
import Badge from '@mui/material/Badge';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useSelector, useDispatch } from 'react-redux';
import { updateConferenceData } from '@/redux/conference/conference';
import { useMemo } from 'react';
import navActions from './navActions';

const NavActions = () => {
  const isOrganizer = useSelector(
    (store) =>
      store.conference.meeting.participants[store.user.id].state.isOrganizer
  );

  const nav = useSelector((store) => store.conference.meeting.nav);
  const bulkParticipants = useSelector(
    (store) => store.conference.meeting.participants
  );
  const participants = useMemo(
    () =>
      Object.values(bulkParticipants).filter(({ state }) => state?.isInRoom)
        .length,
    [bulkParticipants]
  );
  const dispatch = useDispatch();

  const news = useMemo(
    () => ({
      chats: 0,
      participants,
      infos: 0,
      authParams: 0,
    }),
    [participants]
  );

  const auths = useMemo(
    () => ({
      isOrganizer,
    }),
    [isOrganizer]
  );

  const filterActions = useMemo(
    () =>
      navActions.filter(({ hiddenKeys }) =>
        hiddenKeys ? hiddenKeys.find((key) => auths[key]) : true
      ),
    [auths]
  );

  return (
    <Box display="flex" justifyContent="right">
      <BottomNavigation
        showLabels
        value={(nav.open && nav.id) || ''}
        sx={{
          background: 'none',
          width: '100%',
          p: 0,
          m: 0,
          '& .MuiBottomNavigationAction-root': {
            p: 0,
            m: 0,
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '10px!important',
          },
          '& .MuiBottomNavigationAction-root:disabled': {
            color: (t) => t.palette.action.disabled,
          },
        }}
      >
        {filterActions.map(({ id, label, disabled, icon: Icon }) => (
          <BottomNavigationAction
            key={id}
            label={label}
            disabled={disabled}
            icon={
              <Badge
                badgeContent={news[id]}
                color="primary"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: 10,
                    border: (t) =>
                      `2px solid ${(t.vars ?? t).palette.background.paper}`,
                    padding: '0 4px',
                  },
                }}
              >
                <Icon />
              </Badge>
            }
            value={id}
            sx={{ borderRadius: 1 }}
            onClick={() => {
              dispatch(
                updateConferenceData({
                  key: ['meeting.nav.id', 'meeting.nav.open'],
                  data: [id, nav.id === id ? !nav.open : true],
                })
              );
            }}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};

export default React.memo(NavActions);
