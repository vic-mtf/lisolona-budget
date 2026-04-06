import { Box, Divider, Paper, useTheme } from "@mui/material";
import EditorArea from "./EditorArea";
import { useState } from "react";
import { useEffect } from "react";
import useSmallScreen from "@/hooks/useSmallScreen";
import EditorAreaFooter from "./EditorAreaFooter";
import VerticalCollapse from "@/components/VerticalCollapse";
import ReplyMessage from "./ReplyMessage";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import FilesThumbnailView from "../files-thumbnail-view/FilesThumbnailView";

export default function WritingArea({
  onSend,
  format = "html",
  replyMessage,
  placeholder,
  onScrollToMessage,
  onCancelReplyMessage,
  editorRef,
  id,
}) {
  const [hasFocus, setHasFocus] = useState(false);
  const [hideToolbar, setHideToolbar] = useState(false);
  const [isSendable, setIsSendable] = useState(false);
  const filesExist = useSelector(
    (store) => store.data.chatBox.footer.files[id]?.length > 0
  );
  const recording = useSelector((store) => store.data.chatBox.footer.recording);
  const matches = useSmallScreen();
  const theme = useTheme();

  const onToggleToolbar = useCallback(() => setHideToolbar((v) => !v), []);
  const onScrollIntoView = useCallback(() => {
    const { editorContainer } = editorRef.current || {};
    setTimeout(() => {
      editorContainer?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 200);
  }, [editorRef]);

  useEffect(() => {
    if (placeholder && !recording) {
      setHasFocus(true);
      editorRef.current?.focus();
    }
    if (recording) {
      setHasFocus(false);
      editorRef.current?.blur();
    }
  }, [matches, placeholder, editorRef, recording]);

  useEffect(() => {
    if (matches && hasFocus) onScrollIntoView();
  }, [matches, hasFocus, onScrollIntoView]);

  return (
    <Box overflow='hidden' sx={{ p: { md: 1 } }} onClick={onScrollIntoView}>
      <Paper
        elevation={hasFocus ? 2 : 0}
        sx={{
          overflow: "hidden",
          border: { md: `1px solid ${theme.palette.divider}` },
          borderRadius: { xs: 0, md: 1 },
        }}>
        <VerticalCollapse open={Boolean(replyMessage)} key={id}>
          <ReplyMessage
            message={replyMessage}
            onScrollToMessage={onScrollToMessage}
            onCancel={onCancelReplyMessage}
          />
          <Divider />
        </VerticalCollapse>
        <EditorArea
          onFocus={setHasFocus}
          onSendable={setIsSendable}
          placeholder={placeholder}
          editorRef={editorRef}
          hideToolbar={hideToolbar}
          onSend={onSend}
          format={format}
          defaultContent=''
        />
        <VerticalCollapse open={filesExist} appear={false}>
          <FilesThumbnailView id={id} />
        </VerticalCollapse>
        <EditorAreaFooter
          hideToolbar={hideToolbar}
          onToggleToolbar={onToggleToolbar}
          isSendable={isSendable}
          filesExist={filesExist}
          id={id}
        />
      </Paper>
    </Box>
  );
}
