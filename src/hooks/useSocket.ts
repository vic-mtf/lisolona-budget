import { useContext, createContext } from "react";
import type { Socket } from "socket.io-client";

export const SocketIOContext = createContext<Socket | null>(null);

const useSocket = (): Socket | null => useContext(SocketIOContext);

export default useSocket;
