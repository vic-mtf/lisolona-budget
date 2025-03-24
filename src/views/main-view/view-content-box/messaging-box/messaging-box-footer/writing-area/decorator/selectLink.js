import { EditorState } from "draft-js";

export const _SELECT_LINK_EVENT = "__DRAFT_EDITOR_SELECT_LINK";

const selectLink = (data = {}, editorState, setEditorState) => {
  const { blockKey, start, end } = data;

  // Supposons que vous avez déjà l'état de l'éditeur et le contentState
  // const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  // Vérifier si le lien est déjà sélectionné
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
