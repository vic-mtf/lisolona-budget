import { useContext } from "react";
import { SocketIOContext } from "../components/SocketIOProvider";

const useSocket = () => useContext(SocketIOContext);
export default useSocket;
