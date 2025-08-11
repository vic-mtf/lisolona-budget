import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import axiosConfig from "../configs/axios-config.json";
import PropTypes from "prop-types";
import { SocketIOContext } from "../hooks/useSocket";
import { useEffect } from "react";

const DEFAULT_OPTIONS = { transports: ["websocket"] };
const OPENER_SOCKET = window.opener?._OPENER_SOCKET;
const BASE_URL = axiosConfig.baseURL;

const Provider = SocketIOContext.Provider;

const SocketIOProvider = ({
  children,
  url = BASE_URL,
  token: defaultToken,
  options = DEFAULT_OPTIONS,
}) => {
  const token = useSelector((store) => store?.user?.token || defaultToken);
  const loaded = useSelector((store) => store?.data?.app?.loaded);
  const socket = useMemo(
    () =>
      OPENER_SOCKET ||
      (loaded ? (token ? io(`${url}?token=${token}`, options) : null) : null),
    [token, url, options, loaded]
  );
  useEffect(() => {
    if (socket && window._OPENER_SOCKET !== socket)
      window._OPENER_SOCKET = socket;
  }, [socket]);

  return <Provider value={socket}>{children}</Provider>;
};

SocketIOProvider.propTypes = {
  children: PropTypes.node,
  url: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(URL)]),
  token: PropTypes.string,
  options: PropTypes.object,
};

export default React.memo(SocketIOProvider);
