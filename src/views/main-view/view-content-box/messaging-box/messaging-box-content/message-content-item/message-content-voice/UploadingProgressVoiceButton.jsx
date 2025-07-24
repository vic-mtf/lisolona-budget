import React from "react";
import { Box, CircularProgress, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import PropTypes from "prop-types";
import { useLayoutEffect } from "react";
import useLocalStoreData from "../../../../../../../hooks/useLocalStoreData";

const UploadingProgressVoiceButton = ({ voice, setUploading, dataKey }) => {
  const [getData, setData] = useLocalStoreData();
  const [progressing, setProgressing] = React.useState(voice?.request?.loading);

  useLayoutEffect(() => {
    const request = getData(dataKey)?.request || voice?.request;
    if (request)
      request.onLoaded = (success) => {
        if (success) {
          voice.request = null;
          setUploading(false);
        } else {
          setProgressing(false);
          voice.request.loading = false;
        }
        console.log("success =>", success);
      };
    return () => {
      if (request) request.onLoaded = null;
    };
  });

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
          onClick={() => {
            setProgressing((progressing) => {
              const request = voice?.request;
              if (progressing) request?.cancel();
              else request?.sendVoice();
              request.loading = !progressing;
              return request.loading;
            });
          }}>
          {progressing ? <CloseOutlinedIcon /> : <FileUploadOutlinedIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

UploadingProgressVoiceButton.displayName = "UploadingProgressVoiceButton";

UploadingProgressVoiceButton.propTypes = {
  setUploading: PropTypes.func,
  voice: PropTypes.object,
  dataKey: PropTypes.string,
};
export default UploadingProgressVoiceButton;
