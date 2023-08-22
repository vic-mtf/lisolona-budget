import React, { createContext, useCallback, useContext, useLayoutEffect, useRef, useState } from "react";
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
import decorators from "./content/editor-custom-style/decorators";



export default function ChatFooter ({target}) {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty(decorators));
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
    const handleSendMessage = useSendMessage({handleChange, target, editorState, files, setFiles});
    useLayoutEffect(() => {
       textFieldRef.current?.focus();
    }, [target]);

  return (
    <FooterProvider
        value={[
            {
                editorState,
                disabledHeader,
                showToolbar,
                textFieldRef,
                recording,
                target,
                files,
                sendable
            },
            {
                setEditorState,
                setDisabledHeader,
                setShowToolbar,
                setRecording,
                setFiles,
                handleToggleRecording,
                handleSendMessage,
                handleChange
            }
        ]}
    >
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
            {Boolean(files.length) && <FilesThumbView/>}
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
                <MessageEditor/>
                <ToolbarFooter
                    toggleShowToolbar={(event, value) => setShowToolbar(value)}
                />
            </Paper>
            {recording && <VoiceNoteEqualizer/>}
        </MuiBox>
    </FooterProvider>
  );
}

export const getDraftText = event =>  convertToRaw(event.getCurrentContent())
?.blocks.map(({text}) => text).join('\n').trim();

const footerContext = createContext();
const FooterProvider = footerContext.Provider;
export const useFooterContext = () => useContext(footerContext);