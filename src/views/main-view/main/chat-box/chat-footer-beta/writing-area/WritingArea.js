import React, {useCallback, useEffect, useMemo, useRef } from 'react';
import {  Box as MuiBox, Paper } from '@mui/material';
import createStaticToolbarPlugin from '@draft-js-plugins/static-toolbar';
import createTextAlignmentPlugin from '@draft-js-plugins/text-alignment';
import "@draft-js-plugins/text-alignment/lib/plugin.css";
// import "prismjs/themes/prism.css";
import VoiceRecord from '../voice-record/VoiceRecord';
import publicDraftStyle from './style-editor/publicDraftStyle';
import AnimatedWrapper from './AnimatedWrapper';
import TextEditorMessage from './TextEditorMessage';
import { MESSAGE_CHANNEL } from '../../ChatBox';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';
import { getTextFromEditorState } from './countText';
import customEntityTransform from './customEntityTransform';

export const textAlignmentPlugin = createTextAlignmentPlugin();
const staticToolbarPlugin = createStaticToolbarPlugin();
export const { Toolbar: WritingAreaToolbar } = staticToolbarPlugin;
export const plugins = [staticToolbarPlugin, textAlignmentPlugin];

export default React.memo(function WritingArea ({ onSubmit, target, media }) {
  const filesRef = useRef([]);
  const rootRef = useRef();
  const paperRef = useRef();
  const editorRef = useRef();

  const placeHolder = useMemo(() => 
    `Entrez votre message: ${target?.type === 'room' ? '#' : '@'}${target?.name}...`,
    [target]
  );
  const handleSubmit = useCallback(() => {
    const editorState = editorRef?.current?.getEditorState();
    const isText = getTextFromEditorState(editorState).trim();
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const HTML = isText ? draftToHtml(rawContentState, {}, true, customEntityTransform) : null;
    const Files = filesRef.current.length ? filesRef.current: null;
    if(HTML || Files) {
      const data = { HTML, Files };
      if(typeof onSubmit === 'function')
        onSubmit(data);
      const name = '_submit-internal-message';
      const customEvent = new CustomEvent(name, {detail: {name, data}});
      MESSAGE_CHANNEL.dispatchEvent(customEvent);
    }
  },[onSubmit]);

  return (
    <Paper
      component="div"
      elevation={0}
      ref={paperRef}
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <MuiBox 
        ref={rootRef}
        component="div"
        sx={publicDraftStyle}
      >
         <TextEditorMessage
            paperRef={paperRef}
            filesRef={filesRef}
            rootRef={rootRef}
            placeHolder={placeHolder}
            editorRef={editorRef}
            onSubmit={handleSubmit}
            media={media}
         />
         
         {media &&
         <AnimatedWrapper 
            path="data.chatBox.footer.recording"
            divided={false}
            type="fade"
            wrapperProps={{
              sx: {
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right:0 ,
                zIndex: theme => theme.zIndex.drawer + 100,
                width: '100%',
                height: '100%',
                background: theme => `linear-gradient(transparent,
                  ${theme.palette.background.paper},
                  ${theme.palette.background.paper},
                  ${theme.palette.background.paper},
                  ${theme.palette.background.paper}
                )`,
              }
            }}
          >
            <VoiceRecord/>
         </AnimatedWrapper>}
      </MuiBox>
    </Paper>
  );
});