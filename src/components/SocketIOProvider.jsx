import { createContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import axiosConfig from "../configs/axios-config.json";

const DEFAULT_OPTIONS = { transports: ["websocket"] };
const OPENER_SOCKET = window.OPENER_SOCKET;
const BASE_URL = axiosConfig.baseURL;

export default function SocketIOProvider({
  children,
  url = BASE_URL,
  token: defaultToken,
  options = DEFAULT_OPTIONS,
}) {
  const token = useSelector((store) => store?.user?.token || defaultToken);
  const socket = useMemo(
    () =>
      OPENER_SOCKET || (token ? io(`${url}?token=${token}`, options) : null),
    [token, url, options]
  );

  return <Provider value={socket}>{children}</Provider>;
}

export const SocketIOContext = createContext(null);

const { Provider } = SocketIOContext;
