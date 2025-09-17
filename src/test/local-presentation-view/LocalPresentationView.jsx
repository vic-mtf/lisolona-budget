import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import LocalPresentationViewHeader from "./local-presentation-view-header/LocalPresentationViewHeader";
import LocalPresentationViewContent from "./local-presentation-view-content/LocalPresentationViewContent";
import ScreenShareOutlinedIcon from "@mui/icons-material/ScreenShareOutlined";
import StopScreenShareOutlinedIcon from "@mui/icons-material/StopScreenShareOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import useLocalStoreData from "../../hooks/useLocalStoreData";
import { useDispatch, useSelector } from "react-redux";
import { updateConferenceData } from "../../redux/conference/conference";

const LocalPresentationView = () => {
  return (
    <Box
      display='flex'
      position='absolute'
      left={0}
      top={0}
      right={0}
      bottom={0}
      bgcolor='background.default'
      flexDirection='column'>
      <LocalPresentationViewHeader />
      <LocalPresentationViewContent />
      <Footer />
    </Box>
  );
};

const Footer = () => {
  const [getData, setData] = useLocalStoreData(
    "conference.setup.devices.screen"
  );
  const enabled = useSelector(
    (store) => store.conference.setup.devices.screen.enabled
  );
  const dispatch = useDispatch();

  const handleShareScreen = async () => {
    if (enabled) {
      getData("stream")
        .getTracks()
        .forEach((track) => {
          track.stop();
        });
      setData({ stream: null, controller: null });
      dispatch(
        updateConferenceData({
          key: ["setup.devices.screen.enabled"],
          data: [false],
        })
      );
      return;
    }

    const { navigator } = window;
    if (!navigator?.mediaDevices?.getDisplayMedia) {
      console.error(
        "Votre navigateur ne supporte pas la fonctionnalité de partage d'écran"
      );
      return;
    }
    try {
      const controller =
        window.CaptureController && new window.CaptureController();
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
        surfaceSwitching: "include",
        controller,
      });
      const [videoStreamTrack] = stream.getVideoTracks();
      const displaySurface = videoStreamTrack?.getSettings()?.displaySurface;
      console.log(displaySurface);

      stream.getTracks().forEach((track) => {
        track.onended = () => {
          setData({ stream: null, controller: null });
          dispatch(
            updateConferenceData({
              key: ["setup.devices.screen.enabled"],
              data: [false],
            })
          );
        };
      });

      setData({ stream, controller });
      dispatch(
        updateConferenceData({
          key: [
            "setup.devices.screen.enabled",
            "setup.devices.screen.displaySurface",
          ],
          data: [true, displaySurface],
        })
      );
    } catch (err) {
      console.error("Erreur de partage d'écran:", err);
    }
  };
  return (
    <Toolbar variant='dense' sx={{ justifyContent: "center" }}>
      <Tooltip
        title={enabled ? "Arrêter le partage d'écran" : "Partager l'écran"}>
        <span style={{ display: "inline-flex" }}>
          <IconButton onClick={handleShareScreen}>
            {enabled ? (
              <StopScreenShareOutlinedIcon />
            ) : (
              <ScreenShareOutlinedIcon />
            )}
          </IconButton>
        </span>
      </Tooltip>
    </Toolbar>
  );
};

export default LocalPresentationView;
