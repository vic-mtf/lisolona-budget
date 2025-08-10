import React, { useEffect, useRef } from "react";
import useSocket from "../useSocket";
import store from "../../redux/store";
import dayjs from "dayjs";

const useNetworkStat = () => {
  const socket = useSocket();
  const lastHoursRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleRTTPong = (previousRTT) => {
      clearTimeout(timerRef.current);
      const currentRTT = performance.now();
      const currentHour = dayjs().format("HH:mm");
      const newValue = Math.abs(currentRTT - previousRTT);
      const labelToAdd = lastHoursRef.current.includes(currentHour)
        ? ""
        : currentHour;
      if (labelToAdd !== "") lastHoursRef.current.push(currentHour);

      const dataPoint = {
        x: labelToAdd,
        y: newValue,
      };
      let rttData = [
        ...store.getState().data.app.setting.network.rttData,
        dataPoint,
      ];
      if (rttData.length > MAX_POINTS - 10) rttData = rttData.slice(1);
      store.dispatch({
        type: "data/updateApp",
        payload: {
          key: "app.setting.network.rttData",
          data: rttData,
        },
      });

      timerRef.current = setTimeout(
        () => socket?.emit("rtt-ping", performance.now()),
        1000
      );
    };
    socket?.on("rtt-pong", handleRTTPong);
    return () => {
      socket?.off("rtt-pong", handleRTTPong);
    };
  });
};

export const useNetworkStatDemo = () => {
  const lastHoursRef = useRef([]);
  useEffect(() => {
    const interval = setInterval(() => {
      const currentHour = dayjs().format("HH:mm");
      const newValue =
        Math.random() < 0.9
          ? Math.floor(Math.random() * 100)
          : Math.floor(Math.random() * 600);
      const labelToAdd = lastHoursRef.current.includes(currentHour)
        ? ""
        : currentHour;

      if (labelToAdd !== "") lastHoursRef.current.push(currentHour);

      const dataPoint = {
        time: labelToAdd,
        delay: newValue,
      };
      let rttData = [
        ...store.getState().data.app.setting.network.rttData,
        dataPoint,
      ];
      if (rttData.length > MAX_POINTS - 10) rttData = rttData.slice(1);

      store.dispatch({
        type: "data/updateData",
        payload: {
          key: "app.setting.network",
          data: { rttData },
        },
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
};

export const MAX_POINTS = 180;

export default React.memo(useNetworkStat);
