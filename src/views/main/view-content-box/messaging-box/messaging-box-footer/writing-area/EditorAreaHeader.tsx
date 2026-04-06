import { alpha, Box, Divider, Stack } from "@mui/material";
import { EditorState } from "draft-js";
import { useMemo } from "react";
import ToggleStyleButtons from "./ToggleStyleButtons";
import AddLinkButton from "./buttons/AddLinkButton";
import ToggleButtonGroup from "@/components/ToggleButtonGroup";
import getLinkInSelection from "./buttons/getLinkInSelection";
import getInlineStylesActive from "./buttons/getInlineStylesActive";
import getCurrentBlockType from "./buttons/getCurrentBlockType";
import { getButtons } from "./buttons/buttons";
import ToggleTitleSizeButton from "./buttons/ToggleTitleSizeButton";

export default function EditorAreaHeader({
  editorState,
  setEditorState,
  hasFocus,
  onOpenAddLink,
}) {
  const isLink = useMemo(() => {
    const data = getLinkInSelection(editorState);
    return Boolean(data?.text || data?.link);
  }, [editorState]);
  const values = useMemo(
    () =>
      getInlineStylesActive(editorState).concat(
        getCurrentBlockType(editorState)
      ),
    [editorState]
  );
  const stylesTypes = useMemo(
    () => ["text-format", "list-format", "code-format", "quote-format"],
    []
  );

  return (
    <Box
      overflow='auto'
      width='100%'
      onMouseDown={(event) => event.preventDefault()}
      sx={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        bgcolor: (theme) =>
          alpha(
            theme.palette.common[
              theme.palette.mode === "light" ? "black" : "white"
            ],
            hasFocus ? theme.palette.action.hoverOpacity : 0.05
          ),
      }}>
      <Stack
        divider={
          <Divider flexItem orientation='vertical' sx={{ mx: 0.5, my: 1 }} />
        }
        direction='row'>
        {stylesTypes.map((type) => (
          <ToggleStyleButtons
            key={type}
            values={values}
            setEditorState={setEditorState}
            editorState={editorState}
            buttons={getButtons(type)}
            disabled={!hasFocus}
          />
        ))}
        <ToggleButtonGroup
          size='small'
          disabled={!hasFocus}
          value={isLink ? "link" : ""}>
          <AddLinkButton isLink={isLink} onOpenAddLink={onOpenAddLink} />
        </ToggleButtonGroup>
        <ToggleButtonGroup size='small' disabled={!hasFocus} values={[]}>
          <ToggleTitleSizeButton
            editorState={editorState}
            setEditorState={setEditorState}
          />
        </ToggleButtonGroup>
      </Stack>
    </Box>
  );
}
