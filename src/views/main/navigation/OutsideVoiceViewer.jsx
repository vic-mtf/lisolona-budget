import {
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  IconButton,
  Stack,
  Box,
  LinearProgress,
  Divider,
} from "@mui/material";
import ListAvatar from "../../../components/ListAvatar";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import useLocalStoreData from "../../../hooks/useLocalStoreData";
import getFullName from "../../../utils/getFullName";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import { updateData } from "../../../redux/data/data";

const OutsideVoiceViewer = () => {
  const discussionTarget = useSelector((store) => store.data.discussionTarget);
  const targetId = useSelector(
    (store) => store.data.app.actions.messaging.medias.playings.targetId
  );
  const dispatch = useDispatch();
  const [getData, setData] = useLocalStoreData("app.playings");
  const message = useSelector((store) => {
    const { audio } = getData();
    const targetId = audio?.dataset?.targetId;
    const id = audio?.dataset?.id;
    return store.data.app.messages[targetId]?.find(
      ({ clientId }) => clientId === id
    );
  });

  const open = useMemo(
    () =>
      targetId && targetId !== discussionTarget?.id && !getData("audio.paused"),
    [targetId, discussionTarget, getData]
  );

  const target = useSelector((store) => {
    const { audio } = getData();
    const targetId = audio?.dataset?.targetId;
    return store.data.app.discussions.find(({ id }) => id === targetId);
  });

  const sender = useMemo(() => message?.sender, [message]);
  const senderName = useMemo(() => getFullName(sender), [sender]);

  return (
    <>
      <AnimatedHeight open={open}>
        <Divider />
        <ListItem
          disablePadding
          secondaryAction={
            <Stack direction='row' gap={1}>
              <div>
                <TogglePauseButton key={targetId} />
              </div>
              <div>
                <IconButton
                  edge='end'
                  onClick={() => {
                    const key = [
                      "app.actions.messaging.medias.playings.targetId",
                      "app.actions.messaging.medias.playings.id",
                    ];
                    dispatch(updateData({ key, data: [null, null] }));
                    getData("audio")?.pause();
                    setData({ audio: null });
                  }}>
                  <CloseOutlinedIcon />
                </IconButton>
              </div>
            </Stack>
          }>
          <ListItemButton
            dense={false}
            sx={{ pt: 1, pb: 2 }}
            onClick={() => {
              const messageId = message?.id || message?.clientId;
              const key = [
                "discussionTarget",
                "targetView",
                "app.actions.messaging.scrollTo",
                `app.actions.messaging.blink.${messageId}`,
              ];
              const data = [target, "messages", messageId, true];
              dispatch(updateData({ key, data }));
            }}>
            <ListItemAvatar>
              <ListAvatar id={sender?.id} src={sender?.image}>
                {senderName?.charAt(0)}
              </ListAvatar>
            </ListItemAvatar>
            <ListItemText primary={senderName} />
          </ListItemButton>
        </ListItem>
        <ProgressBar key={targetId} />
      </AnimatedHeight>
    </>
  );
};

export const AnimatedHeight = React.memo(({ open, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          style={{ overflow: "hidden", position: "relative" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

AnimatedHeight.displayName = "AnimatedHeight";

const TogglePauseButton = () => {
  const [getData] = useLocalStoreData("app.playings");
  const [isPlaying, setIsPlaying] = useState(
    () => !getData("audio.paused") || false
  );

  useEffect(() => {
    const { audio } = getData();
    if (audio) {
      const onPause = () => setIsPlaying(false);
      const onPlay = () => setIsPlaying(true);
      const onEnded = () => setIsPlaying(false);
      audio.addEventListener("pause", onPause);
      audio.addEventListener("play", onPlay);
      audio.addEventListener("ended", onEnded);
      return () => {
        audio.removeEventListener("pause", onPause);
        audio.removeEventListener("play", onPlay);
        audio.removeEventListener("ended", onEnded);
      };
    }
  }, [getData]);

  return (
    <IconButton
      onClick={() => {
        const { audio } = getData();
        if (isPlaying) {
          audio?.pause();
          setIsPlaying(false);
        } else {
          if (audio.currentTime === audio.duration) audio.currentTime = 0;
          audio?.play();
          setIsPlaying(true);
        }
      }}>
      {isPlaying ? <PauseOutlinedIcon /> : <PlayArrowOutlinedIcon />}
    </IconButton>
  );
};

const ProgressBar = () => {
  const [getData] = useLocalStoreData("app.playings");
  const [current, setCurrent] = useState(
    () => getData("audio.currentTime") || 0
  );
  const [duration, setDuration] = useState(
    () => getData("audio.duration") || 0
  );

  useEffect(() => {
    const { audio } = getData();

    async function getAudioBufferDuration(url) {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      return audioBuffer.duration;
    }
    if (duration === Infinity)
      getAudioBufferDuration(audio.src).then(setDuration);

    if (audio) {
      const onTimeUpdate = () => setCurrent(audio.currentTime);
      const onDurationChange = () => setDuration(audio.duration);
      audio.addEventListener("timeupdate", onTimeUpdate);
      audio.addEventListener("durationchange", onDurationChange);
      return () => {
        audio.removeEventListener("timeupdate", onTimeUpdate);
        audio.removeEventListener("durationchange", onDurationChange);
      };
    }
  }, [getData, duration]);

  return (
    <Box width='100%' position='absolute' bottom={0} left={0} right={0}>
      <LinearProgress
        value={(current / duration) * 100}
        variant='determinate'
        size='small'
        color='inherit'
        sx={{}}
      />
    </Box>
  );
};

AnimatedHeight.propTypes = {
  open: PropTypes.bool,
  children: PropTypes.node,
};

export default OutsideVoiceViewer;
