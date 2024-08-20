import * as React from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { ListItemButton } from "@mui/material";
import PropTypes from "prop-types";
import getFullName from "../../../../utils/getFullName";

const DiscussionItem = React.memo(
  ({ selected, name, image, type, message }) => {
    return (
      <ListItemButton alignItems='flex-start' selected={selected}>
        <ListItemAvatar>
          <Avatar alt={name} src={image} variant='rounded'></Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={name}
          secondaryTypographyProps={{
            variant: "body2",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
          secondary={
            <React.Fragment>
              {type === "room" && (
                <Typography
                  sx={{ display: "inline" }}
                  component='span'
                  variant='body2'
                  color='text.primary'>
                  {getFullName(message?.sender)}:
                </Typography>
              )}
              {" I'll be in your neighborhood doing errands this"}
            </React.Fragment>
          }
        />
      </ListItemButton>
    );
  }
);

DiscussionItem.displayName = "DiscussionItem";

DiscussionItem.propTypes = {
  selected: PropTypes.bool,
};

export default DiscussionItem;
