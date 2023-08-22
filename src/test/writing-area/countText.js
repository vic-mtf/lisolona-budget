export function countText(editorState) {
    const contentState = editorState.getCurrentContent();
    const text = contentState.getPlainText();
    const charCount = text.length;
    const wordCount = text.split(/\s+/).length;
    const lineCount = text.split(/\n/).length;
    return {charCount, wordCount, lineCount};
}

export function countTextInCurrentLine(editorState) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const blockKey = selectionState.getAnchorKey();
  const block = contentState.getBlockForKey(blockKey);
  const text = block.getText();
  const charCount = text.length;
  const wordCount = text.split(/\s+/).length;
  return {
    charCount,
    wordCount,
  };
}
