import React, { useEffect, useRef, useState } from "react";
import { 
    Box as MuiBox, Paper
} from "@mui/material";
import ToolbarFooter from "./ToolbarFooter";
import MessageEditor from "./MessageEditor";
import { EditorState, convertToRaw } from "draft-js";
import VoiceNoteEqualizer from "./voice-note-equalizer/VoiceNoteEqualizer";
import draftToHtml from 'draftjs-to-html';
import { useSocket } from "../../../../utils/SocketIOProvider";
import { useSelector } from "react-redux";

export default function ChatFooter () {
    const [sendable, setSendable] = useState(false);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [disabledHeader, setDisabledHeader] = useState(false);
    const [showToolbar, setShowToolbar] = useState(true);
    const textFieldRef = useRef();
    const [recording, setRecording] = useState(false);
    const { type, to } = useSelector(store => {
        const chatId = store.data?.chatId;
        const contact = store.data.contacts?.find(({id}) => id === chatId);
        const type = contact ? 'direct' : 'room';
        return {
            to: chatId,
            type,
        };
    });
    const socket = useSocket();

    const handleChange = event => {
        setEditorState(event);
        const value = getDraftText(event);
        if(value.length && !sendable)
            setSendable(true);
        if(!value.length && sendable)
            setSendable(false);
    };

    const handleToggleRecording = () => setRecording( 
        recording => !recording
    );

    const handleSendMessage = () => {
        if(getDraftText(editorState)) {
            const rawContentState = convertToRaw(editorState.getCurrentContent());
            const content = draftToHtml(rawContentState);
            socket?.emit(`${type}-message`, {
                content, to,
                date: new Date(),
                type: 'text',
            });
            handleChange(
                EditorState.moveFocusToEnd(
                    EditorState.createEmpty()
                )
            );
        }
    }

    useEffect(() => {
        textFieldRef.current?.focus();
    }, [textFieldRef])
  
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
        sx={{borderTop: theme => `1px solid ${theme.palette.divider}`}}
    >
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
            />
            <ToolbarFooter
                sendable={sendable}
                showToolbar={showToolbar}
                handleChange={handleChange}
                editorState={editorState}
                toggleShowToolbar={(event, value) => setShowToolbar(value)}
                handleToggleRecording={handleToggleRecording}
                handleSendMessage={handleSendMessage}
            />
        </Paper>
        {recording && 
        <VoiceNoteEqualizer
            handleToggleRecording={handleToggleRecording}
        />}
    </MuiBox>
  );
}

export const getDraftText = event => convertToRaw(
    event.getCurrentContent()
)?.blocks
.map(({ text }) => text)
.join('\n').trim();