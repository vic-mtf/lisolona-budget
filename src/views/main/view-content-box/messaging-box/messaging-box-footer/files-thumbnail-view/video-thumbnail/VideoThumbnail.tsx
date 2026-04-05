import React, { useState } from "react";
import {
  Box,
  CardActionArea,
  ImageListItemBar,
  Typography,
  Divider,
} from "@mui/material";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import formatTime from "../../../../../../../utils/formatTime";

const VideoThumbnail = React.memo(
  React.forwardRef(({ url, name }, ref) => {
    const [duration, setDuration] = useState(0);

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
            opacity: duration ? 1 : 0,
            transition: "opacity .2s ease-in-out",
            "& img": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
            },
          }}>
          <video
            alt={name}
            loading='lazy'
            src={url}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <ImageListItemBar
            sx={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7) 0%, " +
                "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
            }}
            position='bottom'
            actionIcon={
              <Box
                style={{ padding: "4px " }}
                display='flex'
                flexDirection='row'
                justifyContent='center'
                alignItems='center'>
                <PlayArrowOutlinedIcon
                  fontSize='small'
                  sx={{ fontSize: 16, color: "white" }}
                />
                <Divider
                  variant='middle'
                  flexItem
                  orientation='vertical'
                  sx={{
                    borderWidth: 1,
                    mx: 0.5,
                    borderColor: "white",
                    height: 8,
                  }}
                />
                <Typography
                  variant='body2'
                  sx={{ color: "white", fontSize: 10 }}>
                  {formatTime({ currentTime: Math.floor(duration) })}
                </Typography>
              </Box>
            }
            actionPosition='left'
          />
        </Box>
      </CardActionArea>
    );
  })
);

VideoThumbnail.displayName = "VideoThumbnail";
export default VideoThumbnail;
