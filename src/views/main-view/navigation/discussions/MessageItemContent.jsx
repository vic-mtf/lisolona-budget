import React from "react";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import AudioFileOutlinedIcon from "@mui/icons-material/AudioFileOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import { htmlToText } from "html-to-text";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import getFullName from "../../../../utils/getFullName";

const MessageItemContent = React.memo(({ message, type }) => {
  const id = useSelector((store) => store.user.id);
  const sender = useMemo(() => message?.sender, [message?.sender]);
  let senderName = useMemo(
    () =>
      type === "room"
        ? sender?.id === id
          ? "Vous"
          : sender
          ? getFullName(sender)
          : null
        : "",
    [id, sender, type]
  );

  const Icon = messageIconTypes[message?.subType?.toLowerCase() || "document"];
  if (!message) return "Nouvelle discussions";

  return (
    <>
      {senderName && (
        <>
          <Typography component='span' variant='body2' color='text.primary'>
            {senderName}:
          </Typography>{" "}
        </>
      )}
      {console.log(message)}
      {message?.type === "text"
        ? htmlToText(message?.content)
        : Icon && (
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

MessageItemContent.propTypes = {
  message: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  type: PropTypes.string.isRequired,
};

MessageItemContent.displayName = "MessageItemContent";

export default MessageItemContent;

const messageIconTypes = {
  document: InsertDriveFileOutlinedIcon,
  image: InsertPhotoOutlinedIcon,
  video: VideocamOutlinedIcon,
  audio: AudioFileOutlinedIcon,
  voice: MicNoneOutlinedIcon,
};
