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
        return {
            conversations: [...store.data?.conversations].sort(
                (a, b) => 
                    (new Date(b?.updatedAt)).getTime() - 
                    (new Date(a?.updatedAt)).getTime()
            ),
            user: store.user,
        }
        
    });

    useEffect(() => {
        const handelGetChat = ({chats}) => {
            const data = getParseData(chats, user);
            dispatch(addData({
                key: 'data',
                data: {
                    conversations: data,
                    chatGroups: chats?.filter(chatGroup => 
                        chatGroup?.type === 'room'
                    ),
                }
            }))
        };
        socket?.on('chats', handelGetChat);
       // if(conversations === null) 
        socket?.emit('direct-chat');
        return () => {
            socket?.off('chats', handelGetChat);
        };
    }, [socket]);

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

const getParseData = (_data, user) => {
    const data = _data?.map((chat, index, chats) => {
        const interlocutor = chat.members.find(
            ({_id: interlocutor}) => interlocutor._id !== user?.id
        )?._id;
        const {fname, lname, mname} = interlocutor || {};
        const name = chat?.name || interlocutor ? 
        `${fname} ${lname} ${mname}`.trim() : 'Moi';
        const lastNotice = [
            {
            content: chat.type === 'room' && 
            `Vous êtes dans un nouveau Lisanga`
            },
            ...chat?.messages
        ]?.find((message, index, messages) => 
            index === messages.length - 1
        )?.content;
        
        return  {
            origin: chat,
            id: chat?._id,
            type: chat?.type,
            lastNotice,
            updatedAt: chat?.updatedAt,
            name,
            avatarSrc: chat?.image,
            online: false,
            interlocutorId: interlocutor?._id,
        }
    });
    return data
}
// const contacts = [
//     {
//         name: 'Victor mongolo',
//         lastNotice: 'Salut mon frere je suis déjà chez toi',
//         avatarSrc: '/',
//         _id: 'hxdgshdjghhs2454',
//     },
//     {
//         name: 'Obed Ngolo',
//         lastNotice: 'Tu es à la maison ?',
//         avatarSrc: '/',
//         _id: 'fdfjhdfvhhs2454',
//     },
//     {
//         name: 'Naomi kingale',
//         lastNotice: 'Bonjour mon cher !',
//         avatarSrc: '/',
//         _id: 'fdfjhdfvhhsdfjbf544',
//     },
//     {
//         name: 'Filia Mula',
//         lastNotice: 'Ndeko omoni message ya maman ?',
//         avatarSrc: '/',
//         _id: 'fsdbshdvhsdfj545444',
//     },
//     {
//         name: 'Daniel Mputu',
//         lastNotice: 'Je suis pret pour te voir',
//         avatarSrc: '/',
//         _id: 'fdsjhdgfhgsdvhhsdfjbf565894',
//     },
//     {
//         name: 'Eliel Maboso',
//         lastNotice: `Ce soir ci je te partage un document lié à la Dantic`,
//         avatarSrc: '/',
//         _id: 'wxbvcbfsdysgevhhsd45544',
//     },
//     {
//         name: 'Victor mongolo tanzey fataki',
//         lastNotice: 'Salut mon frere je suis déjà chez toi',
//         avatarSrc: '/',
//         _id: 'hxdgdhwvdshdjghhs2454',
//     },
//     {
//         name: 'Obed Ngolo',
//         lastNotice: 'Tu es à la maison ?',
//         avatarSrc: '/',
//         _id: 'fdfjdjfbjdffvhhs2454',
//     },
//     {
//         name: 'Naomi kingale',
//         lastNotice: 'Bonjour mon cher !',
//         avatarSrc: '/',
//         _id: 'fdfjhdfjhvsdsdfjbf544',
//     },
//     {
//         name: 'Filia Mula',
//         lastNotice: 'Ndeko omoni message ya maman ?',
//         avatarSrc: '/',
//         _id: 'fsdbshjfhbhfdfj545444',
//     },
//     {
//         name: 'Daniel Mputu',
//         lastNotice: 'Je suis pret pour te voir',
//         avatarSrc: '/',
//         _id: 'fdsjhddfddvhhsdfjbf565894',
//     },
//     {
//         name: 'Eliel Maboso',
//         lastNotice: `Ce soir ci je te partage un document lié à la Dantic`,
//         avatarSrc: '/',
//         _id: 'wxbvcbfsdydffvhhsd45544',
//     },

// ]