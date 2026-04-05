import { styled } from "@mui/material";
import firaCode from "../../../../../../assets/FiraCode-VariableFont_wght.ttf";

const EditorStyledWrapper = styled("div")(({ theme }) => ({
  overflow: "hidden",
  "@font-face": {
    fontFamily: "FiraCode",
    src: `url(${firaCode})`,
  },
  "& *::selection": {
    backgroundColor: theme.palette.action.selected,
  },
  "& > .DraftEditor-root": {
    "& > .DraftEditor-editorContainer": {
      // padding: theme.spacing(1, 0, 1, 0),
      "&  *": {
        padding: 0,
        marginTop: 0,
        marginBottom: 0,
        marginRight: 0,
      },
      "& .DraftEditorBlockquote": {
        borderLeft: "4px inset " + theme.palette.grey[300],
        paddingLeft: theme.spacing(1),
        margin: 0,
      },
      "& .DraftEditorUnorderedList, & .DraftEditorOrderedList": {
        paddingLeft: theme.spacing(0.5),
        "&::before": {
          marginLeft: theme.spacing(0.8),
          padding: 0,
        },
      },
      "& > .public-DraftEditor-content": {
        ...theme.typography.body2,
        minHeight: 40,
        color: theme.palette.text.primary,
        padding: theme.spacing(1),
        overflow: "auto",
        [theme.breakpoints.down("md")]: {
          maxHeight: 300,
        },
        [theme.breakpoints.only("md")]: {
          maxHeight: 350,
        },
        [theme.breakpoints.up("md")]: {
          maxHeight: 500,
        },
      },
    },
    "& .public-DraftEditorPlaceholder-root": {
      pointerEvents: "none",
      "& .public-DraftEditorPlaceholder-inner": {
        ...theme.typography.body2,
        color: theme.palette.text.disabled,
        padding: theme.spacing(1),
        display: "-webkit-box",
        maxWidth: "100%",
        WebkitLineClamp: 1,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        height: 30,
      },
    },
  },
}));
export default EditorStyledWrapper;
