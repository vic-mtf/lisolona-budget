import React, { useCallback, useMemo } from 'react';
import { Divider, List, ListSubheader, Toolbar } from '@mui/material';
import groupArrayInAlphaOrder from '../../../../utils/groupArrayInAlphaOrder';
import { useDispatch } from 'react-redux';
import LoadingList from './LoadingList';
import EmptyContentMessage from './EmptyContentMessage';
import { addData } from '../../../../redux/data';
import InvitationRequestForm from './InvitationRequestForm';
import Lists from './Lists';
import { useLiveQuery } from 'dexie-react-hooks';
import ContactItem from '../items/ContactItem';
import db from '../../../../database/db';

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
                <Lists>
                    <ListItems
                        search={search}
                        contacts={contacts}
                    />
                </Lists>
        </React.Fragment>
    );
}

const ListItems  = ({contacts, search}) => {
    const dispatch = useDispatch();
    const contactsList = useMemo(() => 
        contacts ? groupArrayInAlphaOrder(contacts) : null,
        [contacts]
    );
    

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
                {contactsList?.map(({label, children}) => (
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
                                <React.Fragment key={index}>
                                    <ContactItem 
                                        {...contact}
                                        search={search}
                                        onClick={() => dispatch(addData({
                                            key: 'target', 
                                            data: {
                                                id: contact?.id,
                                                name: contact?.name,
                                                type: 'direct',
                                                avatarSrc: contact?.avatarSrc,
                                                createdAt: contact?.createdAt?.toString(),
                                                updatedAt: contact?.updatedAt?.toString(),
                                            }
                                        }))}
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
        </React.Fragment>
    );
}
