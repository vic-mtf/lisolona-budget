import { Editor, getDefaultKeyBinding } from "draft-js";
import 'draft-js/dist/Draft.css';
import "prismjs/themes/prism.css";
import { Box as MuiBox, useTheme } from "@mui/material";
import { Search } from "../../../../../components/SearchInput";
import scrollBarSx from "../../../../../utils/scrollBarSx";
import { getDraftText } from "../ChatFooter";
import { useMemo } from "react";
import styleMap from "./styleMap";
import blockStyleFn from "./editor-custom-style/blockStyleFn";
//import blockRendererFn from "./editor-custom-style/blockRendererFn";

export default function MultilineTextField ({
    editorState, 
    handleChange,
    handleKeyCommand,
    onBlur,
    onFocus,
    showPlaceHolder,
    textFieldRef,
    handleSendMessage,
    target,
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

    const placeholderMessage = useMemo(() => 
    `Ecrire à ${target?.type === 'room' ? 'Lisanga ' : ''}${target?.name}...`, [target])

    return (
        <MuiBox
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
                            zIndex: theme => theme.zIndex.drawer + 100,
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
                        placeholder={showPlaceHolder && placeholderMessage}
                        keyBindingFn={keyBindingFn}
                        ref={textFieldRef}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        customStyleMap={styleMap}
                        blockStyleFn={blockStyleFn}
                    />
                </MuiBox>
            </Search>
        </MuiBox>
  );
}