import React, { useEffect, useRef }  from "react";
import { Editor, getDefaultKeyBinding } from "draft-js";
import 'draft-js/dist/Draft.css';
import { Box as MuiBox } from "@mui/material";
import { Search } from "../../../../components/SearchInput";
import scrollBarSx from "../../../../utils/scrollBarSx";
import { EditorState } from "draft-js";
import { getDraftText } from "./ChatFooter";

export default function MultilineTextField ({
    editorState, 
    handleChange,
    handleKeyCommand,
    onBlur,
    onFocus,
    showPlaceHolder,
    textFieldRef,
    handleSendMessage
}) {
    const keyBindingFn = event => {
        const checkEnterKey = event.code?.toUpperCase() === 'ENTER' && 
        !event.ctrlKey && !event.shiftKey;

        if(checkEnterKey) {
            if(getDraftText(editorState))
                handleSendMessage();
            return event.preventDefault();
        }
        return getDefaultKeyBinding(event);
    };

    return (
        <MuiBox
            px={.5}
            display="flex"
            overflow="hidden"
            width="100%"
        >
            <Search sx={{ display: 'flex', flex: 1}} >
                <MuiBox
                    sx={{
                        p: 1,
                        overflow: 'hidden',
                        width: '100%',
                        '& div.DraftEditor-root ': {
                            fontSize: theme => theme.typography.body2.fontSize,
                            width: '100%',
                            zIndex: theme => theme.zIndex.drawer + 100
                        },
                        '& div.DraftEditor-editorContainer': {
                            width: "100%",
                            overflow: 'auto',
                            maxHeight: 200,
                            ...scrollBarSx,
                        }
                    }}
                >
                    <Editor
                        onChange={handleChange}
                        editorState={editorState}
                        handleKeyCommand={handleKeyCommand}
                        placeholder={showPlaceHolder && "Noter le message..."}
                        keyBindingFn={keyBindingFn}
                        ref={textFieldRef}
                        onBlur={onBlur}
                        onFocus={onFocus}
                    />
                </MuiBox>
            </Search>
        </MuiBox>
  );
}