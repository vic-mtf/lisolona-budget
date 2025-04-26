import React, { createElement, useContext } from "react";
import PropTypes from "prop-types";
import { Box, IconButton, Paper, Stack, Tooltip } from "@mui/material";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import messageActions from "./messageActions";
import { useSelector } from "react-redux";
import { MessagingContext } from "../../../MessagingBoxProvider";
import useAxios from "../../../../../../../hooks/useAxios";
import useToken from "../../../../../../../hooks/useToken";

const MessageActionItem = React.memo(({ message }) => {
  const messagingData = useContext(MessagingContext);
  const userId = useSelector((store) => store.user.id);
  const target = userId === message?.sender?.id ? "local" : "remote";
  // const Authorization = useToken();
  // const [{ data }] = useAxios({
  //   url: "api/stuff/archives/archived/",
  //   headers: { Authorization },
  // });

  return (
    <Box
      className='message-action-item'
      position='absolute'
      component='div'
      onMouseDown={(event) => event.preventDefault()}
      sx={{
        right: (theme) => theme.spacing(2),
        top: (theme) => theme.spacing(-4.5),
      }}>
      <Paper
        sx={{
          p: 0.25,
        }}>
        <Stack spacing={1} direction='row'>
          {messageActions
            .filter(
              ({ shortcut, targets, types }) =>
                shortcut &&
                targets.includes(target) &&
                types.includes(message?.type)
            )
            .map(({ id, label, icon, disabled, action }) => (
              <Tooltip
                key={id}
                title={label}
                placement='top'
                disableFocusListener>
                <div>
                  <IconButton
                    size='small'
                    disabled={disabled}
                    onClick={() => {
                      if (typeof action === "function")
                        action(message, messagingData);
                    }}>
                    {createElement(icon)}
                  </IconButton>
                </div>
              </Tooltip>
            ))}
          <Tooltip title='Plus' placement='top' disableFocusListener>
            <div>
              <IconButton size='small'>
                <MoreVertOutlinedIcon />
              </IconButton>
            </div>
          </Tooltip>
        </Stack>
      </Paper>
    </Box>
  );
});

MessageActionItem.displayName = "MessageActionItem";

MessageActionItem.propTypes = {
  message: PropTypes.object.isRequired,
};

export default MessageActionItem;
