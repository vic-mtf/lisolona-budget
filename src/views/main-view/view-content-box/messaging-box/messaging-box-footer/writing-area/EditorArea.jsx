import React, { useState } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import EditorStyledWrapper from "./EditorStyledWrapper";
import EditorAreaHeader from "./EditorAreaHeader";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { handleKeyCommand } from "./key-commands/keyCommands";
import decorator from "./decorator/decorator";
import styleMap, { blockStyleFn } from "./decorator/styleMap";
import { Divider, useTheme } from "@mui/material";
import AddLinkForm from "./buttons/AddLinkForm";
import getCurrentBlockType from "./buttons/getCurrentBlockType";
import { useEffect } from "react";
import { EVENT_CHANGE_DATA } from "./buttons/buttons";
import selectLink, { _SELECT_LINK_EVENT } from "./decorator/selectLink";
import keyBindingFn from "./key-commands/keyBindingFn";
import useSmallScreen from "../../../../../../hooks/useSmallScreen";
import {
  _SEND_DATA_EVENT,
  convertToEditorState,
  isEditorStateEmpty,
  listenSendData,
} from "./buttons/sendData";
import AnimatedHeaderWrapper from "./AnimatedHeaderWrapper";

const EditorArea = React.memo(
  ({
    placeholder,
    editorRef,
    onFocus,
    hideToolbar = false,
    onSend,
    onSendable,
    format = "html",
    defaultContent = "",
  }) => {
    const [editorState, setEditorState] = useState(
      convertToEditorState(defaultContent, format)
    );
    const matches = useSmallScreen();
    const style = useMemo(
      () => getCurrentBlockType(editorState),
      [editorState]
    );
    const theme = useTheme();
    const [openAddLink, setOpenAddLink] = useState(false);
    const editor = useMemo(() => ({}), []);
    const hasFocus = useMemo(
      () =>
        editorState &&
        document.activeElement.classList.contains("public-DraftEditor-content"),
      [editorState]
    );

    useEffect(() => {
      const onSelectLink = ({ detail: { data } }) =>
        selectLink(data, editorState, setEditorState);
      const onSendData = () =>
        listenSendData(editorState, setEditorState, onSend, format, null);

      EVENT_CHANGE_DATA.addEventListener(_SELECT_LINK_EVENT, onSelectLink);
      EVENT_CHANGE_DATA.addEventListener(_SEND_DATA_EVENT, onSendData);

      if (typeof onFocus === "function") onFocus(hasFocus);
      if (typeof onSendable === "function")
        onSendable(isEditorStateEmpty(editorState));

      return () => {
        EVENT_CHANGE_DATA.removeEventListener(_SELECT_LINK_EVENT, onSelectLink);
        EVENT_CHANGE_DATA.removeEventListener(_SEND_DATA_EVENT, onSendData);
      };
    }, [editorState, editorRef, onFocus, hasFocus, onSend, onSendable, format]);

    return (
      <>
        <EditorStyledWrapper
          onClick={() => {
            if (!hasFocus) editorRef.current.focus();
          }}>
          <AnimatedHeaderWrapper open={!hideToolbar}>
            <EditorAreaHeader
              editorState={editorState}
              setEditorState={setEditorState}
              onOpenAddLink={() => {
                editor.editorState = editorState;
                setOpenAddLink(true);
              }}
              hasFocus={hasFocus}
              editorRef={editorRef}
            />
            <Divider />
          </AnimatedHeaderWrapper>

          <Editor
            editorState={editorState}
            ref={editorRef}
            handleKeyCommand={(keyCommand, editorState) =>
              handleKeyCommand(keyCommand, editorState, setEditorState)
            }
            onChange={(editorState) => {
              setEditorState(EditorState.set(editorState, { decorator }));
            }}
            keyBindingFn={(e) =>
              keyBindingFn(e, editorState, setEditorState, !matches)
            }
            blockStyleFn={blockStyleFn}
            customStyleMap={styleMap(theme)}
            placeholder={style === "unstyled" && placeholder}
          />
        </EditorStyledWrapper>
        <AddLinkForm
          open={openAddLink}
          editorState={editor.editorState}
          setEditorState={setEditorState}
          editorRef={editorRef}
          onClose={(event) => {
            setOpenAddLink(false);
            editorRef.current?.focus();
            if (event && editor?.editorState) {
              const { editorState } = editor;
              const selectionState = editorState.getSelection();
              const newEditorState = EditorState.forceSelection(
                editorState,
                selectionState
              );
              setEditorState(newEditorState);
            }
          }}
        />
      </>
    );
  }
);

EditorArea.displayName = "EditorArea";

EditorArea.propTypes = {
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  editorRef: PropTypes.object,
  hideToolbar: PropTypes.bool,
  onSend: PropTypes.func,
  onSendable: PropTypes.func,
  format: PropTypes.oneOf(["html", "json", "markdown"]),
  defaultContent: PropTypes.string,
};

export default EditorArea;
