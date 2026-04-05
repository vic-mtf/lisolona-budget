import { Box, CircularProgress, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import useLocalStoreData from "../../../../../../../hooks/useLocalStoreData";
import useMessagingContext, {
  useSelectorMessage,
} from "../../../../../../../hooks/useMessagingContext";
import { axios } from "../../../../../../../hooks/useAxios";
import { useDispatch } from "react-redux";
import { updateMessage } from "../../../../../../../redux/data/data";
import { useCallback } from "react";

const DownloadButton = ({ id, dataKey, downloaded, setSrc }) => {
  const url = useSelectorMessage(id, "content");
  const downloadProgress = useSelectorMessage(id, "request.downloadProgress");
  const [{ user }] = useMessagingContext();
  const loading = useSelectorMessage(id, "request.loading");
  const [getData, setData] = useLocalStoreData(dataKey);
  const dispatch = useDispatch();

  const downloadFile = useCallback(async () => {
    let error;
    const controller = new AbortController();
    const updateData = (data) =>
      dispatch(updateMessage({ data, id, targetId: user.id }));
    updateData({ request: { loading: true } });

    setData({
      request: {
        downloadFile,
        abort: () => {
          controller.abort();
          updateData({ request: { loading: false } });
        },
      },
    });
    try {
      const response = await axios({
        url,
        responseType: "blob",
        signal: controller.signal,
        onUploadProgress: ({ total, loaded }) => {
          const uploadProgress = loaded / total;
          updateData({ request: { uploadProgress, loading: true } });
        },
        onDownloadProgress({ total, loaded }) {
          const downloadProgress = loaded / total;
          updateData({ request: { downloadProgress, loading: true } });
        },
      });
      const file = response.data;
      const src = window.URL.createObjectURL(file);
      setData({ file, src });
      setSrc(src);
    } catch (err) {
      console.error(err);
      error = err?.toString();
    }
    updateData({
      request: { loading: false, error },
    });
  }, [url, dispatch, id, user?.id, setData, setSrc]);

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      {loading && (
        <CircularProgress
          variant={downloaded ? "determinate" : "indeterminate"}
          value={downloadProgress * 100}
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
            const getFile = request?.downloadFile || downloadFile;

            if (loading) request?.abort();
            else downloaded ? getFile() : request?.sendFile();
          }}>
          {loading ? <CloseOutlinedIcon /> : <FileUploadOutlinedIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

DownloadButton.displayName = "DownloadButton";
export default DownloadButton;
