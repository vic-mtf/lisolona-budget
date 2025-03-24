import { createTheme } from "@mui/material";

export const blockStyleFn = (contentBlock) => {
  const type = contentBlock.getType();
  if (type === "blockquote") return "DraftEditorBlockquote";
  if (type === "code-block") return "DraftEditorCodeBlock";
  if (type === "unordered-list-item") return "DraftEditorUnorderedList";
  if (type === "ordered-list-item") return "DraftEditorOrderedList";
};

const styleMap = (theme = createTheme()) => {
  return {
    // BOLD: {},
    // ITALIC: {},
    CODE: {
      color: theme.palette.warning.main,
      borderRadius: theme.shape.borderRadius,
      border: `.5px inset ${theme.palette.divider}`,
      fontFamily: "firaCode",
    },
  };
};

export default styleMap;
