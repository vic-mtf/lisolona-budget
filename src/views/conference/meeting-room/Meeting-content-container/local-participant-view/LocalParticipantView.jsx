import React, { useMemo, useRef } from "react";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import useLocalStoreData from "../../../../../hooks/useLocalStoreData";
import Typography from "@mui/material/Typography";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import ListAvatar from "../../../../../components/ListAvatar";
import { streamSegmenterMediaPipe } from "../../../../../utils/StreamSegmenterMediaPipe";
import { useEffect, useCallback } from "react";
import AudioWaveSpeaker from "./AudioWaveSpeaker";
import { alpha } from "@mui/material";
import ViewOptions from "./ViewOptions";
import { updateConferenceData } from "../../../../../redux/conference/conference";
import PropTypes from "prop-types";

const LocalParticipantView = ({ onReduced }) => {
  const dispatch = useDispatch();
  const [opacity, setOpacity] = React.useState(0);
  const image = useSelector((store) => store.user.image);
  const id = useSelector((store) => store.user.id);
  const name = useSelector((store) => store.user.firstName?.charAt(0));
  const [getData] = useLocalStoreData("app.downloads.images");
  const src = useMemo(() => getData(id) || image, [getData, image, id]);
  const videoRef = useRef();
  const isCamActive = useSelector(
    (store) => store.conference.setup.devices.camera.enabled
  );
  const isMicActive = useSelector(
    (store) => store.conference.setup.devices.microphone.enabled
  );

  const isFloating = useSelector(
    (store) =>
      store.conference.meeting.view.localParticipant.mode === "floating"
  );

  const onAddToGrid = useCallback(() => {
    dispatch(
      updateConferenceData({
        key: ["meeting.view.localParticipant.mode"],
        data: ["grid"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isCamActive)
      videoRef.current.srcObject =
        streamSegmenterMediaPipe?.getProcessedStream();
    else {
      videoRef.current.srcObject = null;
      setOpacity(0);
    }
  }, [isCamActive]);

  return (
    <Box
      sx={{
        "&, & > div, & video": {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      }}>
      <Box
        zIndex={1}
        display='flex'
        alignItems='flex-end'
        sx={{
          "& > .viewOptions": {
            opacity: 0,
            pointerEvents: "none",
            touchAction: "none",
          },
          "&:hover > .viewOptions": {
            opacity: 0.4,
            pointerEvents: "auto",
            touchAction: "auto",
            "&:hover": { opacity: 1 },
          },
        }}>
        {isFloating && (
          <ViewOptions onReduced={onReduced} onAddToGrid={onAddToGrid} />
        )}
        {!isMicActive && (
          <Box position='absolute' top={0} right={0} zIndex={1} p={0.5}>
            <Box
              component={Typography}
              sx={{
                bgcolor: (t) => alpha(t.palette.common.black, 0.5),
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "text.secondary",
                borderRadius: 1,
                p: 0.5,
              }}>
              <MicOffOutlinedIcon fontSize='small' />
            </Box>
          </Box>
        )}
        {!isCamActive && (
          <>
            <Box
              sx={{
                position: "absolute",
                transform: "translateY(-50%) translateX(-50%)",
                left: "50%",
                top: "50%",
                boxShadow: 5,
                borderRadius: 1,
                zIndex: 1,
              }}>
              <ListAvatar id={id} src={src}>
                {name}
              </ListAvatar>
            </Box>
            <Box position='absolute' top={0} left={0} right={0} bottom={0}>
              <AudioWaveSpeaker id={id} />
            </Box>
          </>
        )}

        <Box
          muted
          component='video'
          autoPlay
          playsInline
          ref={videoRef}
          disablePictureInPicture
          onLoadedMetadata={() => setOpacity(1)}
          width='100%'
          height='100%'
          sx={{
            objectFit: "cover",
            transform: "scaleX(-1)",
            opacity,
            transition: (t) =>
              t.transitions.create("opacity", {
                easing: t.transitions.easing.easeInOut,
                duration: t.transitions.duration.enteringScreen,
              }),
          }}
        />
        <Box sx={{ p: 1, display: "flex", zIndex: (t) => t.zIndex.tooltip }}>
          <Typography
            sx={{ textShadow: "1px 1px 2px black", fontSize: ".8rem" }}
            variant='body2'>
            Vous
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundImage: `url(${src})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: "blur(30px)",
          zIndex: 0,
        }}
      />
    </Box>
  );
};

LocalParticipantView.propTypes = {
  onReduced: PropTypes.func,
};

export default React.memo(LocalParticipantView);
