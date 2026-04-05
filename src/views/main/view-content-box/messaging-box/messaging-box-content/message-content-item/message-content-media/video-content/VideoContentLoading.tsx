import useLocalStoreData from "../../../../../../../../hooks/useLocalStoreData";
import { useSelectorMessage } from "../../../../../../../../hooks/useMessagingContext";
import { IconButton, Box, LinearProgress } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

const VideoContentLoading = ({ keysPath, id }) => {
  const [getData] = useLocalStoreData(keysPath);
  const loading = useSelectorMessage(id, "request.loading");
  const uploadProgress = useSelectorMessage(id, "request.uploadProgress");
  const downloadProgress = useSelectorMessage(id, "request.downloadProgress");

  return (
    <>
      <div
        width='100%'
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          width: "100%",
        }}>
        <IconButton
          LinkComponent='div'
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const request = getData("request");
            if (loading) request?.abort();
            else request?.sendFile();
          }}>
          {loading ? (
            <CloseOutlinedIcon fontSize='large' />
          ) : (
            <FileUploadOutlinedIcon fontSize='large' />
          )}
        </IconButton>
      </div>
      {loading && (
        <Box
          position='absolute'
          bottom={0}
          left={0}
          right={0}
          width='100%'
          component='div'>
          <LinearProgress
            color='inherit'
            variant={uploadProgress ? "buffer" : "indeterminate"}
            sx={{ width: "100%" }}
            value={uploadProgress * 100}
            valueBuffer={downloadProgress * 100}
            min={0}
            max={100}
          />
        </Box>
      )}
    </>
  );
};

export default VideoContentLoading;
