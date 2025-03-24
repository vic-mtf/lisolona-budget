import React, { useContext } from "react";
import store from "../../../../../../redux/store";
import { MessagingContext } from "../../MessagingBoxProvider";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AvatarGroup,
} from "@mui/material";
import { useMemo } from "react";
import getFullName from "../../../../../../utils/getFullName";
import { formatTime } from "../../../../../../utils/formatDate";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import ListAvatar from "../../../../../../components/ListAvatar";
import capStr from "../../../../../../utils/capStr";

const Summary = React.memo(() => {
  const [{ user, contact }] = useContext(MessagingContext);
  const localUser = useMemo(() => store.getState().user, []);
  const isLocalUser = localUser?.id === user?.createdBy?.id;
  const creatorName = getFullName(user?.createdBy);
  const userAsMember = user?.members?.find(({ id }) => id === localUser?.id);

  const isAdmin = userAsMember?.level === "admin";
  const summaryGroup = (
    <>
      Lisanga créé par {isLocalUser ? "vous" : <b>{creatorName}</b>},{" "}
      {formatTime({
        date: user?.createdAt,
        showTime: true,
        sameDayOption: "day",
      })}
    </>
  );

  const summaryContent = contact?.grade ? (
    <>
      {contact?.grade} <b>•</b> {contact?.role}
    </>
  ) : (
    "Aucune info pour le contact"
  );

  return (
    <List>
      <ListItem>
        <ListItemText
          secondary={user?.type === "room" ? summaryGroup : summaryContent}
        />
      </ListItem>
      {user?.type === "room" && (
        <>
          {isAdmin && (
            <ListItemButton disabled>
              <ListItemIcon>
                <AdminPanelSettingsOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary='Autorisations' />
              <ListItemIcon sx={{ justifyContent: "end" }}>
                <NavigateNextOutlinedIcon />
              </ListItemIcon>
            </ListItemButton>
          )}
          <ListItemButton>
            <ListItemIcon>
              <SupervisorAccountOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='Membres' />
            <ListItemIcon sx={{ justifyContent: "end" }}>
              <Box
                component='div'
                px={2}
                color='text.secondary'
                display='flex'
                alignItems='center'>
                {
                  <AvatarGroup
                    variant='rounded'
                    max={5}
                    sx={{
                      "& .MuiAvatarGroup-avatar": {
                        border: (theme) =>
                          `2px solid ${theme.palette.background.paper}`,
                        width: 25,
                        height: 25,
                        fontSize: 14,
                      },
                      "& > .MuiAvatar-root": {
                        pl: 1,
                        background: "none",
                        color: "text.secondary",
                        border: "none",
                      },
                    }}>
                    {user?.members?.map(({ firstName, id, image }) => (
                      <ListAvatar id={id} key={id} src={image}>
                        {capStr(firstName?.charAt(0))}
                      </ListAvatar>
                    ))}
                  </AvatarGroup>
                }
              </Box>
              <NavigateNextOutlinedIcon />
            </ListItemIcon>
          </ListItemButton>

          <ListItemButton disabled>
            <ListItemIcon>
              <LinkOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='Invité à rejoindre Lisanga via le lien' />
            <ListItemIcon sx={{ justifyContent: "end" }}>
              <NavigateNextOutlinedIcon />
            </ListItemIcon>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <PersonAddOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='Ajouter un membre' />
          </ListItemButton>
        </>
      )}
    </List>
  );
});

Summary.displayName = "Summary";

export default Summary;
