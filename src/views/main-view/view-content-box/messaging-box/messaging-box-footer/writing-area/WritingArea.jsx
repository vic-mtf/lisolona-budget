import { Box, Divider, Paper, useTheme } from "@mui/material";
import EditorArea from "./EditorArea";
import { useState } from "react";
import { useEffect } from "react";
import useSmallScreen from "../../../../../../hooks/useSmallScreen";
import EditorAreaFooter from "./EditorAreaFooter";
import PropTypes from "prop-types";
import AnimatedHeaderWrapper from "./AnimatedHeaderWrapper";
import ReplyMessage from "./ReplyMessage";
import { useCallback } from "react";
import { useSelector } from "react-redux";

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
  const recording = useSelector((store) => store.data.chatBox.footer.recording);
  const matches = useSmallScreen();
  const theme = useTheme();

  const onToggleToolbar = useCallback(() => setHideToolbar((v) => !v), []);

  useEffect(() => {
    if (!matches && placeholder && !recording) {
      setHasFocus(true);
      editorRef.current?.focus();
    }
    if (recording) {
      setHasFocus(false);
      editorRef.current?.blur();
    }
  }, [matches, placeholder, editorRef, recording]);

  return (
    <Box overflow='hidden' sx={{ p: { md: 1 } }}>
      <Paper
        elevation={hasFocus ? 2 : 0}
        sx={{
          overflow: "hidden",
          border: { md: `1px solid ${theme.palette.divider}` },
          borderRadius: { xs: 0, md: 1 },
        }}>
        <AnimatedHeaderWrapper open={Boolean(replyMessage)} key={id}>
          <ReplyMessage
            message={replyMessage}
            onScrollToMessage={onScrollToMessage}
            onCancel={onCancelReplyMessage}
          />
          <Divider />
        </AnimatedHeaderWrapper>
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
        <EditorAreaFooter
          hideToolbar={hideToolbar}
          onToggleToolbar={onToggleToolbar}
          isSendable={isSendable}
        />
      </Paper>
    </Box>
  );
}

WritingArea.propTypes = {
  onSend: PropTypes.func,
  format: PropTypes.oneOf(["html", "markdown", "json"]),
  replyMessage: PropTypes.object,
  placeholder: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  editorRef: PropTypes.object.isRequired,
  onScrollToMessage: PropTypes.func,
  onCancelReplyMessage: PropTypes.func,
};
