import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { Slider, Typography, IconButton, Box, Divider } from "@mui/material";
import PropTypes from "prop-types";
import formatTime from "../utils/formatTime";
import useLocalStoreData, { useSmartKey } from "../hooks/useLocalStoreData";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import VoiceRateButton from "../views/main-view/view-content-box/messaging-box/messaging-box-content/message-content-item/message-content-voice/VoiceRateButton";

const AudioListenerView = React.forwardRef(
  ({ url, id, autoClose, uploadButton }, ref) => {
    const { key } = useSmartKey({
      baseKey: `app.key.audios.${id}`,
      paths: { key: ["downloads", "uploads"] },
    });
    const [getData, setData] = useLocalStoreData(key);
    const audio = useMemo(() => getData("audio") || new Audio(), [getData]);
    const [duration, setDuration] = useState(() => getData("duration") || 0);
    const src = useMemo(() => audio?.src || url, [url, audio]);

    useLayoutEffect(() => {
      if (!getData("audio")) setData({ audio });

      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
        setData({ duration: audio.duration });
      };

      if (src !== audio.src) {
        audio.src = src;
        audio.id = id;
        audio.load();
      }
      return () => {
        if (autoClose) {
          audio.pause();
          audio.currentTime = 0;
        }
      };
    }, [url, getData, setData, audio, src, id, autoClose]);

    return (
      <Box
        display='flex'
        ref={ref}
        flexDirection='row'
        gap={2}
        height={60}
        alignItems='center'
        width='100%'
        px={1}>
        {uploadButton || <ToggleListingButton audio={audio} />}
        <Box
          position='relative'
          flexGrow={1}
          sx={{ transition: ".2s all" }}
          display='flex'
          alignItems='center'>
          <ProgressSlider audio={audio} duration={duration} />
        </Box>
        <ListeningTimer audio={audio} duration={duration} />
        <Divider
          orientation='vertical'
          flexItem
          variant='middle'
          sx={{ borderWidth: 1.5 }}
        />
        <VoiceRateButton audio={audio} />
      </Box>
    );
  }
);

const ProgressSlider = ({ audio, duration }) => {
  const [current, setCurrent] = useState(() => audio?.currentTime || 0);

  useEffect(() => {
    if (!audio) return;
    const onTimeupdate = () => setCurrent(audio.currentTime);
    audio.addEventListener("timeupdate", onTimeupdate);
    return () => {
      audio.removeEventListener("timeupdate", onTimeupdate);
    };
  });
  return (
    <Slider
      step={duration / 1000}
      max={duration}
      value={current}
      size='small'
      sx={{
        "& .MuiSlider-rail": {
          color: (t) => t.palette.grey["A400"],
        },
        "& .MuiSlider-track": {
          transition: "none",
        },
        "& .MuiSlider-thumb": {
          transition: "none",
          height: 12,
          width: 12,
          boxShadow: "none",
          "&:focus, &:hover, &.Mui-active": {
            boxShadow: "none",
            "@media (hover: none)": {
              boxShadow: "none",
            },
          },
          "&:before": {
            boxShadow: "none",
          },
        },
      }}
      onChange={(_, value) => (audio.currentTime = value)}
    />
  );
};

const ListeningTimer = ({ audio, duration }) => {
  const [current, setCurrent] = useState(() => audio?.currentTime || null);
  const isFirstPlay = useRef(true);
  const currentTime = isFirstPlay.current ? Math.floor(duration) : current;

  useEffect(() => {
    if (!audio) return;
    const onTimeupdate = () => setCurrent(audio.currentTime);
    const onPlay = () => (isFirstPlay.current = false);
    audio.addEventListener("timeupdate", onTimeupdate);
    audio.addEventListener("play", onPlay);
    return () => {
      audio.removeEventListener("timeupdate", onTimeupdate);
      audio.removeEventListener("play", onPlay);
    };
  }, [audio]);

  return (
    <Typography variant='body1' component='div'>
      {formatTime({ currentTime })}
    </Typography>
  );
};

const ToggleListingButton = ({ audio }) => {
  const [paused, setPaused] = useState(true);
  const [getData, setData] = useLocalStoreData();

  useEffect(() => {
    if (!audio) return;
    const onEnded = () => setPaused(true);
    const onPlay = () => setPaused(false);
    audio?.addEventListener("ended", onEnded);
    audio?.addEventListener("play", onPlay);
    audio?.addEventListener("pause", onEnded);
    return () => {
      audio?.removeEventListener("ended", onEnded);
      audio?.removeEventListener("play", onPlay);
      audio?.removeEventListener("pause", onEnded);
    };
  }, [audio]);

  return (
    <IconButton
      onClick={() => {
        const playingAudio = getData("app.playings.audio");
        if (paused) {
          if (playingAudio !== audio) {
            getData("app.playings.audio")?.pause();
            setData("app.playings.audio", audio);
          }
          audio?.play();
        } else audio?.pause();
      }}>
      {paused ? <PlayArrowRoundedIcon /> : <PauseRoundedIcon />}
    </IconButton>
  );
};

ListeningTimer.propTypes = {
  audio: PropTypes.instanceOf(Audio),
  duration: PropTypes.number,
};

ProgressSlider.propTypes = {
  audio: PropTypes.instanceOf(Audio),
  duration: PropTypes.number,
};

ToggleListingButton.propTypes = {
  audio: PropTypes.instanceOf(Audio),
};

AudioListenerView.displayName = "AudioListenerView";

AudioListenerView.propTypes = {
  url: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(URL)]),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  autoClose: PropTypes.bool,
  uploadButton: PropTypes.node,
};

export default React.memo(AudioListenerView);
