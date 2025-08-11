import React from "react";
import {
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ListAvatar from "../../../../components/ListAvatar";
import getFullName from "../../../../utils/getFullName";
import PropTypes from "prop-types";
import { timeElapses } from "../../../../utils/formatDate";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";

const RunningCallItem = ({
  location,
  divider,
  createdAt,
  createdBy,
  incoming,
  participants,
  onClickDetail,
  onCallAction,
  ...otherProps
}) => {
  const name = getFullName(location);

  return (
    <div>
      <ListItem
        secondaryAction={
          <Tooltip title='Details' onClick={onClickDetail}>
            <IconButton edge='end'>
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        }
        alignItems='flex-start'
        sx={{ flexGrow: 1 }}
        disablePadding
        {...otherProps}>
        <ListItemButton onClick={onCallAction}>
          <ListItemAvatar>
            <ListAvatar
              src={location?.image}
              alt={name}
              id={location?.id}
              status='online'
              active>
              {name?.toUpperCase()?.charAt(0)}
            </ListAvatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Stack direction='row' spacing={1}>
                <Typography
                  flexGrow={1}
                  textOverflow='ellipsis'
                  whiteSpace='nowrap'
                  overflow='hidden'
                  fontWeight={550}>
                  {name}
                </Typography>
                <Typography
                  variant='caption'
                  component='div'
                  display='flex'
                  whiteSpace='nowrap'
                  justifyContent='end'>
                  {timeElapses({ date: createdAt })}
                </Typography>
              </Stack>
            }
            secondary={
              <Stack direction='row' spacing={1}>
                <Typography
                  alignItems='center'
                  flexGrow={1}
                  textOverflow='ellipsis'
                  whiteSpace='nowrap'
                  overflow='hidden'
                  variant='body2'
                  display='flex'
                  gap={1}
                  flexDirection='row'
                  color='text.secondary'>
                  <ListAvatar
                    invisible
                    src={createdBy.image}
                    sx={{ width: 15, height: 15, fontSize: 10 }}
                    id={createdBy?.id}
                    alt={name}>
                    {getFullName(createdBy)?.toUpperCase()?.charAt(0)}
                  </ListAvatar>
                  {createdBy.firstName && (
                    <span>{incoming ? createdBy.firstName : "Vous"}</span>
                  )}
                  <Groups2OutlinedIcon fontSize='small' />
                  {participants && <span>{participants} participants</span>}
                </Typography>
              </Stack>
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider variant='inset' sx={{ opacity: divider ? 1 : 0 }} />
    </div>
  );
};

RunningCallItem.propTypes = {
  location: PropTypes.object,
  divider: PropTypes.bool,
  createdBy: PropTypes.object,
  onClickDetail: PropTypes.func,
  onCallAction: PropTypes.func,
  createdAt: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
  incoming: PropTypes.bool,
  participants: PropTypes.number,
};

export default React.memo(RunningCallItem);
