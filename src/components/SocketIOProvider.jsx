import { useMemo } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import axiosConfig from "../configs/axios-config.json";
import PropTypes from "prop-types";
import { SocketIOContext } from "../hooks/useSocket";

const DEFAULT_OPTIONS = { transports: ["websocket"] };
const OPENER_SOCKET = window._OPENER_SOCKET;
const BASE_URL = axiosConfig.baseURL;

const Provider = SocketIOContext.Provider;

export default function SocketIOProvider({
  children,
  url = BASE_URL,
  token: defaultToken,
  options = DEFAULT_OPTIONS,
}) {
  const token = useSelector((store) => store?.user?.token || defaultToken);
  const loaded = useSelector((store) => store?.data?.app?.loaded);
  const socket = useMemo(
    () =>
      OPENER_SOCKET ||
      (loaded ? (token ? io(`${url}?token=${token}`, options) : null) : null),
    [token, url, options, loaded]
  );

  return <Provider value={socket}>{children}</Provider>;
}

SocketIOProvider.propTypes = {
  children: PropTypes.node,
  url: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(URL)]),
  token: PropTypes.string,
  options: PropTypes.object,
};
