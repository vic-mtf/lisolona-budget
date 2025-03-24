import { RichUtils } from "draft-js";
import isInlineStyleActive from "./isInlineStyleActive";

const getStateToggleInlineStyle = (editorState, value, button) => {
  let newEditorState;
  const { replaces } = button;
  const styles = replaces?.map((id) => id?.toUpperCase());
  styles?.forEach((style) => {
    if (isInlineStyleActive(editorState, style))
      newEditorState = RichUtils.toggleInlineStyle(editorState, style);
  });
  newEditorState = RichUtils.toggleInlineStyle(
    editorState,
    value?.toUpperCase()
  );
  return newEditorState;
};

export default getStateToggleInlineStyle;
