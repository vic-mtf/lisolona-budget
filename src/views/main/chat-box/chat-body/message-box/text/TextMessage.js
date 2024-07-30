import { Box as MuiBox, createTheme } from "@mui/material";
import Typography from "../../../../../../components/Typography";
import Button from "../../../../../../components/Button";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";

const MAX_HEIGHT = 500;

export default function TextMessage({
  content,
  bgcolor = "background.paper",
  borderRadius,
  isMine,
}) {
  const theme = createTheme({ palette: { mode: "light" } });
  const [moreStep, setMoreStep] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const rootRef = useRef();
  const handleShowMore = useCallback(() => setMoreStep((step) => step + 1), []);
  const sanitizedData = useCallback(
    () => ({
      __html: DOMPurify.sanitize(content),
    }),
    [content]
  );

  useLayoutEffect(() => {
    const root = rootRef?.current;
    if (root) {
      const rootHeight = parseFloat(window.getComputedStyle(root).height);
      const show = rootHeight >= MAX_HEIGHT * moreStep;
      if (show && !showMore) setShowMore(show);
      if (!show && showMore) setShowMore(show);
    }
  }, [showMore, moreStep]);

  return (
    <MuiBox display='flex' width='100%'>
      <MuiBox display='flex' width='100%'>
        <Typography
          bgcolor={bgcolor}
          width='100%'
          borderRadius={borderRadius}
          display='flex'
          flexDirection='column'
          color={isMine ? theme.palette.text.primary : "inherit"}
          maxHeight={MAX_HEIGHT * moreStep}
          ref={rootRef}
          position='relative'
          textOverflow='ellipsis'>
          <MuiBox
            component='div'
            mx={2}
            sx={{
              overflowWrap: "break-word",
              wordWrap: "break-word",
              wordBreak: "break-word",
              overflow: "hidden",
              ...(showMore && {
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: "30px",
                  width: "100%",
                  height: 30,
                  background: (theme) =>
                    `linear-gradient(transparent, 10%, ${bgcolor})`,
                  boxSizing: "inherit",
                },
              }),
              "& blockquote": {
                marginLeft: "24px",
                borderLeft: "4px solid #CCC",
                paddingLeft: "6px",
              },
            }}
            dangerouslySetInnerHTML={sanitizedData()}
          />
          <MuiBox mx={2.5}>
            {showMore && (
              <Button
                onClick={handleShowMore}
                sx={{
                  position: "relative",
                  top: "-2.5px",
                }}>
                Voir plus...
              </Button>
            )}
          </MuiBox>
        </Typography>
      </MuiBox>
    </MuiBox>
  );
}
