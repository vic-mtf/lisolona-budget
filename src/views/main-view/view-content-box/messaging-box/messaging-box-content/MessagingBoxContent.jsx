import { Box } from "@mui/material";
import PropTypes from "prop-types";
import MessageList from "./MessageList";
import { useContext } from "react";
import { MessagingContext } from "../MessagingBoxProvider";

export default function MessagingBoxContent() {
  const [{ user, data, VListRef }] = useContext(MessagingContext);

  return (
    <Box position='relative' flex={1} flexGrow={1}>
      <MessageList user={user} data={data} VListRef={VListRef} key={user?.id} />
    </Box>
  );
}

MessagingBoxContent.propTypes = {
  user: PropTypes.object,
};
