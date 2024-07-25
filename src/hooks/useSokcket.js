import { SocketIOContext } from "../utils/SocketIOProvider";
export default function useSocket() {
  const context = React.useContext(SocketIOContext);
  return context;
}
