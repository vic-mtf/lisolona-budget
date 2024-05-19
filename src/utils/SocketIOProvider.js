import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axiosConfig from '../configs/axios-config.json';
import { addNotification } from '../redux/data';
import getFullName from './getFullName';

const SocketIO = createContext(null);
export const useSocket = () => useContext(SocketIO);

const defaultOptions = { transports: ['websocket'], };
const openerSocket = window.openerSocket;

export default function SocketIOProvider ({ children, url, token, options = defaultOptions }) {
    const defaultToken = useSelector(store => store?.user?.token);
    const dispatch = useDispatch();
    
    const socket = useMemo(() => {
        const tk = token || defaultToken;
        const baseURL = url || axiosConfig.baseURL;
        if(openerSocket) return openerSocket
        else return tk ? io(`${baseURL}?token=${tk}`, options) : null
    }, [token, url, defaultToken, options]);

    useEffect(() => {
        const getInvitations = ({ invitations }) => {
            const data = {
                indexItem: 0,
                label: 'Invitations',
                id: '_invitations',
                children: invitations?.map(invitation => {
                    const target = invitation?.from;
                    const name = getFullName(target) || 'Moi';
                    return {
                        origin: invitation,
                        avatarSrc: invitation?.from?.image, 
                        name, 
                        email: invitation?.from?.email, 
                        date: invitation?.updatedAt,
                        id: invitation?._id
                    }
                }),
            };
            dispatch(addNotification({data}));
        };
        if(!openerSocket) socket?.on('invitations', getInvitations);
        return () => {
            socket?.off('invitations', getInvitations);
        }
    },[socket, token, dispatch]);
   
    return (<SocketIO.Provider value={socket}>{children}</SocketIO.Provider>);
}