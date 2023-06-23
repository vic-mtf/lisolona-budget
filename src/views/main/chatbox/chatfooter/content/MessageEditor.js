import { 
    Box as MuiBox
} from '@mui/material';
import { RichUtils } from 'draft-js';
import React, { useCallback, useEffect, useState } from 'react';
import { getDraftText, useFooterContext } from '../ChatFooter';
import MultilineTextField from './MultilineTextField';
import { listFormatOption, textFormatOptions } from '../header/textFormatting';
import ToolbarHeader from '../header/ToolbarHeader';

export default function MessageEditor () {
    const [{
        editorState,
        disabledHeader,
        textFieldRef,
        showToolbar,
        target,
    }, {handleChange, handleSendMessage, setDisabledHeader
    }] = useFooterContext();

    const [formats, setFormats] = useState([]);
    const [listMode, setListMode] = useState(null);
    const [align, setAlign] = useState(null);

    const handleChangeFormat = format => {
        const _style = format.toUpperCase();
        const isFormat = textFormatOptions.find(({id}) => id  === _style);
        const isList = listFormatOption.find(({id}) => id === format);
        const isAlign = ['left', 'right', 'center', 'justify'].find(align => align === format)
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
        if(isAlign) setAlign(format)
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
    
    const handleChangeFormatAutomatically = useCallback((event) => {
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
    }, [formats, handleChange, listMode]);

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
            display="flex"
            overflow="hidden"
            flexDirection="column"
            width="100%"
        >
            <ToolbarHeader
                formats={formats}
                listMode={listMode}
                align={align}
                handleChangeFormat={handleChangeFormat}
                editorState={editorState}
                handleChange={handleChange}
                disabled={disabledHeader}
                showToolbar={showToolbar}
                textFieldRef={textFieldRef}
            />
            <MultilineTextField
                handleChange={handleChangeFormatAutomatically}
                handleKeyCommand={handleKeyCommand}
                editorState={editorState}
                showPlaceHolder={!listMode}
                onBlur={() => {
                    setFormats([]);
                    setListMode(null);
                    setAlign(null);
                    setDisabledHeader(true);
                }}
                onFocus={() => setDisabledHeader(false)}
                textFieldRef={textFieldRef}
                handleSendMessage={handleSendMessage}
                target={target}
            />
        </MuiBox>
    )
}