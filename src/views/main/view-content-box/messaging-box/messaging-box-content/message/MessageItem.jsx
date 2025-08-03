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
import PropTypes from "prop-types";
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

DiscussionItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  content: PropTypes.string,
  createdAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  updatedAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  sender: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    src: PropTypes.string,
  }),
};

export default DiscussionItem;
