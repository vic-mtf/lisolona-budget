import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListAvatar from "../../../../../../components/ListAvatar";
import WavingHand from "../../../../../../components/WavingHand";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import getFullName from "../../../../../../utils/getFullName";
import ParticipantItemMicButton from "./ParticipantItemMicButton";
import { useRef } from "react";
import { useState } from "react";
import RemoteOptions from "./RemoteOptions";
import LocalOptions from "./LocalOptions";

const ParticipantItem = ({ variant, type, identity, mode, state }) => {
  const name = getFullName(identity);

  return (
    <ListItem
      secondaryAction={
        mode !== "waiting" && (
          <Box display='flex' gap={1}>
            {state?.handRaised && <WavingHand />}
            <ParticipantItemMicButton
              type={type}
              isMicActive={state?.isMicActive}
              name={name}
              id={identity?.id}
            />
            <MoreOptions type={type} id={identity?.id} />
          </Box>
        )
      }
      alignItems='flex-start'>
      <ListItemAvatar>
        <ListAvatar id={identity.id} invisible src={identity.image}>
          {name?.charAt(0)}
        </ListAvatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            {name} {type === "local" && "(vous)"}
          </>
        }
        slotProps={{
          primary: {
            variant: "body2",
            noWrap: true,
            textOverflow: "ellipsis",
          },
          secondary: {
            variant: "caption",
          },
        }}
        secondary={
          mode === "waiting" ? (
            <Box sx={{ display: "flex", gap: 1, pt: 1 }}>
              <Button
                variant='contained'
                size='small'
                endIcon={<DoneOutlinedIcon />}>
                Accepter
              </Button>
              <Button
                size='small'
                endIcon={<PersonRemoveOutlinedIcon />}
                variant='outlined'>
                Refuser
              </Button>
            </Box>
          ) : (
            texts.variants[variant]
          )
        }
      />
    </ListItem>
  );
};

const MoreOptions = ({ type, id }) => {
  const anchorElRef = useRef();
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <>
      <div>
        <Tooltip title="Plus d'options">
          <IconButton size='small' ref={anchorElRef} onClick={handleClick}>
            <MoreVertOutlinedIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </div>
      <Menu
        open={open}
        anchorEl={anchorElRef.current}
        onClose={onClose}
        slotProps={{ list: { dense: true } }}>
        {type === "remote" ? (
          <RemoteOptions onClose={onClose} remoteId={id} />
        ) : (
          <LocalOptions onClose={onClose} />
        )}
      </Menu>
    </>
  );
};

MoreOptions.propTypes = {
  type: PropTypes.oneOf(["remote", "local"]),
  id: PropTypes.string,
};

ParticipantItem.propTypes = {
  variant: PropTypes.oneOf(["guest", "moderator", "collaborator"]),
  type: PropTypes.oneOf(["remote", "local"]),
  mode: PropTypes.oneOf(["waiting", "in-room"]),
  state: PropTypes.object,
  identity: PropTypes.object,
};

const texts = {
  variants: {
    guest: "Invité",
    moderator: "Modérateur",
    collaborator: "Collaborateur",
  },
};

export default React.memo(ParticipantItem);
