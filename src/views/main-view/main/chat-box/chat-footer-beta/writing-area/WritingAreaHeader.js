import React, { useCallback } from 'react';
import "@draft-js-plugins/text-alignment/lib/plugin.css";
import { WritingAreaToolbar } from './WritingArea';
import InlineStyleButton, { alignTextStyles, inlineStyles, useInlineStyles, useTextAlign } from './buttons/InlineStyleButton';
import { RichUtils } from 'draft-js';
import BlockStyleButton, { BlockStyleButtonHeader, blockStyles, useBlockStyles, useHeaderStyles } from './buttons/blockStyleButton';
import applyCallbackToSelectedText from './applyCallbackToSelectedText';
import { countTextInCurrentLine } from './countText';
import addLink from './buttons/addLink';
import AddLinButton from './buttons/AddLinButton';
import Slide from './Slide';
import { useSelector } from 'react-redux';
import HeaderAutoHideResize, { useDefaultNumButtonSizeByRoot } from './HeaderAutoHideResize';


export default function  WritingAreaHeader ({editorState, setEditorState, hasFocus, onFocus}) {
    const disabled = !hasFocus;
    const open = useSelector(store => store.data.chatBox.footer.toolbar);
    const inlineStylesValues =  useInlineStyles(editorState);
    const blockStylesValues = useBlockStyles(editorState);
    const textAlign = useTextAlign(editorState);
    const headerStylesValues = useHeaderStyles(editorState);
    const textAlignValue = (disabled || !countTextInCurrentLine(editorState).charCount) ? 
    '' : [typeof textAlign === 'string' ? textAlign : 'left'];
    const [nButton, headerRoot] = useDefaultNumButtonSizeByRoot();

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

    const toggleButtonGroups = [
        {
            value: inlineStylesValues,
            id: 'inline-styles',
            onChange: onChangeInlineStyles,
            disabled,
            children: inlineStyles.map(props => (
                <InlineStyleButton {...props}  />
            ))
        },
        {
            value: blockStylesValues,
            onChange: onChangeBlockStyles,
            id: 'block-styles',
            disabled,
            children: blockStyles.map(props => (
                <BlockStyleButton {...props}  />
            )).concat([
            <BlockStyleButtonHeader
                onChangeHeader={onChangeHeaderStyles}
                valueHeader={headerStylesValues}
            />]),
        },
        {
            value:textAlignValue,
            onChange:onChangeTextAlign,
            id: 'text-align',
            disabled,
            defaultValue:"left",
            children: alignTextStyles.map(props => (
                <InlineStyleButton {...props}  />
            ))
        },
        {
            disabled,
            id: 'link-option',
            children: [(
                <AddLinButton
                    editorState={editorState}
                    onFocus={onFocus}
                    addLink={(data) => setEditorState(addLink(editorState, data))}
                />
            )]
        }
    ];

  return (
    <Slide 
        open={open}
        ref={headerRoot}
    >
        <WritingAreaToolbar>
        {
            () => (
                <HeaderAutoHideResize
                    toggleButtonGroups={toggleButtonGroups}
                    disabled={disabled}
                    defaultNButton={nButton}
                    key={nButton ? 1 : 0}
                /> 
            )
        }
        </WritingAreaToolbar>
    </Slide>
  );
}
