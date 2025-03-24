import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import firaCode from "../../../../../../../assets/FiraCode-VariableFont_wght.ttf";

export default function MessageContentText({ content }) {
  const __html = useMemo(
    () => DOMPurify.sanitize(content, { USE_PROFILES: { html: true } }),
    [content]
  );
  return (
    <Box>
      <Typography
        component='div'
        dangerouslySetInnerHTML={{ __html }}
        color='text.secondary'
        sx={{
          pr: { lg: 6 },
          "@font-face": { fontFamily: "FiraCode", src: `url(${firaCode})` },
          userSelect: "text !important",
          "&:hover": { userSelect: "auto" },
          "&  *": {
            padding: 0,
            marginTop: 0,
            marginBottom: 0,
            marginRight: 0,
          },
          "& img": { display: "none" },
          "& a": {
            color: (theme) => theme.palette.primary.main,
            textDecoration: "none",
          },
          "& code": {
            color: (theme) => theme.palette.warning.main,
            borderRadius: (theme) => theme.shape.borderRadius + "px",
            border: (theme) => `.5px inset ${theme.palette.divider}`,
            fontFamily: "firaCode",
          },
          "& *::selection": {
            backgroundColor: (theme) => theme.palette.action.selected,
          },
          "& ul, & ol": {
            my: 0,
            pl: 2.5,
            "&::before": { ml: 0.8, padding: 0 },
          },
        }}
      />
    </Box>
  );
}

MessageContentText.propTypes = {
  content: PropTypes.string,
};
