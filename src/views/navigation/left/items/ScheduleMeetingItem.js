import {
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItem,
  useTheme,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import Typography from "../../../../components/Typography";
import AvatarStatus from "../../../../components/AvatarStatus";
import formatDates from "../../../../utils/formatDates";
import addEmDash from "../../../../utils/addEmDash";
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import useHandleJoinMeeting from "../../../main/action/useHandleJoinMeeting";
import TimeElapsed from "../../../../components/TimeElapsed";

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
  console.log(call);
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
      <ListItem disablePadding>
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
