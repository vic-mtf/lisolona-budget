import React, { createContext, useCallback, useContext, useLayoutEffect, useRef, useState } from "react";
import { 
    Box as MuiBox, Paper
} from "@mui/material";
import WritingArea from "./writing-area/WritingArea";
import EmojiPicker from "./emoji-picker/EmojiPicker";



export default function ChatFooter ({target}) {
 

  return (
        <MuiBox
            bgcolor="background.paper"
            p={1}
            display="flex"
            width="100%"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            overflow="hidden"
            position="relative"
            sx={{
                borderTop: theme => `1px solid ${theme.palette.divider}`,
                zIndex: theme => theme.zIndex.appBar,
            }}
        >
            <WritingArea
                target={target}
                onSubmit={editorState => console.log(editorState)}
            />
        </MuiBox>
  );
}