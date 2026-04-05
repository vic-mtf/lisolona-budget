import React, { useState } from "react";
import { Tooltip, IconButton, Dialog } from "@mui/material";
import GuestContact from "../../forms/gust-contact/GuestContact";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import useSmallScreen from "../../../../hooks/useSmallScreen";

const GuestContactButton = React.memo(() => {
  const [open, setOpen] = useState(false);
  const matches = useSmallScreen();

  return (
    <>
      <Tooltip title='Ajouter un contact'>
        <IconButton onClick={() => setOpen(true)}>
          <PersonAddOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} fullScreen={matches} onClose={() => setOpen(false)}>
        <GuestContact onClose={() => setOpen(false)} />
      </Dialog>
    </>
  );
});

GuestContactButton.displayName = "GuestContactButton";

export default GuestContactButton;
