import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import IconButton from "../../../../components/IconButton";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import Groups3OutlinedIcon from "@mui/icons-material/Groups3Outlined";

import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { createElement, useState } from "react";

export default function AddDiscussion() {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <>
      <Tooltip arrow title='Ajouter...'>
        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
          <AddOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}>
        {options.map(({ id, icon = "div", label }) => (
          <MenuItem key={id}>
            <ListItemIcon>{createElement(icon)}</ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

const options = [
  {
    label: "Inviter un nouveau contact",
    icon: ContactMailOutlinedIcon,
    id: "add-contact",
  },
  {
    label: "Créer Lisanga",
    icon: GroupAddOutlinedIcon,
    id: "create-room",
  },
];
