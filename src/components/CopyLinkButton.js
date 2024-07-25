// import ChatHeader from "../../../../main/chat-box/chat-header/ChatHeader";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import Button from "./Button";

export default function CopyLinkButton({ text, title, url, render }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef();
  const textareaRef = useRef();

  const value = useMemo(
    () => `${title}\n${text}\n${url}`.trim(),
    [title, text, url]
  );

  const handleCopyLink = useCallback(
    async (e) => {
      if (!copied) {
        try {
          if (navigator?.clipboard?.writeText)
            await navigator?.clipboard?.writeText(value);
          else {
            textareaRef.current.select();
            document.execCommand("copy");
            e?.target.focus();
          }
          setCopied(true);
          timerRef.current = setTimeout(() => {
            setCopied(false);
          }, 2000);
        } catch (e) {
          console.error("Error", e);
        }
      }
    },
    [copied, value]
  );

  useEffect(() => {
    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      {typeof render === "function" ? (
        render({ copied, text, url, title, handleCopyLink })
      ) : (
        <Button
          startIcon={copied ? <CheckOutlinedIcon /> : <ContentCopyIcon />}
          onClick={handleCopyLink}
          fullWidth>
          {copied ? "Copié !" : "Copier"}
        </Button>
      )}

      <textarea hidden ref={textareaRef} value={value} />
    </>
  );
}
