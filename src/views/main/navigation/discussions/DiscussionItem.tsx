import React from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Badge, Box, ListItem, ListItemButton, Stack } from "@mui/material";
import ListAvatar from "../../../../components/ListAvatar";
import { formatTime } from "../../../../utils/formatDate";
import MessageItemContent from "./MessageItemContent";
import useLongPress from "../../../../hooks/useLongPress";
import { useMemo } from "react";
import AvatarStatus from "../../../../components/AvatarStatus";
import HighlightWord from "../../../../components/HighlightWord";
import PushPinIcon from "@mui/icons-material/PushPin";

const DiscussionItem = ({
  selected,
  name,
  image,
  type,
  message,
  status,
  id,
  updatedAt,
  news = 0,
  divider,
  search,
  secondaryAction,
  email,
  pinned,
  description,
  ...otherProps
}) => {
  const pressProps = useLongPress(otherProps?.onContextMenu);
  const Avatar = useMemo(
    () => (type === "room" ? ListAvatar : AvatarStatus),
    [type]
  );
  return (
    <div>
      <ListItem
        disablePadding
        alignItems='flex-start'
        secondaryAction={secondaryAction}>
        <ListItemButton selected={selected} {...otherProps} {...pressProps}>
          <ListItemAvatar>
            <Avatar
              src={image}
              alt={name}
              id={id}
              status={status}
              invisible={type === "room"}>
              {name?.toUpperCase()?.charAt(0)}
            </Avatar>
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
                  {<HighlightWord text={name} word={search} />}
                </Typography>
                {updatedAt && (
                  <Typography
                    variant='caption'
                    component='div'
                    display='flex'
                    whiteSpace='nowrap'
                    color='text.secondary'
                    justifyContent='end'>
                    {formatTime({ date: updatedAt })}
                  </Typography>
                )}
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
                  color='text.secondary'
                  variant='body2'>
                  {message ? (
                    <MessageItemContent message={message} id={id} type={type} />
                  ) : (
                    email || description
                  )}
                </Typography>
                {pinned && <PushPinIcon fontSize='small' />}
                <Badge
                  badgeContent={news}
                  color='primary'
                  sx={{
                    "& .MuiBadge-badge": {
                      right: 12,
                      top: -8,
                    },
                  }}>
                  <Box
                    minWidth={news ? 20 : 0}
                    height={20}
                    display='inline-block'
                  />
                </Badge>
              </Stack>
            }
            slotProps={{
              primary: { component: "div" },
              secondary: { component: "div" },
            }}
          />
        </ListItemButton>
      </ListItem>
      <Divider variant='inset' sx={{ opacity: divider ? 1 : 0 }} />
    </div>
  );
};

export default React.memo(DiscussionItem);
