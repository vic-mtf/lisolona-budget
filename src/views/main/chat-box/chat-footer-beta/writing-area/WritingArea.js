import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Divider, Box as MuiBox, Paper, Stack, alpha, useTheme } from '@mui/material';
import createStaticToolbarPlugin from '@draft-js-plugins/static-toolbar';
import createTextAlignmentPlugin from '@draft-js-plugins/text-alignment';
import "@draft-js-plugins/text-alignment/lib/plugin.css";
import "@draft-js-plugins/emoji/lib/plugin.css";
import Editor from '@draft-js-plugins/editor';
import WritingAreaHeader from './WritingAreaHeader';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import { EditorState } from 'draft-js';
import "prismjs/themes/prism.css";
import decorator from './buttons/decorator';
import WritingAreaFooter from './WritingAreaFooter';
import EmojiPicker from '../emoji-picker/EmojiPicker';
import Slide from './Slide';
import { useSelector } from 'react-redux';
import customStyleMap from './buttons/customStyleMap';
import blockRendererFn from './buttons/blockRendererFn';
import addCustomEntity from './buttons/addCustomEntity';
import addEmoji from './buttons/addEmoji';
import { getTextFromEditorState } from './countText';

const DIV = document.createElement('div');

export const textAlignmentPlugin = createTextAlignmentPlugin();
const staticToolbarPlugin = createStaticToolbarPlugin();
export const { Toolbar: WritingAreaToolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin, textAlignmentPlugin];

export default function WritingArea ({onSubmit}) {
  const [focus, setFocus] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const editorRef = useRef();
  const hasFocusRef = useRef(false);
  const rootRef = useRef();
  const onFocus = () => editorRef.current.focus();

  return (
    <>
      <Stack 
        onClick={onFocus} 
        onMouseDown={onFocus}
        ref={rootRef}
        component={Paper}
        elevation={focus ? 2: 0}
        sx={{
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
          cursor: 'text',
          border: theme => `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          color: 'text.primary',
          '& div.DraftEditor-root ': {
            fontSize: theme => theme.typography.body1.fontSize,
            width: '100%',
            px: 1,
            pt: .5,
            pb: 0,
            fontFamily: 'calibri',
            '& blockquote': {
              borderLeft: theme => `4px solid ${theme.palette.divider}`,
              pl: .5
            }
          },
          '& .public-DraftStyleDefault-link': {
            color: '#3b5998',
            textDecoration: 'underline',
          },
          '& div.DraftEditor-editorContainer': {
            width: "100%",
            overflow: 'auto',
            overflowX: 'hidden',
            maxHeight: 150,
            fontSize: theme => theme.typography.body1.fontSize,
        }
        }}
      >
        
        <EmojiWrapper>
          <EmojiPicker
            onSelect={(data) =>  {
              const name = '_select-emoji';
              const customEvent = new CustomEvent(name, {
                detail: {name, data}
              });
              DIV.dispatchEvent(customEvent);
            }}
          />
        </EmojiWrapper>
        <EditorText
          rootRef={rootRef}
          editorRef={editorRef}
          hasFocusRef={hasFocusRef}
          setFocus={setFocus}
          setIsEmpty={setIsEmpty}
          isEmpty={isEmpty}
          focus={focus}
        />
        <WritingAreaFooter
          hasFocusRef={hasFocusRef}
          onFocus={onFocus} 
          isEmpty={isEmpty}
          setIsEmpty={setIsEmpty}
        />
      </Stack>
    </>
  );
}

const EmojiWrapper = ({children}) => {
  const open = useSelector(store => store.data.chatBox.footer.emojiBar);
  return (
    <>
      <Slide open={open}>
        {children}
      </Slide>
      {open && <Divider/>}
    </>
  )
}

function blockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'blockquote') {
    return '_blockquote';
  }
  if(type === 'code-block') {
    return '_code-block';
  }
}

const EditorText = ({hasFocusRef, editorRef, rootRef, setFocus, focus, setIsEmpty, isEmpty}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onChange = event => setEditorState(EditorState.set(event, { decorator }));
  const onFocus = () => editorRef.current.focus();
  const theme = useTheme();

  useEffect(() => {
    const codeBlock = rootRef.current.querySelectorAll('._code-block');
    codeBlock.forEach(codeBlock => {
      codeBlock.style.borderRadius = '5px';
      codeBlock.style.padding = '5px';
      codeBlock.style.backgroundColor = alpha(theme.palette.common[
        theme.palette.mode === 'light' ? 'black' : 'white'
      ], 0.04)
    });
  }, [editorState, theme, rootRef]);

  useEffect(() => {
    const onSelectEmoji = event => {
      setEditorState(addEmoji(editorState, event.detail.data));
    };
    const name = '_select-emoji';
    DIV.addEventListener(name, onSelectEmoji);
    return () => {
      DIV.removeEventListener(name, onSelectEmoji);
    };
  }, [editorState]);

  useLayoutEffect(() => {
    if(hasFocusRef.current && !focus) setFocus(true);
    if(!hasFocusRef.current && focus) setFocus(false);
  }, [hasFocusRef, focus, setFocus]);

  useLayoutEffect(() => {
    const isText = getTextFromEditorState(editorState).trim()
    if(isText && isEmpty) setIsEmpty(false);
    if(!isText && !isEmpty) setIsEmpty(true);
  }, [editorState, isEmpty, setIsEmpty]);

  return (
    <>
      <WritingAreaHeader
        editorState={editorState}
        setEditorState={setEditorState}
        hasFocusRef={hasFocusRef}
        onFocus={onFocus}
      />
      <Editor
        editorState={editorState}
        onFocus={() => hasFocusRef.current = true}
        onBlur={() => hasFocusRef.current = false}
        blockStyleFn={blockStyleFn}
        blockRendererFn={blockRendererFn}
        customStyleMap={customStyleMap({theme})}
        onChange={onChange}
        plugins={plugins}
        ref={editorRef}
      />
    </>
  );
};