import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Divider, Box as MuiBox, Paper, Stack, alpha, useTheme } from '@mui/material';
import createStaticToolbarPlugin from '@draft-js-plugins/static-toolbar';
import createTextAlignmentPlugin from '@draft-js-plugins/text-alignment';
import "@draft-js-plugins/text-alignment/lib/plugin.css";
import Editor from '@draft-js-plugins/editor';
import WritingAreaHeader from './WritingAreaHeader';
import { EditorState } from 'draft-js';
import "prismjs/themes/prism.css";
import decorator from './buttons/decorator';
import WritingAreaFooter from './WritingAreaFooter';
import EmojiPicker from '../emoji-picker/EmojiPicker';
import Slide from './Slide';
import { useSelector } from 'react-redux';
import customStyleMap from './buttons/customStyleMap';
import blockRendererFn from './buttons/blockRendererFn';
import addEmoji from './buttons/addEmoji';
import { getTextFromEditorState } from './countText';
import FilesThumbView from '../files-thumb-view/FilesThumbView';

const DIV = document.createElement('div');

export const textAlignmentPlugin = createTextAlignmentPlugin();
const staticToolbarPlugin = createStaticToolbarPlugin();
export const { Toolbar: WritingAreaToolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin, textAlignmentPlugin];

export default function WritingArea ({onSubmit}) {
  const [hasFocus, setHasFocus] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const filesRef = useRef([]);
  const editorRef = useRef();
  const rootRef = useRef();
  const onFocus = () => {
    editorRef.current.focus();
    setHasFocus(true);
  }
  const onBlur = () => {
    setHasFocus(false);
  };

  return (
    <Paper
      elevation={hasFocus ? 2: 0}
      component="div"
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        border: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      <MuiBox 
        onClick={onFocus} 
        onMouseDown={onFocus}
        ref={rootRef}
        component="div"
        sx={{
          "& *": {m: 0,p: 0, },
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
          cursor: 'text',
          color: 'text.primary',
          '& div.DraftEditor-root ': {
            width: '100%',
            px: 1,
            pt: .5,
            pb: 0,
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
         <SliderWrapper
            path="data.chatBox.footer.files.length"
          >
          <FilesThumbView
            filesRef={filesRef}
          />
        </SliderWrapper>
        <SliderWrapper
          path="data.chatBox.footer.emojiBar"
        >
          <EmojiPicker
            onSelect={(data) =>  {
              const name = '_select-emoji';
              const customEvent = new CustomEvent(name, {
                detail: {name, data}
              });
              DIV.dispatchEvent(customEvent);
            }}
          />
        </SliderWrapper>
        <EditorText
          rootRef={rootRef}
          editorRef={editorRef}
          onFocus={onFocus}
          setIsEmpty={setIsEmpty}
          isEmpty={isEmpty}
          hasFocus={hasFocus}
          onBlur={onBlur}
        />
        <WritingAreaFooter
          onFocus={onFocus} 
          isEmpty={isEmpty}
          setIsEmpty={setIsEmpty}
          filesRef={filesRef}
          hasFocus={hasFocus}
        />
      </MuiBox>
    </Paper>
  );
}

const SliderWrapper = ({children, path}) => {
  const state = useSelector(store => getValue(store, path));
  const open = Boolean(state);
  return (
    <>
      <Slide open={open}>
        {children}
      </Slide>
      {open && <Divider/>}
    </>
  )
}

function getValue(obj, path="") {
  let parts = path.split('.');
  let current = obj;
  for (let part of parts) {
      if (current[part] === undefined) return undefined;
      current = current[part];
  }
  return current;
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

const EditorText = ({onFocus, onBlur, editorRef, rootRef, hasFocus, setIsEmpty, isEmpty}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onChange = event => setEditorState(EditorState.set(event, { decorator }));
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
    const isText = getTextFromEditorState(editorState).trim()
    if(isText && isEmpty) setIsEmpty(false);
    if(!isText && !isEmpty) setIsEmpty(true);
  }, [editorState, isEmpty, setIsEmpty]);

  return (
    <>
      <WritingAreaHeader
        editorState={editorState}
        setEditorState={setEditorState}
        hasFocus={hasFocus}
        onFocus={onFocus}
      />
      <Editor
        editorState={editorState}
        onFocus={onFocus}
        onBlur={onBlur}
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