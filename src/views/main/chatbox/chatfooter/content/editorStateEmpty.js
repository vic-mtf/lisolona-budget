import { ContentState, EditorState } from "draft-js";
import decorator from "./decorator/decorator";

const contentState = ContentState.createFromText('');
const editorStateEmpty = EditorState.createWithContent(contentState, decorator);
export default editorStateEmpty;