import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { 
    Box as MuiBox, Paper
} from "@mui/material";
import ToolbarFooter from "./footer/ToolbarFooter";
import MessageEditor from "./content/MessageEditor";
import { EditorState, convertToRaw } from "draft-js";
import VoiceNoteEqualizer from "./voice-note-equalizer/VoiceNoteEqualizer";
import useSendMessage from "./useSendMessage";
import FilesThumbView from "./header/FilesThumbView";
import { useMemo } from "react";

export default function ChatFooter ({target}) {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [disabledHeader, setDisabledHeader] = useState(false);
    const [showToolbar, setShowToolbar] = useState(true);
    const textFieldRef = useRef();
    const [recording, setRecording] = useState(false);
    const [files, setFiles] = useState([]);

    const handleChange = useCallback(event => setEditorState(event), []);
    const sendable = useMemo(() => 
        Boolean(getDraftText(editorState) || files.length), 
        [editorState, files]
    );
    const handleToggleRecording = useCallback(() => setRecording(recording => !recording), []);
    const handleSendMessage = useSendMessage({handleChange, target, editorState, files});
    
    useLayoutEffect(() => {
        textFieldRef.current?.focus();
    }, [target]);

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
        {Boolean(files.length) &&
        <FilesThumbView
            files={files}
            setFiles={setFiles}
            target={target}
        />}
        <Paper
            sx={{
                display: 'flex',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                flexWrap: 'wrap',
                flexDirection: 'column',
                width: '100%',
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
                handleSendMessage={handleSendMessage}
                target={target}
                key={target.id}
            />
            <ToolbarFooter
                sendable={sendable}
                showToolbar={showToolbar}
                handleChange={handleChange}
                editorState={editorState}
                toggleShowToolbar={(event, value) => setShowToolbar(value)}
                handleToggleRecording={handleToggleRecording}
                handleSendMessage={handleSendMessage}
                setFiles={setFiles}
                files={files}
            />
        </Paper>
        {recording && 
        <VoiceNoteEqualizer
            handleToggleRecording={handleToggleRecording}
        />}
    </MuiBox>
  );
}

export const getDraftText = event => 
convertToRaw(
    event.getCurrentContent())?.blocks.map(({text}) => text
).join('\n').trim();