import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axiosConfig from '../configs/axios-config.json';
import { addNotification } from '../redux/data';

const SocketIO = createContext(null);
export const useSocket = () => useContext(SocketIO);

export default function SocketIOProvider ({children}) {
    const [socket, setSocket] = useState(null);
    const token = useSelector(store => store?.user?.token);
    const socketRef = useRef();
    const dispatch = useDispatch();
    
    useEffect(() => {
        const handleConnexion = () => setSocket(socketRef.current);
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
        if(!socket && token){ 
            socketRef.current = io(`${axiosConfig.baseURL}?token=${token}`);
            setSocket(socketRef.current);
        }
        socketRef.current?.on('connexion', handleConnexion);
        socketRef.current?.on('invitations', getInvitaions);
        return () => {
            socketRef.current?.off('connexion', handleConnexion);
            socketRef.current?.off('invitations', getInvitaions);
        }
    },[socket, token]);
   
    return (
        <SocketIO.Provider value={socket}>
          {children}
        </SocketIO.Provider>
    );
}