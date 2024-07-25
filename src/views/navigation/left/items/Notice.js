import React, { useMemo } from "react";
import { Badge, Stack } from "@mui/material";
import Typography from "../../../../components/Typography";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import SlideshowOutlinedIcon from "@mui/icons-material/SlideshowOutlined";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";

import { convert } from "html-to-text";

export default function Notice({
  badgeContent = 0 /*, id*/,
  type,
  name,
  description,
  message,
}) {
  const isNew = useMemo(() => badgeContent > 0, [badgeContent]);
  const defaultContent = useMemo(
    () =>
      type === "direct"
        ? `L'invitaion acceptée, vous en contact avec ${name}`
        : `Nouveau Lisanga: \n${description}`,
    [name, description, type]
  );

  const notice = useMemo(() => {
    const label = convert(message?.content || defaultContent, {
      wordwrap: 130,
    });
    return (
      (message?.type === "text"
        ? { label }
        : types[
            message?.type === "media"
              ? message.subtype.toLowerCase()
              : message?.type
          ]) || { label }
    );
  }, [message, defaultContent]);

  return (
    <Stack direction='row' spacing={1}>
      <Typography
        variant='caption'
        noWrap
        textOverflow='ellipsis'
        title={notice.label}
        flexGrow={1}
        children={
          notice.label ||
          (notice.icon &&
            React.createElement(notice.icon, { fontSize: "15px" }))
        }
        color={isNew ? "primary" : "text.secondary"}
      />
      <Badge
        badgeContent={badgeContent}
        color='primary'
        sx={{
          width: 20,
          [`& .MuiBadge-badge`]: {
            right: 10,
            top: 10,
            padding: "0 4px",
          },
        }}
      />
    </Stack>
  );
}

const types = {
  image: {
    icon: PhotoOutlinedIcon,
    //label: "Image"
  },
  video: {
    icon: SlideshowOutlinedIcon,
    //label: "Vidéo"
  },
  audio: {
    icon: KeyboardVoiceOutlinedIcon,
    //label: "Audio"
  },
  doc: {
    icon: ArticleOutlinedIcon,
    //label: "Document"
  },
  voice: {
    icon: MicNoneOutlinedIcon,
  },
  call: {
    icon: ContactPhoneOutlinedIcon,
    //label: "Appel"
  },
};
