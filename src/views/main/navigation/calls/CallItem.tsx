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
import NotInterestedOutlinedIcon from "@mui/icons-material/NotInterestedOutlined"; // fail
//import CallMissedOutgoingOutlinedIcon from "@mui/icons-material/CallMissedOutgoingOutlined"; //fail
import CallMissedOutlinedIcon from "@mui/icons-material/CallMissedOutlined"; // missed
import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined"; // outgoing
import CallReceivedOutlinedIcon from "@mui/icons-material/CallReceivedOutlined"; // incoming
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import { formatTime } from "../../../../utils/formatDate";

const CallItem = ({
  location,
  divider,
  createdAt,
  incoming,
  failed,
  calls,
  action,
  onClickDetail,
  onCallAction,
  ...otherProps
}) => {
  const name = getFullName(location);

  return (
    <div>
      <ListItem
        secondaryAction={
          <Tooltip title='Appel'>
            <IconButton edge='end' onClick={onCallAction}>
              <CallOutlinedIcon />
            </IconButton>
          </Tooltip>
        }
        alignItems='flex-start'
        disablePadding
        {...otherProps}>
        <ListItemButton onClick={onClickDetail}>
          <ListItemAvatar>
            <ListAvatar
              src={location?.image}
              alt={name}
              id={location?.id}
              invisible>
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
                  component='span'
                  whiteSpace='nowrap'>
                  {formatTime({ date: createdAt })}
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
                  color={
                    incoming
                      ? action === "accepted"
                        ? "text.secondary"
                        : "error.main"
                      : failed
                      ? "error.main"
                      : "text.secondary"
                  }>
                  {incoming ? (
                    action === "accepted" ? (
                      <CallReceivedOutlinedIcon fontSize='small' />
                    ) : (
                      <CallMissedOutlinedIcon fontSize='small' />
                    )
                  ) : failed ? (
                    <NotInterestedOutlinedIcon fontSize='small' />
                  ) : (
                    <CallMadeOutlinedIcon fontSize='small' />
                  )}
                  {Boolean(calls) && (
                    <span
                      style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}>
                      {calls} appel{calls > 1 ? "s" : ""}
                    </span>
                  )}
                </Typography>
              </Stack>
            }
            slotProps={{
              primary: { title: name },
            }}
          />
        </ListItemButton>
      </ListItem>
      <Divider variant='inset' sx={{ opacity: divider ? 1 : 0 }} />
    </div>
  );
};

CallItem.displayName = "CallItem";

export default CallItem;
