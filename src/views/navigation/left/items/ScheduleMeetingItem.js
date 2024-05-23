import {
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItem,
  useTheme,
} from "@mui/material";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import React from "react";
import { useSelector } from "react-redux";

import Typography from "../../../../components/Typography";
import AvatarStatus from "../../../../components/AvatarStatus";
import formatDates from "../../../../utils/formatDates";
import addEmDash from "../../../../utils/addEmDash";
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import useHandleJoinMeeting from "../../../main/action/useHandleJoinMeeting";
import IconButton from "../../../../components/IconButton";
import CopyLinkButton from "../../../../components/CopyLinkButton";
import TimeElapsed from "../../../../components/TimeElapsed";
import useMeetingUrl from "../../../meeting/conference/navigation/details/useMeetingUrl";

export default function ScheduleMeetingItem({ call }) {
  const {
    avatarSrc,
    name,
    date,
    type,
    format,
    origin,
    id,
    avatarsSrc,
    location,
    createdAt,
    title,
    description,
  } = call;

  const url = useMeetingUrl(id);
  const [contextMenu, setContextMenu] = React.useState(null);
  const { iconCallType, color } = useCallParams(type, format);
  const mode = useSelector((store) => store.meeting.mode);
  const handleJoinMeeting = useHandleJoinMeeting();
  const theme = useTheme();

  const handleContextMenu = (event) => {
    event.preventDefault();
    const mouseX = event.clientX + 2;
    const mouseY = event.clientY - 6;
    setContextMenu(contextMenu === null ? { mouseX, mouseY } : null);
  };

  const handleClick = (event) => {
    event.preventDefault();
    const data = { id: location, name, avatarSrc, type };
    handleJoinMeeting({ data, origin });
  };
  const time = formatDates(origin?.startedAt, origin?.endedAt);
  const detail =
    addEmDash(origin?.title) + addEmDash(time) + addEmDash(origin.description);

  return (
    <React.Fragment>
      <ListItem
        disablePadding
        secondaryAction={
          Boolean(window?.navigator?.share) ? (
            <ShareLinkButton
              text={origin?.description}
              title={origin?.title}
              url={url}
              detail={detail}
              IconProps={{
                size: "small",
              }}
            />
          ) : (
            <CopyLinkButton
              text={origin?.description}
              title={origin?.title}
              url={url}
              render={({ copied, handleCopyLink }) => (
                <IconButton onClick={handleCopyLink}>
                  {React.createElement(
                    copied ? DoneOutlinedIcon : ContentCopyOutlinedIcon,
                    { size: "small" },
                  )}
                </IconButton>
              )}
            />
          )
        }
      >
        <ListItemButton
          sx={{ overflow: "hidden" }}
          onContextMenu={handleContextMenu}
          onClick={handleClick}
          disabled={mode !== "none"}
        >
          <ListItemAvatar>
            <AvatarStatus
              type={type}
              avatarSrc={avatarSrc}
              avatarsSrc={avatarsSrc}
              alt={name}
              name={name}
              id={location}
              online
              BadgeProps={{
                color: theme.palette.primary.main,
              }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={name}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {time}
                </Typography>
                {detail}
              </React.Fragment>
            }
            primaryTypographyProps={{
              component: "div",
              noWrap: true,
              title: addEmDash(name) + addEmDash(description),
              color: "text.primary",
            }}
            secondaryTypographyProps={{
              component: "div",
              noWrap: true,
              title: detail,
              color: "primary.main",
            }}
          />
        </ListItemButton>
      </ListItem>
    </React.Fragment>
  );
}

const useCallParams = () => {
  const theme = useTheme();
  return {
    color: theme.palette.success.main,
    iconCallType: <OnlinePredictionIcon fontSize="inherit" />,
  };
};

const ShareLinkButton = ({ url, title, text, detail, IconProps }) => {
  const handleClick = () => {
    console.log(detail);
    if (navigator.share) {
      navigator
        .share({ title, text, url })
        .then(() => console.log("Partagé avec succès !"))
        .catch((error) => console.error("Échec du partage", error));
    }
  };

  return (
    <IconButton onClick={handleClick}>
      <ShareOutlinedIcon {...IconProps} />
    </IconButton>
  );
};
