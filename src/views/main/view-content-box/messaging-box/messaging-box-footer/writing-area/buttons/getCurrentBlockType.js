const getCurrentBlockType = (editorState) => {
  const selection = editorState.getSelection();
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(selection.getStartKey());
  return block.getType();
};

export default getCurrentBlockType;
