import React, { useState } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import EditorStyledWrapper from "./EditorStyledWrapper";
import EditorAreaHeader from "./EditorAreaHeader";
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
import VerticalCollapse from "../../../../../../components/VerticalCollapse";
import { useSelector } from "react-redux";
import store from "../../../../../../redux/store";

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
    const [isSendable, setIsSendable] = useState(
      !isEditorStateEmpty(editorState)
    );
    const disabled = useSelector(
      (store) => store.data.chatBox.footer.recording
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
      if (typeof onFocus === "function") onFocus(hasFocus);
    }, [onFocus, hasFocus]);

    useEffect(() => {
      const onSelectLink = ({ detail: { data } }) =>
        selectLink(data, editorState, setEditorState);
      const onSendData = () => {
        const targetId = store.getState().data.discussionTarget?.id;
        const files = [
          ...(store.getState().data.chatBox.footer.files[targetId] || []),
        ];
        listenSendData(editorState, setEditorState, onSend, format, files);
      };

      EVENT_CHANGE_DATA.addEventListener(_SELECT_LINK_EVENT, onSelectLink);
      EVENT_CHANGE_DATA.addEventListener(_SEND_DATA_EVENT, onSendData);

      return () => {
        EVENT_CHANGE_DATA.removeEventListener(_SELECT_LINK_EVENT, onSelectLink);
        EVENT_CHANGE_DATA.removeEventListener(_SEND_DATA_EVENT, onSendData);
      };
    }, [editorState, onSend, format]);

    useEffect(() => {
      const editorData = editorRef?.current;
      const editor = editorData?.editor;
      const handleChange = (e) => {
        const _isSendable = e.currentTarget.innerText?.trim().length > 0;
        if (isSendable !== _isSendable && typeof onSendable === "function") {
          setIsSendable(_isSendable);
          onSendable(_isSendable);
        }
      };
      editor.addEventListener("keyup", handleChange);
      return () => {
        editor.removeEventListener("keyup", handleChange);
      };
    }, [editorRef, isSendable, onSendable]);

    return (
      <>
        <EditorStyledWrapper
          sx={{
            pointerEvents: disabled ? "none" : "auto",
          }}
          onClick={() => {
            if (!hasFocus) editorRef.current.focus();
          }}>
          <VerticalCollapse open={!hideToolbar}>
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
          </VerticalCollapse>

          <Editor
            editorState={editorState}
            ref={editorRef}
            handleKeyCommand={(keyCommand, editorState) =>
              handleKeyCommand(keyCommand, editorState, setEditorState)
            }
            onChange={(editorState) => {
              const newEditorState = EditorState.set(editorState, {
                decorator,
              });
              setEditorState(newEditorState);
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

export default EditorArea;
