import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
  ListItem,
  alpha,
  Stack,
  Fade,
} from "@mui/material";
import ListAvatar from "../../../../../../components/ListAvatar";
import getFullName from "../../../../../../utils/getFullName";
import MessageContentText from "./message-content-text/MessageContentText";
import { formatTime } from "../../../../../../utils/formatDate";
import MessageActionItem from "./Message-action-Item/MessageActionItem";
import useSmallScreen from "../../../../../../hooks/useSmallScreen";
import useLongPress from "../../../../../../hooks/useLongPress";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import MessageContentMedia from "./message-content-media/MessageContentMedia";

const MessageContentItem = React.forwardRef(
  (
    {
      message,
      hideAvatar,
      hideName,
      grouped /*, selectable,*/,
      selected,
      user,
    },
    ref
  ) => {
    const replyMessage = useSelector(
      (store) => store.data.app.actions.messaging.reply[user?.id]
    );

    const sender = useMemo(() => message.sender, [message?.sender]);
    const createdAt = message?.createdAt;
    const name = getFullName(sender);
    const matches = useSmallScreen();
    const selectedItem = useMemo(
      () => (replyMessage ? replyMessage?.id === message?.id : selected),
      [selected, replyMessage, message]
    );
    const longPressProps = useLongPress(() => {
      //alert("Bonjour");
    });
    const ListItemMessage = useMemo(
      () => (matches ? ListItemButton : ListItem),
      [matches]
    );

    const listItemProps = useMemo(
      () =>
        matches
          ? {
              ...longPressProps,
              sx: {
                py: 0,
                mb: grouped ? 0.2 : 2,
                userSelect: "none",
              },
            }
          : {
              sx: {
                py: 0,
                mb: grouped ? 0.2 : 2,
                cursor: "auto",
                transition: "background-color .1s ease-out",
                "& .message-action-item, & .date-item": {
                  opacity: 0,
                  pointerEvents: "none",
                  transition: "opacity .2s ease-out",
                },
                "&:hover, &:focus": {
                  bgcolor: (theme) => theme.palette.action.hover,
                  "& .message-action-item, & .date-item": {
                    pointerEvents: "auto",
                    opacity: 1,
                  },
                },
              },
            },
      [matches, grouped, longPressProps]
    );

    return (
      <Fade in appear unmountOnExit style={{ width: "100%" }}>
        <Box
          component='div'
          ref={ref}
          sx={{
            bgcolor: (theme) =>
              selectedItem
                ? alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                  )
                : "none",
          }}>
          <ListItemMessage alignItems='flex-start' {...listItemProps}>
            <ListItemAvatar
              sx={{
                display: "flex",
                justifyContent: "start",
              }}>
              {!hideAvatar ? (
                <ListAvatar invisible id={sender.id} src={sender.image}>
                  {name?.charAt(0).toUpperCase()}
                </ListAvatar>
              ) : (
                <Typography
                  variant='caption'
                  component='div'
                  display='flex'
                  whiteSpace='nowrap'
                  color='text.secondary'
                  className='date-item'
                  justifyContent='end'>
                  {dayjs(createdAt).format("HH:mm")}
                </Typography>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={
                !hideName && (
                  <Stack direction='row' spacing={1} alignItems='flex-end'>
                    <Typography
                      textOverflow='ellipsis'
                      whiteSpace='nowrap'
                      overflow='hidden'
                      //fontWeight={550}
                      variant='body1'>
                      {name}
                    </Typography>
                    <Typography
                      variant='caption'
                      component='div'
                      display='flex'
                      whiteSpace='nowrap'
                      color='text.secondary'
                      justifyContent='end'>
                      {formatTime({ date: createdAt, showTime: true })}
                    </Typography>
                  </Stack>
                )
              }
              secondary={
                <>
                  {message.type === "text" && (
                    <MessageContentText content={message.content} />
                  )}
                  {message.type === "media" && (
                    <MessageContentMedia
                      content={message?.content}
                      subType={message?.subType}
                      id={message?.clientId || message?.id}
                    />
                  )}
                </>
              }
              slotProps={{
                primary: {
                  component: "div",
                },
                secondary: {
                  component: "div",
                  sx: { "& p": { p: 0, m: 0 } },
                },
              }}
            />
            {!matches && <MessageActionItem message={message} />}
          </ListItemMessage>
        </Box>
      </Fade>
    );
  }
);

MessageContentItem.displayName = "MessageContentItem";

MessageContentItem.propTypes = {
  message: PropTypes.object,
  hideAvatar: PropTypes.bool,
  hideName: PropTypes.bool,
  grouped: PropTypes.bool,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  user: PropTypes.object,
};

export default React.memo(MessageContentItem);
