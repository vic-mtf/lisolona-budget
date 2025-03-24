import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";

import draftToHtml from "draftjs-to-html";
import draftToMarkdown from "draftjs-to-markdown";
import { markdownToDraft } from "markdown-draft-js";
import { EVENT_CHANGE_DATA } from "./buttons";

export const _SEND_DATA_EVENT = "__DRAFT_EDITOR_SEND_DATA";
export const _REPLY_DATA_EVENT = "__DRAFT_EDITOR_REPLY_DATA";

const customEntityTransform = (entity, text) => {
  if (entity.type === "LINK") {
    const { url } = entity.data;
    return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
  }
  return text;
};

export function convertEditorState(editorState, format) {
  const rawContentState = convertToRaw(editorState.getCurrentContent());

  switch (format) {
    case "html":
      return draftToHtml(rawContentState, null, null, customEntityTransform);
    case "markdown":
      return draftToMarkdown(rawContentState);
    case "json":
      return JSON.stringify(rawContentState);
    default:
      rawContentState;
  }
}

export function convertToEditorState(data, format) {
  let contentState;
  if (format === "html") {
    const blocksFromHTML = convertFromHTML(data);
    contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
  } else if (format === "markdown") {
    const rawData = markdownToDraft(data);
    contentState = convertFromRaw(rawData);
  } else if (format === "json") {
    const rawContentState = JSON.parse(data);
    contentState = convertFromRaw(rawContentState);
  } else throw new Error(`Unsupported format: ${format}`);

  return EditorState.createWithContent(contentState);
}

export function isEditorStateEmpty(editorState) {
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap();
  return blockMap.every((block) => block.getText().trim() === "");
}

export const listenSendData = (editorState, onChange, action, format, data) => {
  let editorContent;
  if (!isEditorStateEmpty(editorState)) {
    editorContent = convertEditorState(editorState, format);
    onChange(EditorState.moveFocusToEnd(EditorState.createEmpty()));
  }
  if ((editorContent || data) && typeof action === "function")
    action({ editorContent, data });
};

const sendData = () => {
  const name = _SEND_DATA_EVENT;
  const customEvent = new CustomEvent(_SEND_DATA_EVENT, {
    detail: { name },
  });
  EVENT_CHANGE_DATA.dispatchEvent(customEvent);
};

export default sendData;
