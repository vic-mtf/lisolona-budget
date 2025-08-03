import { ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import ListAvatar from "../../../../components/ListAvatar";

export const ToolbarIdentity = () => {
  return (
    <ListItem
      sx={{
        px: 2,
        position: "sticky",
        top: 0,
        bgcolor: "transparent",
        backdropFilter: "blur(15px)",
        zIndex: (t) => t.zIndex.appBar,
      }}
      disableGutters
      disablePadding>
      <ListItemAvatar>
        <ListAvatar />
      </ListItemAvatar>
      <ListItemText primary='John Doe' secondary='john.doe@example.com' />
    </ListItem>
  );
};

export default ToolbarIdentity;
