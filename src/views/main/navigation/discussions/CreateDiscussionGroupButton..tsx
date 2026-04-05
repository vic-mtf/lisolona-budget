import React, { useState } from "react";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { Tooltip, IconButton, Dialog } from "@mui/material";
import CreateDiscussionGroup from "../../forms/create-discussion-group/CreateDiscussionGroup";
import useSmallScreen from "../../../../hooks/useSmallScreen";

const CreateDiscussionGroupButton = React.memo(() => {
  const [open, setOpen] = useState(false);

  const matches = useSmallScreen();

  return (
    <>
      <Tooltip arrow title='Créer nouveau Lisanga'>
        <IconButton onClick={() => setOpen(true)}>
          <GroupAddOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} fullScreen={matches}>
        <CreateDiscussionGroup onClose={() => setOpen(false)} />
      </Dialog>
    </>
  );
});

CreateDiscussionGroupButton.displayName = "CreateDiscussionGroupButton";

export default CreateDiscussionGroupButton;
