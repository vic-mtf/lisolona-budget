import  {
    Divider, 
    Toolbar,
    List,
    Checkbox,
    Box as MuiBox,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../../../../utils/SocketIOProvider';
import { addData } from '../../../../../redux/data';
import RelatedContactItem from '../../contacts/RelatedContactItem';
import useScrollEnd from '../../../../../utils/useScrollEnd';
import scrollBarSx from '../../../../../utils/scrollBarSx';
import SearchBar from '../../SearchBar';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import IconButton from '../../../../../components/IconButton';
import LoadingList from '../LoadingList';
import EmptyContentMessage from '../EmptyContentMessage';
import useShadow from '../useShadow';

export default function ContactsList ({
    mode, 
    itemListRef, 
    handleAllowNext,
    onClose,
}) {
    const { contacts, conversations } = useSelector(store => {
        const search = store.data?.search;
        const contacts = store?.data?.contacts?.filter(
            ({name, email}) => 
                new RegExp(search,'ig').test(name) || 
                new RegExp(search,'ig').test(email)
        );
        const conversations = store?.data?.conversations
        return {contacts, conversations}
    });
    const shadow = useShadow();
    const [itemsSelected, setItemsSelected] = useState(itemListRef?.current);
    const [atEnd, scrollProps] = useScrollEnd();
    const socket = useSocket();
    const dispatch = useDispatch();
    const handleOpenChat = contact => () => {
            dispatch(addData({key: 'chatId', data: contact.id}));
            if(typeof onClose === 'function')
                onClose();
    };

    const handleSelected = contact => () => {
        setItemsSelected(
            _items => {
                const items = _items.find(item => item.id === contact.id) ?
                _items.filter(item => item.id !== contact.id) :
                [..._items, contact];
                handleAllowNext(!!items?.length);
                if(itemListRef?.current)
                    itemListRef.current = items;
                return items;
            }
        )
    };

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
        if(contacts === null)
            socket?.emit('contacts');
    }, [socket]);

    return (
            <React.Fragment>
                <Toolbar variant="dense" disableGutters>
                    <SearchBar/>
                    <IconButton>
                        <FilterListOutlinedIcon fontSize="small"/>
                    </IconButton>
                </Toolbar>
                <MuiBox
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
                            height: 276,
                            width: 'auto',
                            ...scrollBarSx,
                        }}
                    >
                        {contacts?.map((contact, index, contacts) => (
                            <React.Fragment key={contact.id}>
                                <RelatedContactItem 
                                    {...contact}
                                    selected={
                                        Boolean(
                                        itemsSelected.find(
                                            item => item.id === contact.id
                                            )
                                        )
                                    }
                                    onClick={
                                        mode === 'contact' ?
                                        handleOpenChat(contact):
                                        handleSelected(contact)
                                    }
                                    action={ 
                                        mode !== "contact" &&
                                        <Checkbox
                                            size="small"
                                            onChange={handleSelected(contact)}
                                            checked={Boolean(
                                                itemsSelected.find(
                                                    item => item.id === contact.id
                                                    )
                                                )}
                                        />
                                    }
                                />
                                {index !== contacts.length - 1 && 
                                <Divider variant="inset" component="li" />
                                }
                            </React.Fragment>
                        ))}

                        <LoadingList loading={contacts === null} lengthItem={5} />
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
                        
                    </List>
                </MuiBox>
            </React.Fragment>
    );
}
