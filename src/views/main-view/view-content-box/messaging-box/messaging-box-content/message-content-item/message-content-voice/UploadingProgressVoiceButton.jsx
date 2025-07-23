import React from "react";
import { Box, CircularProgress, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import PropTypes from "prop-types";
import { useLayoutEffect } from "react";

const UploadingProgressVoiceButton = ({ request, setRequest }) => {
  const [progressing, setProgressing] = React.useState(request?.loading);

  useLayoutEffect(() => {
    if (request)
      request.onLoaded = (success) => {
        console.log("request.onLoaded => ", success);
        if (success) setRequest(null);
        else setProgressing(false);
      };
    return () => {
      if (request) request.onLoaded = null;
    };
  }, [request, setRequest]);

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      {progressing && (
        <CircularProgress
          variant='indeterminate'
          color='inherit'
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
        />
      )}
      <Box>
        <IconButton
          sx={{ ...(progressing && { borderRadius: "50%" }) }}
          onClick={() =>
            setProgressing((progressing) => {
              if (progressing) request?.cancel();
              else request?.sendVoice();
              return !progressing;
            })
          }>
          {progressing ? <CloseOutlinedIcon /> : <FileUploadOutlinedIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

UploadingProgressVoiceButton.displayName = "UploadingProgressVoiceButton";

UploadingProgressVoiceButton.propTypes = {
  request: PropTypes.object,
  setRequest: PropTypes.func,
};
export default UploadingProgressVoiceButton;
