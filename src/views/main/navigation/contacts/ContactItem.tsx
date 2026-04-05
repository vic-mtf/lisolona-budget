import React from 'react';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  Stack,
  Tooltip,
} from '@mui/material';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import AvatarStatus from '../../../../components/AvatarStatus';
import HighlightWord from '../../../../components/HighlightWord';

const ContactItem = ({
  selected,
  name,
  image,
  id,
  email,
  divider,
  checkable,
  checked,
  search,
  onStartCall,
  CheckboxProps,
  ...otherProps
}) => {
  return (
    <div>
      <ListItem
        disablePadding
        alignItems="flex-start"
        secondaryAction={
          checkable ? (
            <Checkbox
              edge="end"
              checked={checked}
              slotProps={{ input: { 'aria-labelledby': id } }}
              {...CheckboxProps}
            />
          ) : (
            <Tooltip title="Appeler">
              <IconButton edge="end" onClick={onStartCall}>
                <CallOutlinedIcon />
              </IconButton>
            </Tooltip>
          )
        }
      >
        <ListItemButton selected={selected} {...otherProps}>
          <ListItemAvatar>
            <AvatarStatus src={image} alt={name} id={id}>
              {name?.toUpperCase()?.charAt(0)}
            </AvatarStatus>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Stack direction="row" spacing={1}>
                <Typography
                  flexGrow={1}
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  fontWeight={550}
                >
                  {<HighlightWord word={search} text={name} />}
                </Typography>
              </Stack>
            }
            secondary={
              <Stack direction="row" spacing={1}>
                <Typography
                  alignItems="center"
                  flexGrow={1}
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  color="text.secondary"
                  variant="body2"
                >
                  {<HighlightWord word={search} text={email} />}
                </Typography>
              </Stack>
            }
            slotProps={{
              primary: { component: 'div' },
              secondary: { component: 'div' },
            }}
          />
        </ListItemButton>
      </ListItem>
      <Divider variant="inset" sx={{ opacity: divider ? 1 : 0 }} />
    </div>
  );
};

ContactItem.displayName = 'ContactItem';

export default React.memo(ContactItem);
