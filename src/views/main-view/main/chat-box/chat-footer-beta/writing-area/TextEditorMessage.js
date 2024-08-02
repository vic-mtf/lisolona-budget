import React, { useCallback, useEffect, useState } from 'react';
import { useTheme, alpha } from '@mui/material';
import EditorText from './EditorText';
import WritingAreaFooter from './WritingAreaFooter';
import { useSelector } from 'react-redux';
import AnimatedWrapper from './AnimatedWrapper';
import EmojiPicker from '../emoji-picker/EmojiPicker';
import FilesThumbView from '../files-thumb-view/FilesThumbView';
import { MESSAGE_CHANNEL } from '../../ChatBox';

export default function TextEditorMessage ({
  rootRef, 
  filesRef, 
  paperRef, 
  onSubmit, 
  placeHolder, 
  editorRef, 
  media
}) {

  return (
      <>
        <AnimatedWrapper
          path="data.chatBox.footer.files.length"
        >
          <FilesThumbView
            filesRef={filesRef}
          />
        </AnimatedWrapper>
        <AnimatedWrapper
          path="data.chatBox.footer.emojiBar"
        >
          <EmojiPicker
            onSelect={(data) =>  {
              const name = '_select-emoji';
              const event = {
                detail: { name, data }
              };
              const customEvent = new CustomEvent(name, event);
              MESSAGE_CHANNEL.dispatchEvent(customEvent);
            }}
          />
        </AnimatedWrapper>
        <BottomFooterEditor
          rootRef={rootRef}
          filesRef={filesRef}
          paperRef={paperRef}
          onSubmit={onSubmit}
          placeHolder={placeHolder}
          editorRef={editorRef}
          media={media}
        />
      </>
  )
}

const BottomFooterEditor = ({filesRef, rootRef, paperRef, onSubmit, placeHolder, editorRef, media}) => {
    const recording = useSelector(store => store?.data?.chatBox?.footer?.recording);
    const [hasFocus, setHasFocus] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const theme = useTheme();
    const onFocus = useCallback((e) => {
      editorRef.current.focus();
      setHasFocus(true);
    },[editorRef]);
  
    const onBlur = useCallback(() => {
      setHasFocus(false);
    }, []);
  
    useEffect(() => {
      const root = rootRef.current;
      const paper = paperRef.current;
      if(recording) {
        root?.removeEventListener('click', onFocus);
        root?.removeEventListener('mousedown', onFocus);
        root?.blur();
      } else {
        root?.addEventListener('click', onFocus);
        root?.addEventListener('mousedown', onFocus);
        root?.focus();
      }
      if(paper) {
        paper.style.boxShadow = theme.shadows[hasFocus ? 2 : 0];
        paper.style.backgroundColor = alpha(
          theme.palette.common[
            theme.palette.mode === 'light'? 'black' : 'white'
          ], 
          hasFocus ? .05 : 0
        );
      }
      return () => {
        root?.removeEventListener('click', onFocus);
        root?.removeEventListener('mousedown', onFocus);
      }
    },[rootRef, onFocus, hasFocus, theme, paperRef, recording]);
  
    return (
      <>
        <EditorText
          rootRef={rootRef}
          editorRef={editorRef}
          onFocus={onFocus}
          setIsEmpty={setIsEmpty}
          isEmpty={isEmpty}
          hasFocus={hasFocus}
          onBlur={onBlur}
          filesRef={filesRef}
          placeHolder={placeHolder}
          onSubmit={onSubmit}
        />
        <WritingAreaFooter
          onFocus={onFocus} 
          isEmpty={isEmpty}
          setIsEmpty={setIsEmpty}
          filesRef={filesRef}
          hasFocus={hasFocus}
          onSubmit={onSubmit}
          editorRef={editorRef}
          media={media}
        />
      </>
    );
  };