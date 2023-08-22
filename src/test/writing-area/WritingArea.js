import React, { useEffect, useRef, useState } from 'react';
import { Box as MuiBox, alpha, useTheme } from '@mui/material';
import createStaticToolbarPlugin from '@draft-js-plugins/static-toolbar';
import createTextAlignmentPlugin from '@draft-js-plugins/text-alignment';
import "@draft-js-plugins/text-alignment/lib/plugin.css";
import Editor from '@draft-js-plugins/editor';
import WritingAreaHeader from './WritingAreaHeader';
import { EditorState } from 'draft-js';
import "prismjs/themes/prism.css";
import decorator from './buttons/decorator';
import WritingAreaFooter from './WritingAreaFooter';

export const textAlignmentPlugin = createTextAlignmentPlugin();
const staticToolbarPlugin = createStaticToolbarPlugin();
export const { Toolbar: WritingAreaToolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin, textAlignmentPlugin];

export default function WritingArea ({onSubmit}) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onChange = event => setEditorState(EditorState.set(event, { decorator }));
  const editorRef = useRef();
  const hasFocusRef = useRef(false);
  const onFocus = () => editorRef.current.focus();
  const rootRef = useRef();
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
  }, [editorState, theme]);

  return (
    <MuiBox 
      onClick={onFocus} 
      onMouseDown={onFocus}
      ref={rootRef}
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        cursor: 'text',
        borderRadius: 1,
        boxShadow: theme => `inset 0px 1px 8px -3px ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        color: 'text.primary',
        '& .public-DraftEditor-content': {
          //minHeight: 100,
          fontFamily: 'calibri',
          '& blockquote': {
            borderLeft: theme => `4px solid ${theme.palette.divider}`,
            pl: .5
          }
        },
        '& .public-DraftStyleDefault-link': {
          color: '#3b5998',
          textDecoration: 'underline',
        }
      }}
    >
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
        customStyleMap={{
          SUPERSCRIPT: {
            fontSize: '0.6em',
            verticalAlign: 'super'
          },
          SUBSCRIPT: {
            fontSize: '0.6em',
            verticalAlign: 'sub'
          },
          LINK: {
            textDecoration: 'underline',
          },
          CODE: {
            color: theme.palette.error.main,
            padding: '2px',
            backgroundColor: alpha(theme.palette.common[
              theme.palette.mode === 'light' ? 'black' : 'white'
            ], 0.04),
            border: `.5px solid ${theme.palette.divider}`,
            borderRadius: '5px',
          }
        }}
        onChange={onChange}
        plugins={plugins}
        ref={editorRef}
      />

      <WritingAreaFooter
        editorState={editorState}
        setEditorState={setEditorState}
        hasFocusRef={hasFocusRef}
        onFocus={onFocus}
      />
    </MuiBox>
  );
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