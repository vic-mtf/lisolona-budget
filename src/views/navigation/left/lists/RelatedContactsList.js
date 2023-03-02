import React, { useEffect } from 'react';
import { Divider, List, ListSubheader, Toolbar } from '@mui/material';
import useScrollEnd from '../../../../utils/useScrollEnd';
import Box from '../../../../components/Box';
import RelatedContactItem from '../contacts/RelatedContactItem';
import groupArrayInAlphaOrder from '../../../../utils/groupArrayInAlphaOrder';
import useShadow from './useShadow';
import scrollBarSx from '../../../../utils/scrollBarSx';
import { useDispatch, useSelector } from 'react-redux';
import LoadingList from './LoadingList';
import EmptyContentMessage from './EmptyContentMessage';
import { useSocket } from '../../../../utils/SocketIOProvider';
import { addData } from '../../../../redux/data';
import InvitationRequestForm from './InvitationRequestForm';

export default function RelatedContactsList () {
    const [atEnd, scrollProps] = useScrollEnd();
    const socket = useSocket();
    const shadow = useShadow();
    const { contacts, conversations } = useSelector(store => {
        const contacts = store?.data?.contacts ?
        groupArrayInAlphaOrder(store?.data?.contacts) : 
        null;
        const conversations = store?.data?.conversations
        return {contacts, conversations}
    });
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('contacts', ({contacts}) => {
            const data = contacts?.map(contact => {
                const name = `${contact.fname} ${contact.lname} ${contact.mname}`.trim()
                return {
                    origin: contact,
                    name,
                    email: contact?.email,
                    id: contact?._id,
                };
            });
            dispatch(addData({key: 'contacts', data}));
        });
        //if(contacts === null)
        socket?.emit('contacts');
    },[socket]);
    
    return (
        <React.Fragment>
            <Toolbar variant="dense">
                <InvitationRequestForm/>
            </Toolbar>
            <Box 
                overflow="hidden" 
                sx={{
                    boxShadow: atEnd ? 0 : shadow,
                    transition: "box-shadow 0.2s",
                }}
            >
                <List
                    dense
                    {...scrollProps}
                    subheader={<li/>}
                    sx={{
                        overflow: 'auto',
                        height: "100%",
                        width: 'auto',
                        '& ul': { padding: 0 },
                        ...scrollBarSx,
                    }}
                >
                    <LoadingList loading={contacts === null} />
                    <EmptyContentMessage
                        title="Aucun contact trouvé"
                        show={contacts?.length === 0}
                        description={`
                            Découvrez comment collaborer avec vos 
                            interlocuteurs en recevant ou en invitant vos 
                            collaborateurs sur la plateforme GEID via 
                            une adresse e-mail.`
                        }
                    />
                {contacts?.map(({label, children}) => (
                    <li key={label}>
                        <List dense>
                            <ListSubheader 
                                sx={{
                                    bgcolor: 'transparent', 
                                    position: 'static',
                                    fontWeight: 'bold'
                                }}
                            >
                               {label}
                            </ListSubheader>
                            {
                            children.map((contact, index, contacts) => (
                                <React.Fragment key={contact.id}>
                                    <RelatedContactItem 
                                        {...contact}
                                        onClick={() => {
                                            const id = conversations?.filter(({type}) => type === 'direct')
                                            .find(({interlocutorId}) => interlocutorId === contact.id)?.id;
                                            dispatch(addData({key: 'chatId', data: id || contact.id}))
                                        }}
                                    />
                                    {index !== contacts.length - 1 && 
                                    <Divider variant="inset" component="li" />
                                    }
                                </React.Fragment>
                            ))
                            }
                        </List>
                    </li>
                ))}
                </List>
            </Box>
        </React.Fragment>
    );
}
