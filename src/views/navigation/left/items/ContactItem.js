import {
  ListItemButton,
  ListItemText,
  Menu,
  ListItem,
  Zoom,
  Stack,
  Tooltip,
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import IconButton from "../../../../components/IconButton";
import highlightWord from "../../../../utils/highlightWord";
import { useDispatch, useSelector } from "react-redux";
import AvatarStatus from "../../../../components/AvatarStatus";
import openNewWindow from "../../../../utils/openNewWindow";
import { encrypt } from "../../../../utils/crypt";
import { setData } from "../../../../redux/meeting";

import useSocket from "../../../../hooks/useSocket";
import useLocalStoreData from "../../../../hooks/useLocalStoreData";

function ContactItem(props) {
  const {
    avatarSrc,
    avatarBuffer,
    name,
    email,
    onClick,
    action,
    selected,
    id,
    search,
  } = props;
  const mode = useSelector((store) => store?.meeting?.mode);
  const disabled = useMemo(() => mode !== "none", [mode]);
  const [contextMenu, setContextMenu] = useState(null);
  const [showSecondaryAction, setShowSecondaryAction] = useState(false);
  const socket = useSocket();
  const [{ secretCode }] = useLocalStoreData();
  const dispatch = useDispatch();

  const handleContextMenu = (event) => {
    event.preventDefault();
    const mouseX = event.clientX + 2;
    const mouseY = event.clientY - 6;
    setContextMenu(contextMenu ? { mouseX, mouseY } : null);
  };
  const target = useMemo(
    () => ({
      avatarSrc: avatarBuffer || avatarSrc,
      id,
      name: props.name,
      type: "direct",
    }),
    [avatarBuffer, avatarSrc, props.name, id]
  );

  const handleCallContact = useCallback(() => {
    const mode = "outgoing";
    const wd = openNewWindow({
      url: "/meeting/",
    });
    wd.geidMeetingData = encrypt({
      target,
      mode,
      secretCode: secretCode,
      defaultCallingState: "before",
    });
    if (wd) {
      dispatch(setData({ data: { mode } }));
      wd.openerSocket = socket;
    }
  }, [dispatch, secretCode, target, socket]);

  return (
    <React.Fragment>
      <ListItem
        disablePadding
        secondaryAction={
          action || (
            <Stack direction='row' spacing={1}>
              <Zoom in={showSecondaryAction}>
                <div>
                  <Tooltip
                    title={
                      disabled ? "Un appel en cours..." : "Lancer un appel"
                    }
                    arrow>
                    <div>
                      <IconButton
                        onClick={handleCallContact}
                        disabled={disabled}>
                        <LocalPhoneOutlinedIcon fontSize='small' />
                      </IconButton>
                    </div>
                  </Tooltip>
                </div>
              </Zoom>
            </Stack>
          )
        }
        onMouseEnter={() => setShowSecondaryAction(true)}
        onMouseLeave={() => setShowSecondaryAction(false)}>
        <ListItemButton
          sx={{ overflow: "hidden" }}
          onContextMenu={handleContextMenu}
          selected={selected}
          onClick={onClick}>
          <AvatarStatus
            avatarSrc={avatarBuffer || avatarSrc}
            name={name}
            id={id}
          />
          <ListItemText
            primary={highlightWord(name, search)}
            secondary={highlightWord(email, search)}
            primaryTypographyProps={{
              component: "div",
              noWrap: true,
              title: name,
              variant: "body2",
            }}
            secondaryTypographyProps={{
              component: "div",
              noWrap: true,
              title: email,
              variant: "caption",
            }}
          />
        </ListItemButton>
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
        }}></Menu>
    </React.Fragment>
  );
}

export default React.memo(ContactItem);
