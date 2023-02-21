import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import queryString from 'query-string';
import axiosConfig from '../configs/axios-config.json';

const SocketIO = createContext(null);
export const useSocket = () => useContext(SocketIO);

export default function SocketIOProvider ({children}) {
    const [socket, setSocket] = useState(null);
    const token = useSelector(() => store => store?.user?.token);

    const _io = useMemo(() => {
        const url = queryString.stringify({token});
        return io(`${axiosConfig.baseURL}${url}`);
    },[token]);

    useEffect(() => {
        if(!socket && token);
            
            //setSocket(_io);
    }, [socket, token, _io]);

    return (
        <SocketIO.Provider value={socket}>
          {children}
        </SocketIO.Provider>
    );
}