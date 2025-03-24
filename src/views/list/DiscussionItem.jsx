import React, { forwardRef } from "react";
import {
  Box,
  Divider,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  Badge,
  ListItem,
  Skeleton,
} from "@mui/material";
import PropTypes from "prop-types";
import AvatarDiscussion from "./AvatarDiscussion";
import MessageContent from "./MessageContent";

const DiscussionItem = React.memo(
  forwardRef(
    (
      {
        dataIndex,
        src,
        name,
        id,
        type,
        news = 10,
        divider,
        message,
        updatedAt,
        status,
        ...otherProps
      },
      ref
    ) => {
      return (
        <div ref={ref} data-index={dataIndex}>
          <ListItemButton alignItems='flex-start' {...otherProps}>
            <ListItemAvatar>
              <AvatarDiscussion
                src={src}
                alt={name}
                id={id}
                status={status}
                invisible={type === "room"}>
                {name?.toUpperCase()?.charAt(0)}
              </AvatarDiscussion>
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
                    justifyContent='end'>
                    {formatDate(updatedAt)}
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
                    variant='body2'>
                    <MessageContent message={message} id={id} type={type} />
                  </Typography>
                  <Badge
                    badgeContent={news}
                    color='primary'
                    sx={{
                      "& .MuiBadge-badge": {
                        right: 12,
                        top: 12,
                        // border: (theme) =>
                        //   `2px solid ${theme.palette.background.paper}`,
                        // padding: "0 4px",
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
          {divider && <Divider variant='inset' />}
        </div>
      );
    }
  )
);

export const DiscussionItemLoading = () => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Skeleton
          variant='rounded'
          sx={{
            width: 40,
            height: 40,
            aspectRatio: 1,
          }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton variant='text' sx={{ width: "100%" }} />}
        secondary={<Skeleton variant='text' sx={{ width: "80%" }} />}
      />
    </ListItem>
  );
};

DiscussionItem.propTypes = {
  dataIndex: PropTypes.number,
  src: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(["room", "direct"]),
  divider: PropTypes.bool,
  news: PropTypes.number,
  status: PropTypes.oneOf(["online", "offline", "away"]),
  invisible: PropTypes.bool,
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    content: PropTypes.string,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
    ]),
    updatedAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
    ]),
    sender: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      src: PropTypes.string,
    }),
  }),
  updatedAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
};

const formatDate = (bulkDate, lang = "fr") => {
  const date = new Date(bulkDate || Date.now());
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const intl = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });

  if (diffDays === 0) {
    return new Intl.DateTimeFormat(lang, {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  } else if (diffDays === 1) {
    return intl.format(-1, "day");
  } else if (diffDays === 2) {
    return intl.format(-2, "day");
  } else if (diffDays < 7) {
    return new Intl.DateTimeFormat(lang, { weekday: "long" }).format(date);
  } else if (date.getFullYear() === now.getFullYear()) {
    return new Intl.DateTimeFormat(lang, {
      month: "long",
      day: "numeric",
    }).format(date);
  } else {
    return new Intl.DateTimeFormat(lang, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }
};

export default DiscussionItem;
