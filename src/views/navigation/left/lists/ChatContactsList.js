import React, { useEffect } from 'react';
import { 
    Divider, 
    List,
    Toolbar
} from '@mui/material';
import ChatContactItem from '../contacts/ChatContactItem'
import useScrollEnd from '../../../../utils/useScrollEnd';
import Box from '../../../../components/Box';
import useShadow from './useShadow';
import scrollBarSx from '../../../../utils/scrollBarSx';
import { useDispatch, useSelector } from 'react-redux';
import LoadingList from './LoadingList';
import EmptyContentMessage from './EmptyContentMessage';
import { useSocket } from '../../../../utils/SocketIOProvider';
import { addData } from '../../../../redux/data';
import ContactListForm from './contactslistform/ContactListForm';

export default function ChatContactsList () {
    const [atEnd, scrollProps] = useScrollEnd();
    const shadow = useShadow();
    const socket = useSocket();
    const dispatch = useDispatch();
    const { conversations, user} = useSelector(store => { 
        const conversations = store.data?.conversations;
        const search = store.data?.search;
        return {
            conversations: conversations && [...conversations].sort(
                (a, b) => 
                    (new Date(b?.updatedAt)).getTime() - 
                    (new Date(a?.updatedAt)).getTime()
            ).filter(({name}) => new RegExp(search,'ig').test(name)),
            user: store.user,
        }
        
    });

    return (
        <React.Fragment>
            <Toolbar variant="dense">
                <ContactListForm/>
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
                    sx={{
                        overflow: 'auto',
                        height: "100%",
                        width: 'auto',
                        ...scrollBarSx,
                    }}
                > 
                <LoadingList loading={conversations === null}/>
                <EmptyContentMessage
                    title="Aucune discussion trouvée"
                    show={conversations?.length === 0}
                    description={`Commencer une nouvelle discuction avec un contact.`}
                />
                {
                    conversations?.map((contact, index, contacts) => (
                        <React.Fragment key={contact.id}>
                            <ChatContactItem 
                                {...contact}
                                onClick={() => dispatch(
                                    addData({
                                        key: 'chatId', 
                                        data: contact.id
                                    })
                                )}
                            />
                            {index !== contacts.length - 1 && 
                            <Divider variant="inset" component="li" />
                            }
                        </React.Fragment>
                    ))
                } 
                    
                </List>
            </Box>
        </React.Fragment>
    );
}