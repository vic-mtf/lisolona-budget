import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axiosConfig from '../configs/axios-config.json';
import { addNotification } from '../redux/data';

const SocketIO = createContext(null);
export const useSocket = () => useContext(SocketIO);

export default function SocketIOProvider ({children}) {
    const token = useSelector(store => store?.user?.token);
    const dispatch = useDispatch();
    const socket = useMemo(() => token ? 
        io(`${axiosConfig.baseURL}?token=${token}`) : null, 
        [token]
    );
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
        socket?.on('invitations', getInvitaions);
        return () => {
            socket?.off('invitations', getInvitaions);
        }
    },[socket, token, dispatch]);
   
    return (
        <SocketIO.Provider value={socket}>
          {children}
        </SocketIO.Provider>
    );
}