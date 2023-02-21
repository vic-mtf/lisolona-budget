import { 
    Box as MuiBox
} from '@mui/material';
import { RichUtils } from 'draft-js';
import React, { useEffect, useState } from 'react';
import { getDraftText } from './ChatFooter';
import MultilineTextField from './MultilineTextField';
import { listFormatOption, textFormatOptions } from './textFormatting';
import ToolbarHeader from './ToolbarHeader';

export default function MessageEditor ({
    handleChange, 
    editorState, 
    disabledHeader,
    setDisabledHeader,
    textFieldRef,
    showToolbar,
}) {
    const [formats, setFormats] = useState([]);
    const [listMode, setListMode] = useState(null);

    const handleChangeFormat = format => {
        const _style = format.toUpperCase();
        const isFormat = textFormatOptions.find(({id}) => id  === _style);
        const isList = listFormatOption.find(({id}) => id === format);
        if(isFormat)
            setFormats(
                formats => formats.find(style => style === _style) ?
                formats.filter(style => style !== _style) : 
                [...formats, _style]
            );
        if(isList)
            setListMode(
                listMode => listMode === format ? '' : format
            );
    };
  
    const handleKeyCommand = (_command, editorState) => {
      const newState = RichUtils.handleKeyCommand(
        editorState, 
        _command?.toLowerCase()
        );
      const command = _command?.toUpperCase();
      if (newState) {
            handleChange(newState);
            handleChangeFormat(command)
      }
    }
    
    const handleChangeFormatAutomatically = (event) => {
        handleChange(event);
        const inlineStyle = event.getCurrentInlineStyle();
        const blockType = event.getCurrentContent()
        .getBlockForKey(
            event.getSelection()
            .getStartKey()
        ).getType();
        const isList = listFormatOption.find(({id}) => id === blockType);
        if(isList && !listMode)
            setListMode(blockType);
        if(!isList && listMode)
            setListMode(null);
        let newFormats = [...formats];
        textFormatOptions.forEach(({id: format}) => {
            const isFormat = inlineStyle.has(format.toUpperCase());
            if(newFormats.find(_format => _format === format) && !isFormat)
                newFormats = newFormats.filter(_format => _format !== format);
            if(!newFormats.find(_format => _format === format) && isFormat)
                newFormats = [...newFormats, format];
        });
        if(JSON.stringify(newFormats) !== JSON.stringify(formats))
            setFormats(newFormats);
    }

    useEffect(() => {
        if(!getDraftText(editorState)?.length && listMode)
            handleChangeFormatAutomatically(editorState);
    }, [
        editorState, 
        listMode, 
        handleChangeFormatAutomatically
    ]);

    return (
        <MuiBox
            onClick={event => {
                if(disabledHeader) {
                    event.preventDefault();
                    textFieldRef.current?.focus();
                    handleChange(editorState);
                }
            }}
            display="flex"
            overflow="hidden"
            flexDirection="column"
            width="100%"
        >
            <ToolbarHeader
                formats={formats}
                listMode={listMode}
                handleChangeFormat={handleChangeFormat}
                editorState={editorState}
                handleChange={handleChange}
                disabled={disabledHeader}
                showToolbar={showToolbar}
            />
            <MultilineTextField
                handleChange={handleChangeFormatAutomatically}
                handleKeyCommand={handleKeyCommand}
                editorState={editorState}
                showPlaceHolder={!listMode}
                onBlur={() => {
                    setFormats([]);
                    setListMode(null);
                    setDisabledHeader(true);
                }}
                onFocus={() => setDisabledHeader(false)}
                textFieldRef={textFieldRef}
            />
        </MuiBox>
    )
}