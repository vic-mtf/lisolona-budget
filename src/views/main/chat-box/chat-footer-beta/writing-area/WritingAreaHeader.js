import React, { useCallback, useMemo } from 'react';
import "@draft-js-plugins/text-alignment/lib/plugin.css";
import { WritingAreaToolbar } from './WritingArea';
import { Divider, Paper, ToggleButtonGroup as TBG, alpha, styled } from '@mui/material';
import InlineStyleButton, { alignTextStyles, inlineStyles, useInlineStyles, useTextAlign } from './buttons/InlineStyleButton';
import { RichUtils } from 'draft-js';
import BlockStyleButton, { BlockStyleButtonHeader, blockStyles, useBlockStyles, useHeaderStyles } from './buttons/blockStyleButton';
import applyCallbackToSelectedText from './applyCallbackToSelectedText';
import { countTextInCurrentLine } from './countText';
import addLink from './buttons/addLink';
import AddLinButton from './buttons/AddLinButton';
import CustomToggleButtonGroup from '../../../../../components/CustomToggleButtonGroup';
import Slide from './Slide';
import { useSelector } from 'react-redux';

export const ToggleButtonGroup = styled(TBG)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        margin: theme.spacing(0, 0.125, 0, 0.125),
        border: `.01px solid transparent`,
        '&.Mui-disabled': { border: `.01px solid transparent`},
        '&:not(:first-of-type)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-of-type': {
            borderRadius: theme.shape.borderRadius,
        },
    },
}));

export const CustomPaper = styled(props => (
    <Paper
        elevation={0}
        {...props}
    />)
    )(({ theme }) => ({
    display: 'flex',
    borderRadius: 0,
    padding: theme.spacing(0.5, 0, 0.5, 0),
    background: alpha(
        theme.palette.common[ 
            theme.palette.mode === 'light' ? 
            'black' : 'white'
    ], 0.08
    ),
    flexWrap: 'wrap',
}));



ToggleButtonGroup.defaultProps = {
    size: 'small',
    onMouseDown: event => event.preventDefault(),
    onMouseUp: event => event.preventDefault()
}
const  WritingAreaHeader = ({editorState, setEditorState, hasFocus, onFocus}) => {
    const disabled = !hasFocus;
    const open = useSelector(store => store.data.chatBox.footer.toolbar);
    const inlineStylesValues =  useInlineStyles(editorState);
    const blockStylesValues = useBlockStyles(editorState);
    const textAlign = useTextAlign(editorState);
    const headerStylesValues = useHeaderStyles(editorState);
    const textAlignValue = (disabled || !countTextInCurrentLine(editorState).charCount) ? 
    '' : [typeof textAlign === 'string' ? textAlign : 'left'];

    const onChangeInlineStyles = useCallback(event => {
        const value = event.currentTarget.value?.toString();
        let newEditorState = RichUtils.toggleInlineStyle(editorState, value?.toUpperCase());
        const [option] = inlineStyles.filter(inlineStyle => {
            const find = inlineStyle.value === value;
            const finInverse = inlineStylesValues.find(value => 
                inlineStyle.inverse?.toLocaleLowerCase() === value
            );
            return find && finInverse;
        });
        if(option) 
            newEditorState = RichUtils.toggleInlineStyle(newEditorState, option.inverse);
        setEditorState(newEditorState);
    },[editorState, setEditorState, inlineStylesValues]);
    const onChangeTextAlign = useCallback(event => {
        const value = event.currentTarget.value?.toString();
            const callback = editorState => {
                let newEditorState = editorState;
                if(textAlign) 
                    newEditorState = RichUtils.toggleInlineStyle(newEditorState, textAlign);
                return RichUtils.toggleInlineStyle(newEditorState, value);
            }
            setEditorState(
                applyCallbackToSelectedText(editorState, callback)
            ); 
    },[editorState, setEditorState, textAlign]);

    const onChangeBlockStyles = useCallback(event => {
        const value = event.currentTarget.value;
        let newEditorState = RichUtils.toggleBlockType(editorState, value);
        setEditorState(newEditorState);
    },[editorState, setEditorState]);

    const onChangeHeaderStyles = useCallback(event => {
        const value = event.currentTarget.value;
        let newEditorState = RichUtils.toggleBlockType(editorState, value);
        setEditorState(newEditorState);
    },[editorState, setEditorState]);

  return (
    <Slide open={open}>
        <WritingAreaToolbar>
        {
            () => (
                <CustomPaper>
                    <ToggleButtonGroup
                        value={inlineStylesValues}
                        onChange={onChangeInlineStyles}
                        disabled={disabled}
                    >{inlineStyles.map(props => (
                        <InlineStyleButton key={props.value} {...props}  />
                    ))}
                    </ToggleButtonGroup>
                    <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                    <ToggleButtonGroup
                        value={blockStylesValues}
                        onChange={onChangeBlockStyles}
                        disabled={disabled}
                    >{blockStyles.map(props => (
                        <BlockStyleButton key={props.value} {...props}  />
                    ))}
                    <BlockStyleButtonHeader
                        onChangeHeader={onChangeHeaderStyles}
                        valueHeader={headerStylesValues}
                    />
                    </ToggleButtonGroup>
                    <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                    <ToggleButtonGroup
                        value={textAlignValue}
                        onChange={onChangeTextAlign}
                        disabled={disabled}
                        defaultValue="left"
                    >{alignTextStyles.map(props => (
                        <InlineStyleButton 
                            key={props.value} 
                            {...props}  
                        />
                    ))}
                    </ToggleButtonGroup>
                    <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                    <ToggleButtonGroup
                        // onMouseDown={null}
                        // onMouseUp={null}
                        disabled={disabled}
                    >
                        <AddLinButton
                            editorState={editorState}
                            onFocus={onFocus}
                            addLink={(data) => setEditorState(addLink(editorState, data))}
                        />
                    </ToggleButtonGroup>
                </CustomPaper>
            )
        }
        </WritingAreaToolbar>
    </Slide>
  );
}

export default WritingAreaHeader;