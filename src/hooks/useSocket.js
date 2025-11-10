import { useContext, createContext } from 'react';

export const SocketIOContext = createContext(null);
/**
 *
 * @returns {import('socket.io-client').Socket | null}
 */
const useSocket = () => useContext(SocketIOContext);
export default useSocket;
