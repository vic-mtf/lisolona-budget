import React, { useEffect, useLayoutEffect, useState } from 'react';
import { alpha, useTheme } from '@mui/material';
import "@draft-js-plugins/text-alignment/lib/plugin.css";
import Editor from '@draft-js-plugins/editor';
import WritingAreaHeader from './WritingAreaHeader';
import { EditorState, convertFromRaw } from 'draft-js';
import decorator from './buttons/decorator';
import customStyleMap from './buttons/customStyleMap';
import blockRendererFn from './buttons/blockRendererFn';
import addEmoji from './buttons/addEmoji';
import { getTextFromEditorState } from './countText';
import { plugins } from './WritingArea';
import { blockStyleFn } from './style-editor/style-editor';
import editorStateEmpty from './editorStateEmpty';
import store from '../../../../../redux/store';
import { modifyData } from '../../../../../redux/data';
import { MESSAGE_CHANNEL } from '../../ChatBox';

export default function EditorText ({
  onFocus, 
  onBlur, 
  editorRef, 
  rootRef, 
  hasFocus, 
  setIsEmpty, 
  isEmpty, 
  placeHolder, 
  onSubmit,
  filesRef
}) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const onChange = event => setEditorState(EditorState.set(event, { decorator }));
    const theme = useTheme();

    const handleReturn = (e) => {
      if (!e.ctrlKey && !e.shiftKey) {
          e.preventDefault();
          if(typeof onSubmit === 'function')
            onSubmit();
      return 'handled';
      }
      return 'not-handled';
  }; 
  
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
      const events = {
        selectEmoji: '_select-emoji',
        submitMessage: '_submit-internal-message',
      };
      const onSelectEmoji = event => {
        setEditorState(addEmoji(editorState, event.detail.data));
      };
      const onSubmitMessage = event => {
        if(event.detail.name === events.submitMessage && typeof onSubmit === 'function') {
          if(!isEmpty)
            setEditorState(editorStateEmpty(editorState));
          if(filesRef?.current?.length) {
            filesRef.current = [];
            store.dispatch(
              modifyData({
                  data: [],
                  key: 'chatBox.footer.files',
              })
            );
          }
        }
      };

      MESSAGE_CHANNEL.addEventListener(events.selectEmoji, onSelectEmoji);
      MESSAGE_CHANNEL.addEventListener(events.submitMessage, onSubmitMessage);

      return () => {
        MESSAGE_CHANNEL.removeEventListener(events.selectEmoji, onSelectEmoji);
        MESSAGE_CHANNEL.removeEventListener(events.submitMessage, onSubmitMessage);
      };
    }, [editorState, onSubmit, filesRef, isEmpty]);
  
    useLayoutEffect(() => {
      const isText = getTextFromEditorState(editorState).trim();
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
          placeholder={placeHolder}
          onChange={onChange}
          plugins={plugins}
          handleReturn={handleReturn}
          ref={editorRef}
        />
      </>
    );
  };