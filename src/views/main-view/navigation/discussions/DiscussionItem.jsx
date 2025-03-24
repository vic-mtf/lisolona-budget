import React from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Badge, Box, ListItem, ListItemButton, Stack } from "@mui/material";
import PropTypes from "prop-types";
import ListAvatar from "../../../../components/ListAvatar";
import { formatTime } from "../../../../utils/formatDate";
import MessageItemContent from "./MessageItemContent";
import useLongPress from "../../../../hooks/useLongPress";
import { useMemo } from "react";
import AvatarStatus from "../../../../components/AvatarStatus";

const DiscussionItem = React.memo(
  ({
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
    secondaryAction,
    email,
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
                    {name}
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
                      <MessageItemContent
                        message={message}
                        id={id}
                        type={type}
                      />
                    ) : (
                      email || description
                    )}
                  </Typography>
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
              primaryTypographyProps={{ component: "div" }}
              secondaryTypographyProps={{ component: "div" }}
            />
          </ListItemButton>
        </ListItem>
        <Divider variant='inset' sx={{ opacity: divider ? 1 : 0 }} />
      </div>
    );
  }
);

DiscussionItem.displayName = "DiscussionItem";

DiscussionItem.propTypes = {
  selected: PropTypes.bool,
  image: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(["room", "direct"]),
  divider: PropTypes.bool,
  news: PropTypes.number,
  secondaryAction: PropTypes.node,
  status: PropTypes.oneOf(["online", "offline", "away"]),
  invisible: PropTypes.bool,
  message: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  updatedAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  email: PropTypes.string,
  description: PropTypes.string,
};

export default DiscussionItem;
