import { Modifier, RichUtils } from "draft-js";
import sendData from "../buttons/sendData";

export const handleKeyCommand = (command, editorState, onChange) => {
  const newState = RichUtils.handleKeyCommand(editorState, command);
  if (command === "send") {
    sendData();
    return "handled";
  } else if (newState) {
    onChange(newState);
    return "handled";
  }
  return "not-handled";
};

export const handleTab = (e, editorState) => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const block = contentState.getBlockForKey(selection.getStartKey());
  const blockType = block.getType();
  const blocks = ["unordered-list-item", "ordered-list-item"];

  if (blocks.includes(blockType)) {
    const depth = block.getDepth();
    if (depth < 4) {
      return RichUtils.onTab(e, editorState, 4);
    }
  }
  return editorState;
};

export const handleBackspace = (editorState) => {
  const selection = editorState.getSelection();
  if (!selection.isCollapsed()) return editorState;
  const contentState = editorState.getCurrentContent();
  const block = contentState.getBlockForKey(selection.getStartKey());
  const blockType = block.getType();
  const blockLength = block.getLength();
  const blocks = ["unordered-list-item", "ordered-list-item"];
  if (blocks.includes(blockType)) {
    if (blockLength === 0) {
      const depth = block.getDepth();
      if (depth > 0)
        return Modifier.setBlockType(
          contentState,
          selection,
          blockType,
          depth - 1
        );
      else return RichUtils.toggleBlockType(editorState, "unstyled");
    }
  }

  return editorState;
};
