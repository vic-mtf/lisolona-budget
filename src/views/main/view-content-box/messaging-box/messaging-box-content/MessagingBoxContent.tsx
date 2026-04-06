import { Box } from "@mui/material";
import MessageList from "./MessageList";
import useMessagingContext from "@/hooks/useMessagingContext";

export default function MessagingBoxContent() {
  const [{ user, data, VListRef }] = useMessagingContext();

  return (
    <Box position='relative' flex={1} flexGrow={1}>
      <MessageList user={user} data={data} VListRef={VListRef} key={user?.id} />
    </Box>
  );
}
