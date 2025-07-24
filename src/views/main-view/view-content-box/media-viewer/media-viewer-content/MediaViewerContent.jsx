import { Box, IconButton, Slide } from "@mui/material";
import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from "react";
import { MessagingContext } from "../../messaging-box/MessagingBoxProvider";
import { useSelector } from "react-redux";
import { updateData } from "../../../../../redux/data/data";
import store from "../../../../../redux/store";
import useSwipe from "../../../../../hooks/useSwipe";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import NavigateBeforeOutlinedIcon from "@mui/icons-material/NavigateBeforeOutlined";
import ImageContent from "./ImageContent";
import PropTypes from "prop-types";
import VideoContent from "./VideoContent";

const MediaViewerContent = React.memo(({ zoom }) => {
  const messageId = useSelector(
    (store) => store.data.app.actions.messaging.medias.viewer.id
  );

  const [{ user }] = useContext(MessagingContext);
  const bulkMessages = useSelector(
    (store) => store.data.app.messages[user?.id]
  );
  const messages = useMemo(
    () => bulkMessages.filter(({ type }) => type === "media"),
    [bulkMessages]
  );
  const [index, setIndex] = useState(
    Math.max(
      0,
      messages?.findIndex(({ clientId, id }) => (clientId || id) === messageId)
    )
  );
  const directions = useMemo(() => ({ enter: "left", exit: "right" }), []);
  const handleChange = useCallback(
    (dir = 1) => {
      directions.enter = dir < 1 ? "left" : "right";
      directions.exit = dir > -1 ? "left" : "right";
      const val = index + dir;
      const newIndex = Math.min(messages?.length - 1, Math.max(0, val));
      if (newIndex !== index) {
        setIndex(newIndex);
        const key = "app.actions.messaging.medias.viewer.id";
        const message = messages[newIndex];
        const messageId = message?.clientId || message?.id;
        store.dispatch(updateData({ key, data: messageId }));
      }
    },
    [messages, index, directions]
  );

  const onSwipe = useCallback(
    (_, direction) => {
      if (["left", "right"].includes(direction))
        handleChange(direction === "right" ? 1 : -1);
    },
    [handleChange]
  );

  const { ref } = useSwipe({ onSwipe });

  useEffect(() => {
    const onKeyDown = (event) => {
      if (["ArrowRight", "ArrowLeft"].includes(event.key)) {
        event.preventDefault();
        handleChange(event.key === "ArrowLeft" ? 1 : -1);
      }
    };
    if (!zoom) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleChange, zoom]);

  return (
    <Box
      position='relative'
      display='flex'
      flex={1}
      justifyContent='center'
      alignItems='center'
      overflow='hidden'
      width='100%'
      sx={{
        outline: 0,
        "& > .Navigate-buttons": {
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          display: zoom ? "none" : "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: (theme) => theme.zIndex.fab,
          mx: 1,
        },
      }}>
      <Box left={0} className='Navigate-buttons'>
        <IconButton
          disabled={index === messages?.length - 1}
          onClick={() => handleChange(1)}>
          <NavigateBeforeOutlinedIcon fontSize='large' />
        </IconButton>
      </Box>
      <Box right={0} className='Navigate-buttons'>
        <IconButton disabled={index === 0} onClick={() => handleChange(-1)}>
          <NavigateNextOutlinedIcon fontSize='large' />
        </IconButton>
      </Box>
      <Box
        /*
          ref={zoom ? undefined : ref}
          conflict swipe events
        */
        ref={zoom ? undefined : ref}
        sx={{
          width: "100%",
          height: "100%",

          "& > div": {
            width: "100%",
            height: "100%",
            position: "absolute",
          },
        }}>
        {messages?.map(({ clientId, id, content, subType }, i) => (
          <Slide
            key={clientId || id}
            in={index === i}
            appear={false}
            direction={directions[index === i ? "enter" : "exit"]}
            unmountOnExit
            timeout={300}
            style={{
              zIndex: index === i ? 1 : 0,
            }}>
            <Box
              position='relative'
              display='flex'
              flex={1}
              justifyContent='center'
              alignItems='center'
              overflow='hidden'>
              <Box
                content={content}
                id={clientId || id}
                mode={zoom ? "zoom" : "normal"}
                component={subType === "IMAGE" ? ImageContent : VideoContent}
              />
              {}
            </Box>
          </Slide>
        ))}
      </Box>
    </Box>
  );
});
MediaViewerContent.propTypes = {
  zoom: PropTypes.bool,
};
MediaViewerContent.displayName = "MediaViewerContent";
export default MediaViewerContent;
