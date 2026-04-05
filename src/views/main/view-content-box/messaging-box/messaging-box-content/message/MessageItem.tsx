import React, { forwardRef } from "react";
import {
  Box,
  Divider,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  Badge,
  ListItem,
  Skeleton,
  Fade,
} from "@mui/material";
import AvatarDiscussion from "./AvatarDiscussion";
import MessageContent from "./MessageContent";

const DiscussionItem = React.memo(
  forwardRef(({ content }, ref) => {
    return (
      <Fade in>
        <div ref={ref}>{content}</div>
      </Fade>
    );
  })
);

export default DiscussionItem;
