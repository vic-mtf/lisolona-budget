import { EditorState, Modifier } from "draft-js";
import { getCharacterFromCodeString } from "../../emoji-picker/EmojiPicker";

export default function addEmoji(editorState, emojiData) {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
        'EMOJI',
        'SEGMENTED', //segmented
        emojiData
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const currentSelectionState = editorState.getSelection();
    const char = getCharacterFromCodeString(emojiData.metadata.glyph);
    const newContentState = Modifier.replaceText(
      contentState,
      currentSelectionState,
      char,
      null,
      entityKey
    );
    let newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
    return newEditorState;
  }
  