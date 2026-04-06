import React, { useState, useLayoutEffect, useMemo } from "react";
import { Box, Typography, Avatar, Tooltip, IconButton } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import humanReadableSize from "@/utils/humanReadableSize";
import * as PdfLib from "pdfjs-dist";
import * as workerSrc from "pdfjs-dist/build/pdf.worker.min.js";
import iconDoc from "@/views/main/view-content-box/messaging-box/messaging-box-footer/files-thumbnail-view/doc-thumbnail/iconDoc";
import { useSelectorMessage } from "@/hooks/useMessagingContext";
import useLocalStoreData, {
  useSmartKey,
} from "@/hooks/useLocalStoreData";
import { getExtension } from "@/utils/getFile";
import { axios } from "@/hooks/useAxios";
import DownloadButton from "./DownloadButton";
import { useEffect } from "react";

PdfLib.GlobalWorkerOptions.workerSrc = workerSrc;

const MessageContentDoc = React.forwardRef(({ content, id }, ref) => {
  const { key } = useSmartKey({
    baseKey: `app.key.docs.${id}`,
    paths: { key: ["downloads", "uploads"] },
  });
  const loading = useSelectorMessage(id, "request.loading");
  const [getData, setData] = useLocalStoreData(key);
  const [src, setSrc] = useState(() => getData("src"), [getData]);
  const status = useSelectorMessage(id, "status");
  const [numPages, setNumPages] = useState(getData("numPages") || 0);
  const [size, setSize] = useState(
    () => getData("file.size") || getData("size"),
    [getData]
  );
  const url = useMemo(
    () =>
      content ? new URL(content, import.meta.env.VITE_SERVER_BASE_URL) : null,
    [content]
  );

  const { name, ext } = useMemo(() => {
    const doc = getData();
    const [name] = content?.split("/")?.reverse() || [doc?.file?.name];
    const ext = getExtension(name);

    return { name, ext };
  }, [getData, content]);

  const isLoaded = Boolean(src && status !== "sending");
  const loadingFile = status === "sending" || loading;

  useEffect(() => {
    if (ext?.toLowerCase() === "pdf" && !getData("numPages") && src)
      PdfLib.getDocument(src).promise.then(async (pdfDoc) => {
        const numPages = pdfDoc._pdfInfo?.numPages;
        setNumPages(numPages);
        setData({ numPages });
      });

    if (!size && url) {
      axios.head(url).then((res) => {
        const size = res.headers.get("content-length");
        setSize(size);
        setData({ size });
      });
    }
  }, [ext, src, size, url, setData, getData]);

  return (
    <Box
      display='flex'
      maxWidth={400}
      flexDirection='row'
      ref={ref}
      gap={1}
      height={60}
      p={1}
      sx={{
        "&:hover": {
          "& .DocThumbnail": {
            opacity: isLoaded ? 1 : 0.2,
          },
          "& .UploadingProgressWrapper": {
            opacity: 1,
          },
        },
      }}>
      <Box height='100%' sx={{ aspectRatio: 1 }}>
        <div style={{ height: "100%", aspectRatio: 1, position: "relative" }}>
          <IconButton
            disabled={loadingFile}
            sx={{ p: 0 }}
            onClick={() => {
              if (src) window.open(src, "_blank");
            }}>
            <Avatar
              className='DocThumbnail'
              sx={{
                opacity: loadingFile ? 0.2 : 1,
                transition: (t) =>
                  t.transitions.create("opacity", {
                    duration: t.transitions.duration.standard,
                    easing: t.transitions.easing.easeInOut,
                  }),
              }}
              src={iconDoc[ext?.toLowerCase()]}>
              <DescriptionOutlinedIcon />
            </Avatar>
          </IconButton>
          {!isLoaded && (
            <Box
              className='UploadingProgressWrapper'
              sx={{
                position: "absolute",
                opacity: loadingFile ? 1 : 0,
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}>
              <DownloadButton
                id={id}
                dataKey={key}
                setSrc={setSrc}
                downloaded={!src}
              />
            </Box>
          )}
        </div>
      </Box>
      <Box overflow='hidden' flexGrow={1}>
        <Tooltip
          title={name}
          open={name?.length > 20 ? undefined : false}
          enterDelay={1000}
          placement='top'>
          <Typography
            noWrap
            textOverflow='ellipsis'
            overflow='hidden'
            fontWeight={550}
            variant='body1'>
            {name}
          </Typography>
        </Tooltip>
        <Typography variant='caption' color='textSecondary'>
          <span style={{ textTransform: "uppercase" }}>{ext}</span>
          {numPages > 0 && (
            <>
              {bull}
              {numPages} page{numPages > 1 && "s"}
            </>
          )}
          {bull}
          {humanReadableSize(size)}
          {loading && status !== "sending" && <Progress id={id} />}
        </Typography>
      </Box>
    </Box>
  );
});

const Progress = ({ id }) => {
  const downloadProgress = useSelectorMessage(id, "request.downloadProgress");
  return (
    <>
      {bull}
      {parseInt((downloadProgress || 0) * 100)}%
    </>
  );
};

const bull = (
  <span
    style={{
      display: "inline-block",
      margin: "0 4px",
      transform: "scale(1.5)",
    }}>
    •
  </span>
);

MessageContentDoc.displayName = "MessageContentDoc";
export default React.memo(MessageContentDoc);
