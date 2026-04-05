import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axiosConfig from '../configs/axios-config.json';
import { SocketIOContext } from '../hooks/useSocket';

const DEFAULT_OPTIONS = { transports: ['websocket'] };
const BASE_URL = axiosConfig.baseURL;

const Provider = SocketIOContext.Provider;
let socketIO = null;

const SocketIOProvider = ({
  children,
  url = BASE_URL,
  token: defaultToken,
  options = DEFAULT_OPTIONS,
}) => {
  const token = useSelector((store) => store?.user?.token || defaultToken);
  const loaded = useSelector((store) => store?.data?.app?.loaded);
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
};

export default React.memo(SocketIOProvider);
