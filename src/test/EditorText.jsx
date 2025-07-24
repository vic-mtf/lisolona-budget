// src/MonEditeur.js
import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./ToolbarPlugin";

const editorConfig = {
  theme: {
    paragraph: "paragraph",
    text: {
      bold: "bold",
      italic: "italic",
      underline: "underline",
    },
  },
  onError(error) {
    console.error("Erreur Lexical :", error);
  },
  nodes: [],
};

export default function MonEditeur() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          maxWidth: "700px",
          margin: "40px auto",
          fontFamily: "Arial, sans-serif",
        }}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              style={{
                minHeight: "200px",
                border: "1px solid #aaa",
                padding: "12px",
                fontSize: "16px",
                lineHeight: "1.6",
              }}
            />
          }
          placeholder={
            <div style={{ color: "#aaa", padding: "12px" }}>
              Écris quelque chose…
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </div>
    </LexicalComposer>
  );
}
