// src/ToolbarPlugin.js
import React from "react";
import { FORMAT_TEXT_COMMAND, INSERT_PARAGRAPH_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const buttonStyle = {
    marginRight: "8px",
    padding: "6px 10px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "4px",
    border: "1px solid #ddd",
    background: "#f9f9f9",
  };

  return (
    <div
      style={{ marginBottom: "8px" }}
      onMouseDown={(e) => e.preventDefault()}>
      <button
        style={buttonStyle}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
        <b>Gras</b>
      </button>
      <button
        style={buttonStyle}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
        <i>Italique</i>
      </button>
      <button
        style={buttonStyle}
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
        }>
        <u>Souligné</u>
      </button>
      <button
        style={buttonStyle}
        onClick={() =>
          editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined)
        }>
        ¶ Nouveau paragraphe
      </button>
    </div>
  );
}
