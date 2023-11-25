import  {
    Divider, 
    Toolbar,
    List,
    Checkbox,
    Box as MuiBox,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addData } from '../../../../../redux/data';
import useScrollEnd from '../../../../../utils/useScrollEnd';
import SearchBar from '../../SearchBar';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import IconButton from '../../../../../components/IconButton';
import LoadingList from '../LoadingList';
import EmptyContentMessage from '../EmptyContentMessage';
import useShadow from '../../../../../utils/useShadow';
import ContactItem from '../../items/ContactItem';
import db from '../../../../../database/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { escapeRegExp } from 'lodash';

export default function ContactsList ({
    mode, 
    itemListRef, 
    handleAllowNext,
    onClose,
    search,
}) {
    const filterByKey = useCallback(key => 
        new RegExp(
            escapeRegExp(search?.trim().split(/\s/).join('|')),
            'ig',
        ).test(key),
    [search]);

    const contacts = useLiveQuery(() => 
       db?.contacts.orderBy('name')
       .filter(({name, email}) => 
            filterByKey(name) || filterByKey(email)
        ).reverse()
        .toArray()
    ,[filterByKey]);
    
    const shadow = useShadow();
    const [itemsSelected, setItemsSelected] = useState(itemListRef?.current);
    const [atEnd, scrollProps] = useScrollEnd();

    const dispatch = useDispatch();
    const handleOpenChat = contact => () => {
            dispatch(addData({key: 'targetId', data: contact.id}));
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

    return (
            <React.Fragment>
                <Toolbar variant="dense" disableGutters>
                    <SearchBar/>
                    <IconButton
                        disabled
                    >
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
                        }}
                    >
                        {contacts?.map((contact, index, contacts) => (
                            <React.Fragment key={contact.id}>
                                <ContactItem
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
