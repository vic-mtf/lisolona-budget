import React, { useCallback, useMemo } from 'react';
import { Divider, List, ListSubheader, Toolbar } from '@mui/material';
import groupArrayInAlphaOrder from '../../../../utils/groupArrayInAlphaOrder';
import { useDispatch } from 'react-redux';
import LoadingList from './LoadingList';
import EmptyContentMessage from './EmptyContentMessage';
import { addData } from '../../../../redux/data';
import InvitationRequestForm from './InvitationRequestForm';
import { useLiveQuery } from 'dexie-react-hooks';
import ContactItem from '../items/ContactItem';
import db from '../../../../database/db';
import CustomList from './CustomList';

export default function ContactList ({search, navigation}) {
    const filterByKey = useCallback(key =>  new RegExp(
        search.trim().split(/\s/).join('|'),
            'ig'
        ).test(key),
    [search]);
    
    const contacts = useLiveQuery(() => 
       db?.contacts.orderBy('name')
       .filter(({name, email}) => 
            filterByKey(name) || filterByKey(email)
        ).reverse()
        .toArray()
    ,[filterByKey]);

    return ( navigation === 2 &&
        <React.Fragment>
            <Toolbar variant="dense">
                <InvitationRequestForm/>
            </Toolbar>
            <ListItems
                search={search}
                contacts={contacts}
            />
        </React.Fragment>
    );
}

const ListItems  = ({contacts, search}) => {
    const dispatch = useDispatch();

    const contactsList = useMemo(() => { 
       return contacts ? groupArrayInAlphaOrder(contacts) : null;
    },[contacts]);

    const handleClickContact = useCallback(contact => {
        dispatch(addData({
            key: 'target', 
            data: {
                id: contact?.id,
                name: contact?.name,
                type: 'direct',
                avatarSrc: contact?.avatarSrc,
                createdAt: contact?.createdAt?.toString(),
                updatedAt: contact?.updatedAt?.toString(),
            }
        }));
    },[dispatch]);

    const rowRenderer = ({index, style}) => {
        const {label, children} = contactsList[index];
        return (
          <div style={style} >
            <ListSubheader
                sx={{
                    fontWeight: 'bold',
                    height: 50,
                    top: 0,
                    position: 'sticky',
                    zIndex: 2,
                    background: theme => `linear-gradient(transparent 0%, ${theme.palette.background.paper} 100%)`,
                    backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                }}
            >
                {label}
            </ListSubheader>
            {
                children?.map((contact, index, contacts) => (
                    <React.Fragment key={index}>
                        <ContactItem 
                            {...contact}
                            search={search}
                            onClick={() => handleClickContact(contact)}
                        />
                        {contacts.length - 1 !== index && 
                        <Divider variant="inset" component="div" />}
                    </React.Fragment>
                ))
            }
          </div>
        );
    };

    const getItemSize = (index) => {
        const contact = contactsList[index];
        return 50 + (contact?.children?.length * 70)
    }

    return (
        <React.Fragment>
            <LoadingList loading={contactsList === null} />
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
                {Boolean(contactsList?.length) && 
                 <CustomList
                    itemCount={contactsList?.length}
                    rowRenderer={rowRenderer}
                    getItemSize={getItemSize}
                    overscanCount={10}
                 />
                }
        </React.Fragment>
    );
}
