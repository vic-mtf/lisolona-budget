import { Box } from "@mui/material";
import DeviceConfig from "./device-config/DeviceConfig";
import RoomInfos from "./room-infos/RooMInfos";
import ToolbarIdentity from "./room-infos/ToolbarIdentity";
import useSmallScreen from "../../../hooks/useSmallScreen";
import useLocalStoreData from "../../../hooks/useLocalStoreData";
import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { updateConferenceData } from "../../../redux/conference/conference";
import { useEffect } from "react";
import getDevices from "../../../utils/getDevices";

const SetupRoom = () => {
  const matches = useSmallScreen();
  const [getData, setData] = useLocalStoreData("conference.setup.devices");
  const dispatch = useDispatch();

  useEffect(() => {
    const getPermission = async () => {
      const mic = await navigator.permissions.query({
        name: "microphone",
      });
      const camera = await navigator.permissions.query({
        name: "camera",
      });
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
  }, [getData, dispatch]);

  useLayoutEffect(() => {
    const microphoneAndCamera = getData("microphoneAndCamera");
    const getStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const { microphones, cameras, speakers, screens } = await getDevices();
      const defaultDevices = {
        microphone: microphones[0],
        camera: cameras[0],
        speaker: speakers[0],
        screen: screens[0],
      };
      const key = [
        "setup.devices.microphones",
        "setup.devices.cameras",
        "setup.devices.speakers",
        "setup.devices.screens",
        "setup.devices.microphone.enabled",
        "setup.devices.camera.enabled",
      ];
      const data = [microphones, cameras, speakers, screens, true, true];
      Object.keys(defaultDevices).forEach((k) => {
        const obj = defaultDevices[k];
        Object.keys(obj).forEach((j) => {
          key.push(`setup.devices.${k}.${j}`);
          data.push(obj[j]);
        });
      });
      dispatch(updateConferenceData({ data, key }));
      setData("microphoneAndCamera.stream", stream);
    };
    if (!microphoneAndCamera?.stream) getStream();
  }, [getData, setData, dispatch]);

  return (
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
  );
};

export default SetupRoom;
