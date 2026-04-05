import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Zoom from "@mui/material/Zoom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import store from "../../../../../redux/store";
import { updateData } from "../../../../../redux/data/data";
import getFullName from "../../../../../utils/getFullName";
// import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
// import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AdditionalOptionButton from "./AdditionalOptionButton";
import StartCallButton from "./StartCallButton";
import useSmallScreen from "../../../../../hooks/useSmallScreen";
import AvatarStatus from "../../../../../components/AvatarStatus";
import { useMemo } from "react";
import ListAvatar from "../../../../../components/ListAvatar";
import GroupStatusState from "./GroupStatusState";
import ContactStatusState from "./ContactStatusState";
import useMessagingContext from "../../../../../hooks/useMessagingContext";

export default function MessagingBoxHeader() {
  const [{ user }] = useMessagingContext();
  const name = getFullName(user);
  const matches = useSmallScreen();
  const remote = user?.members?.find(
    ({ id }) => id !== store.getState().user.id
  );
  const image =
    user?.type === "room" ? user?.image : user?.image || remote?.image;
  const Avatar = useMemo(
    () => (user?.type === "room" ? ListAvatar : AvatarStatus),
    [user?.type]
  );

  return (
    <Box position='sticky' top={0}>
      <AppBar
        sx={{
          top: 0,
          backgroundColor: "transparent",
          boxShadow: 0,
          backdropFilter: "blur(15px)",
          position: "relative",
        }}
        enableColorOnDark={false}
        position='static'>
        <Toolbar sx={{ gap: 1 }} variant='dense'>
          <Zoom unmountOnExit appear={false} in={matches}>
            <IconButton
              onClick={() =>
                store.dispatch(
                  updateData({
                    data: { discussionTarget: null, targetView: null },
                  })
                )
              }>
              <ArrowBackOutlinedIcon />
            </IconButton>
          </Zoom>
          <ListItemButton
            disableGutters
            sx={{ p: 0, m: 0, "&:hover": { background: "none" } }}
            onClick={() => {
              const key = "app.actions.messaging.info.open";
              store.dispatch(updateData({ data: true, key }));
            }}
            //disableTouchRipple
            //disableRipple
          >
            <ListItemAvatar>
              <Avatar
                id={user?.id}
                key={user?.id}
                src={image}
                invisible={user?.type === "room"}>
                {name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={name}
              key={user?.id}
              secondary={
                user?.type === "room" ? (
                  <GroupStatusState members={user?.members} />
                ) : (
                  <ContactStatusState id={user?.id} />
                )
              }
              primaryTypographyProps={{
                noWrap: true,
                textOverflow: "ellipsis",
              }}
            />
          </ListItemButton>
          <StartCallButton user={user} />
          <Zoom unmountOnExit appear={false} in={!matches}>
            <Tooltip title='Chercher les messages'>
              <IconButton>
                <SearchOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Zoom>
          <AdditionalOptionButton {...user} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
