import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import axiosConfig from "../configs/axios-config.json";
import { addNotification } from "../redux/data";
import getFullName from "./getFullName";

const DEFAULT_OPTIONS = { transports: ["websocket"] };
const OPENER_SOCKET = window.openerSocket;
const BASE_URL = axiosConfig.baseURL;

export default function SocketIOProvider({
  children,
  url = BASE_URL,
  token: defaultToken,
  options = DEFAULT_OPTIONS,
}) {
  const token = useSelector((store) => store?.user?.token || defaultToken);
  const dispatch = useDispatch();

  const socket = useMemo(
    () =>
      OPENER_SOCKET || (token ? io(`${url}?token=${token}`, options) : null),
    [token, url, options]
  );

  useEffect(() => {
    const getInvitations = ({ invitations }) => {
      const data = {
        indexItem: 0,
        label: "Invitations",
        id: "_invitations",
        children: invitations?.map((invitation) => {
          const target = invitation?.from;
          const name = getFullName(target) || "Moi";
          return {
            origin: invitation,
            avatarSrc: invitation?.from?.image,
            name,
            email: invitation?.from?.email,
            date: invitation?.updatedAt,
            id: invitation?._id,
          };
        }),
      };
      dispatch(addNotification({ data }));
    };
    socket?.on("invitations", getInvitations);
    return () => {
      socket?.off("invitations", getInvitations);
    };
  }, [socket, token, dispatch]);

  return (
    <SocketIOContext.Provider value={socket}>
      {children}
    </SocketIOContext.Provider>
  );
}

export const SocketIOContext = createContext(null);
export const useSocket = () => useContext(SocketIOContext);
