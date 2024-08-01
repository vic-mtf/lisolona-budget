import {
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Menu,
  ListItem,
  Zoom,
  Stack,
  Tooltip,
  Box as MuiBox,
} from "@mui/material";
import React, { useState } from "react";
import Avatar from "../../../../components/Avatar";
import IconButton from "../../../../components/IconButton";
import CustomBadge from "../../../../components/CustomBadge";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import Button from "../../../../components/Button";
import Typography from "../../../../components/Typography";
import capStr from "../../../../utils/capStr";
import { LoadingButton } from "@mui/lab";
import useAxios from "../../../../hooks/useAxios";
import { useSelector } from "react-redux";

export default function InviteContactItem({
  avatarSrc,
  name,
  email,
  date,
  id,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const [showSecondaryAction, setShowSecondaryAction] = useState(false);

  const handleContextMenu = (event) => {
    event.preventDefault();
    const mouseX = event.clientX + 2;
    const mouseY = event.clientY - 6;
    setContextMenu(contextMenu === null ? { mouseX, mouseY } : null);
  };

  return (
    <React.Fragment>
      <ListItem
        alignItems='flex-start'
        secondaryAction={
          <Stack spacing={1}>
            <Typography variant='caption' color='text.secondary'>
              {capStr(date)}
            </Typography>
            <Zoom in={showSecondaryAction}>
              <Tooltip title="Plus d'option" arrow>
                <MuiBox textAlign='right'>
                  <IconButton onClick={handleContextMenu}>
                    <ExpandMoreOutlinedIcon fontSize='small' />
                  </IconButton>
                </MuiBox>
              </Tooltip>
            </Zoom>
          </Stack>
        }
        onMouseEnter={() => setShowSecondaryAction(true)}
        onMouseLeave={() => setShowSecondaryAction(false)}
        onContextMenu={handleContextMenu}>
        <ListItemAvatar>
          <Avatar src={avatarSrc} srcSet={avatarSrc} alt={name} />
        </ListItemAvatar>
        <ListItemText
          primary={name}
          secondary={
            <React.Fragment>
              <Typography variant='caption' color='text.secondary'>
                {email}
              </Typography>
              <ButtonActions id={id} />
            </React.Fragment>
          }
          primaryTypographyProps={{
            component: "div",
            noWrap: true,
            title: name,
            maxWidth: "70%",
          }}
          secondaryTypographyProps={{
            component: "div",
            noWrap: true,
          }}
          sx={{ mr: 1 }}
        />
      </ListItem>
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference='anchorPosition'
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        PaperProps={{
          sx: {
            bgcolor: (theme) =>
              theme.palette.background.paper + theme.customOptions.opacity,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            backdropFilter: (theme) => `blur(${theme.customOptions.blur})`,
            height: 200,
            width: 200,
            overflow: "auto",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        // transformOrigin={{
        //     vertical: 'top',
        //     horizontal: 'letf',
        // }}
      ></Menu>
    </React.Fragment>
  );
}

const ButtonActions = ({ id: _id }) => {
  const config = {
    data: { _id },
    method: "post",
    headers: {
      Authorization: `Bearer ${useSelector((store) => store.user?.token)}`,
    },
  };
  const [{ loading: loadingAccept }, onAccept] = useAxios(
    { url: "api/chat/accept", ...config },
    { manual: true }
  );
  const [{ loading: loadingRefuse }, onRefuse] = useAxios(
    { url: "api/chat/reject", ...config },
    { manual: true }
  );

  return (
    <Stack spacing={1} direction='row' mt={1}>
      <LoadingButton
        variant='outlined'
        children='Accepter'
        fullWidth
        size='small'
        loading={loadingAccept}
        sx={{ textTransform: "none" }}
        onClick={onAccept}
      />
      <LoadingButton
        variant='outlined'
        children='Refuser'
        fullWidth
        size='small'
        sx={{ textTransform: "none" }}
        loading={loadingRefuse}
        onClick={onRefuse}
      />
    </Stack>
  );
};
