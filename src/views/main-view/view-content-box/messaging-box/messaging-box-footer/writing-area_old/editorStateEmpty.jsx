import { ContentState, EditorState } from "draft-js";
//import decorator from "./decorator/decorator";

const contentState = ContentState.createFromText('');
const editorStateEmpty = (editorState) => EditorState.moveFocusToEnd(
    EditorState.push(editorState, contentState)
);
export default editorStateEmpty;