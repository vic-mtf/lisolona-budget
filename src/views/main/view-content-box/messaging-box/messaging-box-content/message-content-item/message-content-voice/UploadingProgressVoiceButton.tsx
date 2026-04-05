import { Box, CircularProgress, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import useLocalStoreData from "../../../../../../../hooks/useLocalStoreData";
import { useSelectorMessage } from "../../../../../../../hooks/useMessagingContext";

const UploadingProgressVoiceButton = ({ id, dataKey }) => {
  const loading = useSelectorMessage(id, "request.loading");
  const [getData] = useLocalStoreData(dataKey);

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      {loading && (
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
          sx={{ ...(loading && { borderRadius: "50%" }) }}
          onClick={() => {
            const request = getData("request");
            if (loading) request?.abort();
            else request?.sendFile();
          }}>
          {loading ? <CloseOutlinedIcon /> : <FileUploadOutlinedIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

UploadingProgressVoiceButton.displayName = "UploadingProgressVoiceButton";
export default UploadingProgressVoiceButton;
