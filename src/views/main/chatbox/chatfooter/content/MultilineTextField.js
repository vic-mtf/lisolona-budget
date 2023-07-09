import Editor from '@draft-js-plugins/editor';
import 'draft-js/dist/Draft.css';
import "prismjs/themes/prism.css";
import { Box as MuiBox } from "@mui/material";
import { Search } from "../../../../../components/SearchInput";
import scrollBarSx from "../../../../../utils/scrollBarSx";
import { useFooterContext } from "../ChatFooter";
import { useMemo } from "react";
import styleMap from "./styleMap";
import blockStyleFn from "./editor-custom-style/blockStyleFn";

export default function MultilineTextField ({onBlur, onFocus, showPlaceHolder}) {

    const [{
        editorState,
        textFieldRef,
        target,
    },{handleChange, handleKeyCommand, handleSendMessage}
    ] = useFooterContext();

    const handleReturn = (e) => {
        if (!e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        return 'handled';
        }
        return 'not-handled';
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
                        ref={textFieldRef}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        customStyleMap={styleMap}
                        blockStyleFn={blockStyleFn}
                        spellCheck
                        handleReturn={handleReturn}
                    />
                </MuiBox>
            </Search>
        </MuiBox>
  );
}