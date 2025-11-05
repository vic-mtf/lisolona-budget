import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import {
  Divider,
  Drawer,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Toolbar,
} from '@mui/material';
import RaiseHandButton from './RaiseHandButton';
import ReactionButton from './ReactionButton';
import PresentationViewButton from './PresentationViewButton';
import navActions from '../../nav-actions/navActions';
import { useDispatch, useSelector } from 'react-redux';
import { updateConferenceData } from '../../../../../../redux/conference/conference';
import SettingButton from '../../../../setup-room/device-config/buttons/SettingButton';
import PropTypes from 'prop-types';

const SmallScreenMoreOptions = ({ reaction }) => {
  const isOrganizer = useSelector(
    (store) =>
      store.conference.meeting.participants[store.user.id].state.isOrganizer
  );
  const [open, setOpen] = React.useState(false);
  const nav = useSelector((store) => store.conference.meeting.nav);
  const dispatch = useDispatch();

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

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box flexGrow={1} textAlign="end">
        <IconButton onClick={() => setOpen(true)}>
          <ExpandMoreOutlinedIcon />
        </IconButton>
      </Box>
      <Drawer open={open} onClose={onClose} anchor="bottom">
        <Toolbar sx={{ gap: 2 }}>
          <RaiseHandButton onClose={onClose} />
          <ReactionButton onClose={onClose} reaction={reaction} />
          <PresentationViewButton onClose={onClose} />
          <SettingButton onClose={onClose} />
        </Toolbar>
        <Divider />
        {filterActions.map((action) => (
          <MenuItem
            key={action.id}
            onClick={() => {
              onClose();
              dispatch(
                updateConferenceData({
                  key: ['meeting.nav.id', 'meeting.nav.open'],
                  data: [action.id, nav.id === action.id ? !nav.open : true],
                })
              );
            }}
            selected={nav.open && nav.id === action.id}
          >
            <ListItemIcon>
              <action.icon />
            </ListItemIcon>
            <ListItemText primary={action.label} />
          </MenuItem>
        ))}
      </Drawer>
    </>
  );
};
SmallScreenMoreOptions.propTypes = {
  reaction: PropTypes.bool,
};

export default SmallScreenMoreOptions;
