import {
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  IconButton,
  Slide,
} from "@mui/material";
import ListAvatar from "../../../../../../../components/ListAvatar";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import VerticalCollapse from "../../../../../../../components/VerticalCollapse";
import { useState } from "react";
import useSmallScreen from "../../../../../../../hooks/useSmallScreen";

const OutsideVoiceViewer = () => {
  const [open, setOpen] = useState(true);
  const matches = useSmallScreen();
  return (
    <>
      <Slide in={open} direction={matches ? "down" : "up"} unmountOnExit>
        <ListItem
          disablePadding
          secondaryAction={
            <IconButton edge='end'>
              <CloseOutlinedIcon />
            </IconButton>
          }>
          <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemAvatar>
              <ListAvatar />
            </ListItemAvatar>
            <ListItemText primary='Nom de la personne' />
          </ListItemButton>
        </ListItem>
      </Slide>
    </>
  );
};

export default OutsideVoiceViewer;
