import React from "react";
import { Box, CircularProgress, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import PropTypes from "prop-types";

const SendLoadingButton = ({ id, setSending }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <IconButton
          variant='caption'
          component='div'
          sx={{ color: "text.secondary", borderRadius: "50%" }}>
          <CloseOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
SendLoadingButton.propTypes = {
  id: PropTypes.string,
  setSending: PropTypes.func,
};

export default React.memo(SendLoadingButton);
