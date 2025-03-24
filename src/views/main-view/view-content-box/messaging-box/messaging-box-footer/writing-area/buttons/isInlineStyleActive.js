const isInlineStyleActive = (editorState, style) => {
  const currentStyle = editorState.getCurrentInlineStyle();
  return currentStyle.has(style);
};

export default isInlineStyleActive;
