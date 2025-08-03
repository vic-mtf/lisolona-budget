import buttons from "./buttons";
import isInlineStyleActive from "./isInlineStyleActive";

const getInlineStylesActive = (editorState) => {
  const currentInlineStyles = [];
  buttons.forEach(({ id }) => {
    const style = id.toUpperCase();
    if (isInlineStyleActive(editorState, style)) currentInlineStyles.push(id);
  });
  return currentInlineStyles;
};
export default getInlineStylesActive;
