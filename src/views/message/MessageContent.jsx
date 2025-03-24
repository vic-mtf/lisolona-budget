import React from "react";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import AudioFileOutlinedIcon from "@mui/icons-material/AudioFileOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";

const MessageContent = React.memo(({ message, id, type }) => {
  const senderId = null;
  const sender = message?.sender;
  let senderName =
    type === "room" ? (senderId === id ? "Vous" : sender?.name) : ""; // getDullName(sender)
  senderName &&= senderName + " : ";

  const Icon = messageIconTypes[message?.subType || "document"];

  return (
    <>
      {senderName && (
        <>
          <Typography component='span' variant='body2' color='text.primary'>
            {senderName}
          </Typography>{" "}
        </>
      )}
      {message?.type === "text" ? (
        message?.content
      ) : (
        <Icon
          sx={{
            fontSize: (theme) => theme.typography.body1.fontSize,
            position: "relative",
            top: 3,
          }}
        />
      )}
    </>
  );
});

MessageContent.propTypes = {
  message: PropTypes.object.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  type: PropTypes.string.isRequired,
};

MessageContent.displayName = "MessageContent";

export default MessageContent;

const messageIconTypes = {
  document: InsertDriveFileOutlinedIcon,
  image: InsertPhotoOutlinedIcon,
  video: VideocamOutlinedIcon,
  audio: AudioFileOutlinedIcon,
  voice: MicNoneOutlinedIcon,
};
