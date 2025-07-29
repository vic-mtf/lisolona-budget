import React, { useState, useLayoutEffect, useMemo } from "react";
import { Box, Typography, Avatar, Tooltip } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import humanReadableSize from "../../../../../../../utils/humanReadableSize";
import PropTypes from "prop-types";
import * as PdfLib from "pdfjs-dist";
import * as workerSrc from "pdfjs-dist/build/pdf.worker.min.js";
import iconDoc from "../../../../../../main-view/view-content-box/messaging-box/messaging-box-footer/files-thumbnail-view/doc-thumbnail/iconDoc";
import { useSelectorMessage } from "../../../../../../../hooks/useMessagingContext";
import useLocalStoreData, {
  useSmartKey,
} from "../../../../../../../hooks/useLocalStoreData";
import UploadingProgressVoiceButton from "../message-content-voice/UploadingProgressVoiceButton";
import { getExtension } from "../../../../../../../utils/getFile";
import { axios } from "../../../../../../../hooks/useAxios";

//import.meta.env.BASE_URL + "/pdf.worker.min.js";

const MessageContentDoc = React.forwardRef(({ content, id }, ref) => {
  const { key } = useSmartKey({
    baseKey: `app.key.docs.${id}`,
    paths: { key: ["downloads", "uploads"] },
  });

  const [getData, setData] = useLocalStoreData(key);
  const [src] = useState(() => getData("src"), [getData]);
  const status = useSelectorMessage(id, "status");
  const [numPages, setNumPages] = useState(0);
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

  useLayoutEffect(() => {
    PdfLib.GlobalWorkerOptions.workerSrc = workerSrc;
    if (ext?.toLowerCase() === "pdf" && src)
      PdfLib.getDocument(src).promise.then(async (pdfDoc) => {
        setNumPages(pdfDoc._pdfInfo?.numPages);
      });

    if (!size && url) {
      axios.head(url).then((res) => {
        const size = res.headers.get("content-length");
        setSize(size);
        setData({ size });
      });
    }
  }, [ext, src, size, url, setData]);

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
          <Avatar
            className='DocThumbnail'
            sx={{
              width: "100%",
              height: "100%",
              opacity: status === "sending" ? 0.2 : 1,
              transition: (t) =>
                t.transitions.create("opacity", {
                  duration: t.transitions.duration.standard,
                  easing: t.transitions.easing.easeInOut,
                }),
            }}
            src={iconDoc[ext?.toLowerCase()]}>
            <DescriptionOutlinedIcon />
          </Avatar>
          {!isLoaded && (
            <Box
              className='UploadingProgressWrapper'
              sx={{
                position: "absolute",
                opacity: status === "sending" ? 1 : 0,
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}>
              <UploadingProgressVoiceButton id={id} dataKey={key} />
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
        </Typography>
      </Box>
    </Box>
  );
});

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

MessageContentDoc.propTypes = {
  content: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

MessageContentDoc.displayName = "MessageContentDoc";
export default React.memo(MessageContentDoc);
