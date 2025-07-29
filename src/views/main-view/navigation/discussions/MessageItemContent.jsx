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
  const fType = message?.type || "doc";
  const sType = fType === "media" && message?.subType?.toLowerCase();

  const Icon = messageIconTypes[fType === "media" ? sType : fType];

  if (!message || typeof message === "string")
    return message || "Nouvelle discussion";

  return (
    <>
      {senderName && (
        <>
          <Typography component='span' variant='body2' color='text.secondary'>
            {senderName}:
          </Typography>{" "}
        </>
      )}
      {message?.type === "text"
        ? htmlToText(message?.content)
        : Icon && (
            <Icon
              sx={{
                fontSize: (theme) => theme.typography.body2.fontSize,
                position: "relative",
                top: 3,
              }}
            />
          )}
    </>
  );
});

MessageItemContent.propTypes = {
  message: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  type: PropTypes.string.isRequired,
};

MessageItemContent.displayName = "MessageItemContent";

export default MessageItemContent;

const messageIconTypes = {
  doc: InsertDriveFileOutlinedIcon,
  image: InsertPhotoOutlinedIcon,
  video: VideocamOutlinedIcon,
  audio: AudioFileOutlinedIcon,
  voice: MicNoneOutlinedIcon,
};
