import { useContext, createContext } from "react";

export const SocketIOContext = createContext(null);

const useSocket = () => useContext(SocketIOContext);
export default useSocket;
