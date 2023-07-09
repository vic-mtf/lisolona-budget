import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axiosConfig from '../configs/axios-config.json';
import { addNotification } from '../redux/data';

const SocketIO = createContext(null);
export const useSocket = () => useContext(SocketIO);
const defaultOptions = {
    transports: ['websocket'],
};

const openerSocket = window.openerSocket;

export default function SocketIOProvider ({children, url, token, options}) {
    const defaultToken = useSelector(store => store?.user?.token);
    const dispatch = useDispatch();
    
    const socket = useMemo(() => {
        const tk = token || defaultToken;
        const baseURL = url || axiosConfig.baseURL;
        if(openerSocket) 
            return openerSocket
        else 
            return tk ? io(`${baseURL}?token=${tk}`, options || defaultOptions) : null
    }, [token, url, defaultToken, options]);

    useEffect(() => {
        const getInvitaions = ({invitations}) => {
            const data = {
                indexItem: 0,
                label: 'Invitations',
                id: '_invitations',
                children: invitations?.map(invitation => {
                    const {fname, lname, mname} = {
                        fname: '', lname: '', mname: '',
                        ...invitation.from
                    };
                    const name = `${fname} ${lname} ${mname}`.trim() || 'Moi';
                    return {
                        origin: invitation,
                        avatarSrc: invitation?.from?.image, 
                        name, 
                        email: invitation?.from?.email, 
                        date: invitation?.updatedAt,
                        id: invitation._id
                    }
                }),
            };
            dispatch(addNotification({data}));
        };
        if(!openerSocket)
            socket?.on('invitations', getInvitaions);
        return () => {
            socket?.off('invitations', getInvitaions);
        }
    },[socket, token, dispatch]);
   
    return (
        <SocketIO.Provider value={openerSocket || socket}>
          {children}
        </SocketIO.Provider>
    );
}