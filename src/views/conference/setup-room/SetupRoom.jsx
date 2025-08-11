import { Box } from "@mui/material";
import DeviceConfig from "./device-config/DeviceConfig";
import RoomInfos from "./room-infos/RooMInfos";
import ToolbarIdentity from "./room-infos/ToolbarIdentity";
import useSmallScreen from "../../../hooks/useSmallScreen";
import { useDispatch } from "react-redux";
import { updateConferenceData } from "../../../redux/conference/conference";
import { useEffect } from "react";
import DeviceAlertPermission from "./device-config/DeviceAlertPermission";
import useSocket from "../../../hooks/useSocket";

const SetupRoom = () => {
  const matches = useSmallScreen();
  const dispatch = useDispatch();
  const socket = useSocket();

  useEffect(() => {
    const getPermission = async () => {
      const [mic, camera] = await Promise.all([
        navigator.permissions.query({ name: "microphone" }),
        navigator.permissions.query({ name: "camera" }),
      ]);

      const key = [
        "setup.devices.microphone.permission",
        "setup.devices.camera.permission",
      ];
      const data = [mic.state, camera.state];
      dispatch(updateConferenceData({ data, key }));
      mic.onchange = () => {
        dispatch(updateConferenceData({ data: mic.state, key: key[0] }));
      };
      camera.onchange = () => {
        dispatch(updateConferenceData({ data: camera.state, key: key[1] }));
      };
    };
    getPermission();
  }, [dispatch]);

  useEffect(() => {
    socket?.emit("rtt-ping", performance.now());
  }, [socket]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: { md: "center" },
          position: "relative",
          overflow: "hidden",
          overflowY: "auto",
          gap: 2,
          flexDirection: "column",
        }}>
        {matches && <ToolbarIdentity />}
        <Box
          position='relative'
          display='flex'
          gap={2}
          flexDirection={{ xs: "column", md: "row" }}>
          <DeviceConfig />
          <RoomInfos />
        </Box>
      </Box>
      <DeviceAlertPermission />
    </>
  );
};

export default SetupRoom;
