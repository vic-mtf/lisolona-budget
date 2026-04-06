import React, { useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import useLocalStoreData from "@/hooks/useLocalStoreData";
import Typography from "@mui/material/Typography";
import ViewOptions from "./ViewOptions";
import { updateConferenceData } from "@/redux/conference/conference";
import { darkGradientFromId } from "@/utils/color";
import LocalMuteMicro from "./LocalMuteMicro";
import LocalVideoStream from "./LocalVideoStream";

const LocalParticipantView = ({ onReduced }) => {
  const dispatch = useDispatch();

  const image = useSelector((store) => store.user.image);
  const id = useSelector((store) => store.user.id);

  const [getData] = useLocalStoreData("app.downloads.images");
  const src = useMemo(() => getData(id) || image, [getData, image, id]);

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

  return (
    <Box
      sx={{
        ...(!src && darkGradientFromId(id)),
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
          "& > .local-view-options": {
            opacity: 0,
            pointerEvents: "none",
            touchAction: "none",
            zIndex: (t) => t.zIndex.tooltip + 100,
          },
          "&:hover > .local-view-options": {
            opacity: 0.4,
            pointerEvents: "auto",
            touchAction: "auto",
            "&:hover": { opacity: 1 },
          },
        }}>
        {isFloating && (
          <ViewOptions onReduced={onReduced} onAddToGrid={onAddToGrid} />
        )}
        <LocalMuteMicro />
        <LocalVideoStream />
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
          filter: "blur(50px)",
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default React.memo(LocalParticipantView);
