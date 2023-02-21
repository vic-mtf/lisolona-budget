import React, { useEffect, useRef, useState } from "react";
import { 
    Box as MuiBox, Paper
} from "@mui/material";
import ToolbarFooter from "./ToolbarFooter";
import MessageEditor from "./MessageEditor";
import { EditorState, convertToRaw } from "draft-js";

export default function ChatFooter () {
    const [sendable, setSendable] = useState(false);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [disabledHeader, setDisabledHeader] = useState(false);
    const [showToolbar, setShowToolbar] = useState(true);
    const textFieldRef = useRef();

    const handleChange = event => {
        setEditorState(event);
        const value = getDraftText(event);
        if(value.length && !sendable)
            setSendable(true);
        if(!value.length && sendable)
            setSendable(false);
    };
    useEffect(() => {
        textFieldRef.current?.focus();
    }, [textFieldRef])
  
  return (
    <MuiBox
        bgcolor="background.paper"
        py={1}
        display="flex"
        width="100%"
        alignItems="center"
        justifyContent="center"
        sx={{
            borderTop: theme => `1px solid ${theme.palette.divider}`
        }}
        
    >
        <Paper
            sx={{
                display: 'flex',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                flexWrap: 'wrap',
                flexDirection: 'column',
                width: '80%',
            }}
            elevation={disabledHeader ? 0 : 2}
        >
            <MessageEditor
                handleChange={handleChange}
                editorState={editorState}
                disabledHeader={disabledHeader} 
                setDisabledHeader={setDisabledHeader}
                textFieldRef={textFieldRef}
                showToolbar={showToolbar}
            />
            <ToolbarFooter
                sendable={sendable}
                showToolbar={showToolbar}
                toggleShowToolbar={(event, value) => setShowToolbar(value)}
            />
        </Paper>
    </MuiBox>
  );
}

export const getDraftText = event => convertToRaw(
    event.getCurrentContent()
)?.blocks
.map(({ text }) => text)
.join('\n').trim();