import { alpha, Box, IconButton, Paper, Zoom } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import store from "@/redux/store";
import { updateData } from "@/redux/data/data";
import useLocalStoreData from "@/hooks/useLocalStoreData";
import VoiceThumbnail from "./voice-thumbnail/VoiceThumbnail";
import DocThumbnail from "./doc-thumbnail/DocThumbnail";
import ImageThumbnail from "./image-thumbnail/ImageThumbnail";
import AudioThumbnail from "./audio-thumbnail/AudioThumbnail";
import VideoThumbnail from "./video-thumbnail/VideoThumbnail";
import useSmallScreen from "@/hooks/useSmallScreen";

const FilesThumbnailView = React.memo(
  React.forwardRef(({ id }, ref) => {
    const files = useSelector((store) => store.data.chatBox.footer.files[id]);
    const containerRef = useRef(null);
    const [showLeftBtn, setShowLeftBtn] = useState(false);
    const [showRightBtn, setShowRightBtn] = useState(true);
    const [getDate, setData] = useLocalStoreData();
    const matches = useSmallScreen();

    const checkScrollPosition = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

        setShowLeftBtn(scrollLeft > 0);
        setShowRightBtn(
          scrollWidth > clientWidth &&
            scrollWidth - scrollLeft - clientWidth > 2
        );
      }
    };
    const removeFile = (file) => () => {
      const filterFuc = ({ id }) => id !== file.id;
      const voices = getDate("voices").filter(filterFuc);
      store.dispatch(
        updateData({
          data: {
            chatBox: {
              footer: {
                files: {
                  [id]: [...files].filter(filterFuc),
                },
              },
            },
          },
        })
      );
      setData("voices", voices);
    };

    const scroll = (direction) => {
      if (containerRef.current) {
        containerRef.current.scrollBy({
          left: direction === "right" ? 200 : -200,
          behavior: "smooth",
        });
      }
    };

    useEffect(() => {
      const container = containerRef.current;
      container.addEventListener("scroll", checkScrollPosition);
      window.addEventListener("resize", checkScrollPosition);
      checkScrollPosition();

      return () => {
        container.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
      };
    }, [files]);

    return (
      <Box
        ref={ref}
        px={1}
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
          "& .Custom-iconButton-bg": {
            bgcolor: (t) => alpha(t.palette.common.black, 0.7),
          },
        }}>
        <Zoom
          in={matches ? false : showLeftBtn}
          unmountOnExit
          appear={false}
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1600,
          }}>
          <IconButton
            onClick={() => scroll("left")}
            className='Custom-iconButton-bg'>
            <NavigateBeforeRoundedIcon fontSize='small' />
          </IconButton>
        </Zoom>
        <Box
          height={100}
          minWidth={100}
          ref={containerRef}
          maxWidth='100%'
          overflow='auto'
          display='flex'
          flexDirection='row'
          alignItems='center'
          gap={2}
          sx={{
            overflow: "hidden",
            overflowX: "scroll",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}>
          <LayoutGroup>
            <AnimatePresence>
              {files?.map((file) => {
                return (
                  <motion.div
                    key={file?.id}
                    layout
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.5 }}
                    // transition={{
                    //   type: "spring",
                    //   damping: 10,
                    //   stiffness: 200,
                    // }}
                    style={{
                      justifyContent: "space-between",
                    }}>
                    <Paper
                      sx={{
                        border: (t) => `1px solid ${t.palette.divider}`,
                        boxShadow: 0,
                        position: "relative",
                        "& .delete-elem-icon": {
                          pointerEvents: "none",
                          opacity: 0,
                          transition: "opacity 0.2s ease-in-out",
                        },
                        "&:hover ": {
                          boxShadow: 5,
                          "& .delete-elem-icon": {
                            pointerEvents: "auto",
                            opacity: 1,
                          },
                        },
                      }}
                      elevation={5}>
                      {file?.type === "voice" && <VoiceThumbnail {...file} />}
                      {file?.type === "audio" && <AudioThumbnail {...file} />}
                      {file?.type === "doc" && <DocThumbnail {...file} />}
                      {file?.type === "image" && <ImageThumbnail {...file} />}
                      {file?.type === "video" && <VideoThumbnail {...file} />}
                      <Box
                        className='delete-elem-icon'
                        sx={{
                          position: "absolute",
                          top: -10,
                          right: -10,
                        }}>
                        <IconButton
                          sx={{
                            border: (t) => `1px solid ${t.palette.divider}`,
                            height: 20,
                            width: 20,
                          }}
                          className='Custom-iconButton-bg'
                          onClick={removeFile(file)}>
                          <ClearRoundedIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                      </Box>
                    </Paper>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </LayoutGroup>
        </Box>
        <Zoom
          in={matches ? false : showRightBtn}
          unmountOnExit
          appear={false}
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1600,
          }}>
          <IconButton
            onClick={() => scroll("right")}
            className='Custom-iconButton-bg'>
            <NavigateNextRoundedIcon fontSize='small' />
          </IconButton>
        </Zoom>
      </Box>
    );
  })
);

FilesThumbnailView.displayName = "FilesThumbnailView";
export default FilesThumbnailView;
