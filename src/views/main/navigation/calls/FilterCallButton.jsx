import React, { useMemo, useState } from 'react';
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import PropTypes from 'prop-types';
import { groupTypes } from './groupCall';

export default function FilterCallButton({ type = 'all', onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const chipProps = useMemo(() => {
    const data = groupTypes.find(({ id }) => id === type) || {};
    return {
      children: data.label,
      icon: data.icon,
    };
  }, [type]);

  return (
    <>
      <Button
        {...chipProps}
        color="inherit"
        endIcon={<ExpandMoreOutlinedIcon />}
        variant="outlined"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        startIcon={React.createElement(
          groupTypes.find(({ id }) => id === type)?.icon
        )}
      />
      <Menu
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
      >
        {groupTypes.map(({ id, label, icon }) => (
          <MenuItem
            key={id}
            onClick={(event) => {
              if (typeof onChange === 'function') onChange(event, id);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              {type === id ? <CheckOutlinedIcon /> : <div />}
            </ListItemIcon>
            <ListItemIcon>{React.createElement(icon)}</ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

FilterCallButton.propTypes = {
  type: PropTypes.oneOf(groupTypes.map(({ id }) => id)).isRequired,
  onChange: PropTypes.func,
};
