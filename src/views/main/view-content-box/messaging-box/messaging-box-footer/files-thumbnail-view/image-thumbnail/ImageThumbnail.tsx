import React, { useState, useEffect } from "react";
import { Box, CardActionArea, ImageListItemBar } from "@mui/material";
import resizeImage from "@/utils/resizeImage";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";

const ImageThumbnail = React.memo(
  React.forwardRef(({ url, name }, ref) => {
    const [src, setSrc] = useState(null);

    useEffect(() => {
      if (url)
        resizeImage({ url, imageSmoothingQuality: "low", maxWidth: 100 }).then(
          ({ normal }) => setSrc(normal)
        );
    }, [url]);

    return (
      <CardActionArea
        onClick={() => {}}
        sx={{
          overflow: "hidden",
          border: (t) => `1px solid ${t.palette.divider}`,
        }}>
        <Box
          ref={ref}
          height={60}
          sx={{
            aspectRatio: 1,
            opacity: src ? 1 : 0,
            transition: "opacity .2s ease-in-out",
            "& img": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
            },
          }}>
          <img alt={name} loading='lazy' src={src} srcSet={src} hidden={!src} />
          <ImageListItemBar
            sx={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7) 0%, " +
                "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
            }}
            position='bottom'
            actionIcon={
              <span style={{ padding: "4px " }}>
                <InsertPhotoOutlinedIcon
                  fontSize='small'
                  sx={{ fontSize: "14px", color: "white" }}
                />
              </span>
            }
            actionPosition='left'
          />
        </Box>
      </CardActionArea>
    );
  })
);

ImageThumbnail.displayName = "ImageThumbnail";
export default ImageThumbnail;
