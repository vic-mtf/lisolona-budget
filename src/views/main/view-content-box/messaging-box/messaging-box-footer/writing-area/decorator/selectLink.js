import { EditorState } from "draft-js";

export const _SELECT_LINK_EVENT = "__DRAFT_EDITOR_SELECT_LINK";

const selectLink = (data = {}, editorState, setEditorState) => {
  const { blockKey, start, end } = data;
  const selectionState = editorState.getSelection();
  const isLinkSelected =
    selectionState.getAnchorKey() === blockKey &&
    selectionState.getAnchorOffset() === start &&
    selectionState.getFocusOffset() === end;

  let newSelectionState;

  if (!isLinkSelected) {
    newSelectionState = selectionState.merge({
      anchorOffset: start,
      focusOffset: end,
    });
    const newEditorState = EditorState.forceSelection(
      editorState,
      newSelectionState
    );
    setEditorState(newEditorState);
  }
};

export default selectLink;
