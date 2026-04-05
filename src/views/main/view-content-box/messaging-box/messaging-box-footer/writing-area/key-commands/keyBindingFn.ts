import { getDefaultKeyBinding } from "draft-js";
import { handleBackspace, handleTab } from "./keyCommands";

const keyBindingFn = (e, editorState, onChange, allowSendingEnterKey) => {
  const defaultKeyBinding = getDefaultKeyBinding(e);
  if (e.keyCode === 9) {
    e.preventDefault();
    const newEditorState = handleTab(e, editorState);
    if (newEditorState !== editorState) {
      onChange(newEditorState);
    }
    return "tab";
  }

  if (e.keyCode === 8) {
    e.preventDefault();

    const newEditorState = handleBackspace(editorState);
    if (newEditorState !== editorState) {
      onChange(newEditorState);
    }
    return "backspace";
  }

  if (e.key === "Enter" && e.ctrlKey) return defaultKeyBinding;
  else if (e.key === "Enter" && e.shiftKey) return defaultKeyBinding;
  else if (e.key === "Enter" && e.altKey) return defaultKeyBinding;
  else if (e.key === "Enter")
    return allowSendingEnterKey ? "send" : defaultKeyBinding;

  return defaultKeyBinding;
};

export default keyBindingFn;
