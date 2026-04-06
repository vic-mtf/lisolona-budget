import React, { useState, useLayoutEffect } from "react";
import { Box, Typography, Avatar, Tooltip } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import humanReadableSize from "@/utils/humanReadableSize";
import * as PdfLib from "pdfjs-dist";
import * as workerSrc from "pdfjs-dist/build/pdf.worker.min.js";
import iconDoc from "./iconDoc";

//import.meta.env.BASE_URL + "/pdf.worker.min.js";

const DocThumbnail = React.memo(
  React.forwardRef(({ url, name, ext, size }, ref) => {
    const [numPages, setNumPages] = useState(0);

    useLayoutEffect(() => {
      PdfLib.GlobalWorkerOptions.workerSrc = workerSrc;
      if (ext?.toLowerCase() === "pdf")
        PdfLib.getDocument(url).promise.then(async (pdfDoc) => {
          setNumPages(pdfDoc._pdfInfo?.numPages);
        });
    }, [url, ext]);

    return (
      <Box
        display='flex'
        width={250}
        flexDirection='row'
        ref={ref}
        gap={1}
        height={60}
        p={1}>
        <Box height='100%' sx={{ aspectRatio: 1 }}>
          <div style={{ height: "100%", aspectRatio: 1 }}>
            <Avatar
              sx={{ width: "100%", height: "100%" }}
              src={iconDoc[ext?.toLowerCase()]}>
              <DescriptionOutlinedIcon />
            </Avatar>
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
  })
);
const bull = (
  <span
    style={{
      display: "inline-block",
      margin: "0 4px",
      transform: "scale(1.5)",
    }}>
    •
  </span>
);DocThumbnail.displayName = "DocThumbnail";
export default DocThumbnail;
