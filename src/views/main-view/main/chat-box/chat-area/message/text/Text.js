import { Box as MuiBox } from "@mui/material";
import Typography from "../../../../../../components/Typography";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import Button from "../../../../../../components/Button";
import { useCallback } from "react";
import DOMPurify from "dompurify";
import { htmlToText } from "html-to-text";
import { motion } from "framer-motion";
import useTextParams, { containsNonEmojiText, getSize } from "./useTextParams";

export default function Text({ content, bgcolor = "background.paper" }) {
  const text = htmlToText(content).trim();
  const [{ more, rootRef, step, MAX_HEIGHT }, { handleAddStep }] =
    useTextParams();

  const sanitizedData = useCallback(
    () => ({
      __html: DOMPurify.sanitize(content),
    }),
    [content]
  );

  return (
    <motion.div
      initial={false}
      animate={{ maxHeight: MAX_HEIGHT * step }}
      transition={{ duration: 0.5 }}>
      <Typography
        bgcolor={bgcolor}
        maxHeight={MAX_HEIGHT * step}
        display='flex'
        flexDirection='column'
        ref={rootRef}
        position='relative'
        textOverflow='ellipsis'
        sx={{
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          textOverflow: "ellipsis",
          fontSize: (theme) =>
            containsNonEmojiText(text)
              ? theme.typography.body2.fontSize
              : getSize(theme.typography.body2.fontSize, text.length),
          "&  p": { m: 0, p: 0 },
          "& > .txt-container": {
            p: 1,
          },
        }}>
        <div
          dangerouslySetInnerHTML={sanitizedData()}
          className='txt-container'
        />
        {more && (
          <MuiBox
            position='absolute'
            bottom={0}
            left={0}
            p={1}
            color={bgcolor}
            sx={{
              background:
                "linear-gradient(transparent, currentcolor, currentcolor)",
              width: "100%",
              "& > button": {
                color: "text.primary",
              },
            }}>
            <Button
              onClick={handleAddStep}
              startIcon={<ExpandMoreOutlinedIcon />}>
              Voir plus ...
            </Button>
          </MuiBox>
        )}
      </Typography>
    </motion.div>
  );
}
