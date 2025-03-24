import { Box as MuiBox } from "@mui/material";
import { useMemo } from "react";
import MessagesContent from "./messages-content/MessagesContent";
//import store from '../../../../redux/store';
import ChatContainer from "./messages/ChatContainer";

export default function ChatBody({ target, media = true }) {
  const id = useMemo(() => target?.id, [target?.id]);

  return (
    <MuiBox
      overflow="hidden"
      display="flex"
      position="relative"
      sx={{ zIndex: (theme) => theme.zIndex.fab }}
      flex={1}
      key={id}
      width="100%"
    >
      <MessagesContent target={target} media={media} />
      <ChatContainer target={target} />
    </MuiBox>
  );
}
