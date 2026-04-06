import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { io, type Socket } from "socket.io-client";
import { SocketIOContext } from "@/hooks/useSocket";
import type { RootState } from "@/redux/store";

const DEFAULT_OPTIONS = { transports: ["websocket"] as string[] };
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

const Provider = SocketIOContext.Provider;
let socketIO: Socket | null = null;

interface SocketIOProviderProps {
  children: React.ReactNode;
  url?: string;
  token?: string;
  options?: Record<string, unknown>;
}

function SocketIOProvider({
  children,
  url = BASE_URL,
  token: defaultToken,
  options = DEFAULT_OPTIONS,
}: SocketIOProviderProps) {
  const token = useSelector(
    (store: RootState) => store?.user?.token || defaultToken
  );
  const loaded = useSelector(
    (store: RootState) => store?.data?.app?.loaded
  );
  const isConference = /\/conference\/\w+/.test(window.location.pathname);
  const ready = useMemo(
    () => (isConference || loaded) && token,
    [loaded, token, isConference]
  );
  const socket = useMemo(() => {
    if (ready && token && options && !socketIO)
      socketIO = io(`${url}?token=${token}`, options);
    return socketIO;
  }, [ready, url, options, token]);

  return <Provider value={socket}>{children}</Provider>;
}

export default React.memo(SocketIOProvider);
