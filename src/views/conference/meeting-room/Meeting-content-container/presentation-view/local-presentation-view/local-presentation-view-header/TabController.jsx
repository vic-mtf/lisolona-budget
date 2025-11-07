import MouseOutlinedIcon from "@mui/icons-material/MouseOutlined";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";
import useLocalStoreData from "../../../hooks/useLocalStoreData";
import { updateConferenceData } from "../../../redux/conference/conference";
import ZoomInOutlinedIcon from "@mui/icons-material/ZoomInOutlined";
import ZoomOutOutlinedIcon from "@mui/icons-material/ZoomOutOutlined";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const TabController = () => {
  const [getData] = useLocalStoreData("conference.setup.devices.screen");
  const dispatch = useDispatch();
  const capturedSurfaceControl = useSelector(
    (state) => state.conference.setup.devices.screen.capturedSurfaceControl
  );
  const displaySurface = useSelector(
    (state) => state.conference.setup.devices.screen.displaySurface
  );
  const enabled = useSelector(
    (state) => state.conference.setup.devices.screen.enabled
  );
  const [permission, setPermission] = useState(null);

  const handleAllowedControl = useCallback(async () => {
    const controller = getData("controller");

    if (!controller) return;
    const previewTile = document.querySelector(
      "#local-presentation-video-layer"
    );
    try {
      await controller.forwardWheel(previewTile);
    } catch (e) {
      console.error(e);
    }
  }, [getData]);

  useEffect(() => {
    const onUpdatePermissionState = (state) => {
      dispatch(
        updateConferenceData({
          key: ["setup.devices.screen.capturedSurfaceControl"],
          data: [state],
        })
      );
    };
    const onGetPermissions = async () => {
      try {
        const permission = await navigator.permissions.query({
          name: "captured-surface-control",
        });
        setPermission(permission);
        onUpdatePermissionState(permission.state);
      } catch (e) {
        console.error(e);
      }
    };
    if (!permission || !capturedSurfaceControl) onGetPermissions();

    const onChangePermission = (e) => {
      setPermission(e?.target);
      onUpdatePermissionState(e?.target?.state);
    };
    permission?.addEventListener("change", onChangePermission);
    return () => {
      permission?.removeEventListener("change", onChangePermission);
    };
  }, [capturedSurfaceControl, permission, dispatch]);

  useEffect(() => {
    if (!permission) return;
    if (permission?.state === "granted" && enabled) handleAllowedControl();
  }, [permission, handleAllowedControl, enabled]);

  const allowedControl = useMemo(() => {
    return (
      (capturedSurfaceControl ? capturedSurfaceControl !== "granted" : false) &&
      displaySurface === "browser" &&
      enabled
    );
  }, [capturedSurfaceControl, displaySurface, enabled]);

  const isVisibleZoomOption = useMemo(() => {
    return (
      permission?.state === "granted" && enabled && displaySurface === "browser"
    );
  }, [permission?.state, enabled, displaySurface]);

  return (
    <>
      <Fade in={allowedControl} appear={false} unmountOnExit>
        <Tooltip title="Activer le contrôle de la souris pour scroller et zoomer l'onglet en cours de présentation">
          <div>
            <IconButton onClick={handleAllowedControl}>
              <MouseOutlinedIcon />
            </IconButton>
          </div>
        </Tooltip>
      </Fade>
      <ZoomController isVisible={isVisibleZoomOption} />
    </>
  );
};

const BoxMotion = motion.create(Box);

const ZoomController = ({ isVisible }) => {
  const [getData] = useLocalStoreData("conference.setup.devices.screen");
  const controller = getData("controller");
  const [zoom, setZoom] = useState(() => controller?.zoomLevel | 0);

  useEffect(() => {
    if (!controller) return;
    setZoom(controller.zoomLevel);
    const onZoomLevelChange = () => setZoom(controller.zoomLevel);
    controller.addEventListener("zoomlevelchange", onZoomLevelChange);
    return () => {
      controller.removeEventListener("zoomlevelchange", onZoomLevelChange);
    };
  }, [controller]);

  return (
    <AnimatePresence>
      {isVisible && (
        <BoxMotion
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
          layout
          sx={{
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            whiteSpace: "nowrap",
          }}>
          <IconButton
            onClick={() => {
              controller.increaseZoomLevel();
              setZoom(controller.zoomLevel);
            }}>
            <ZoomInOutlinedIcon fontSize='small' />
          </IconButton>
          <Chip label={`${zoom}%`} variant='outlined' />
          <IconButton
            onClick={() => {
              controller.decreaseZoomLevel();
              setZoom(controller.zoomLevel);
            }}>
            <ZoomOutOutlinedIcon fontSize='small' />
          </IconButton>
        </BoxMotion>
      )}
    </AnimatePresence>
  );
};

ZoomController.propTypes = {
  isVisible: PropTypes.bool,
};

export default TabController;
