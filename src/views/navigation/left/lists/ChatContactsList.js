import React from 'react';
import { alpha, Divider, List } from '@mui/material';
import ChatContactItem from '../contacts/ChatContactItem'
import useScrollEnd from '../../../../utils/useScrollEnd';
import Box from '../../../../components/Box';
import useShadow from './useShadow';
import scrollBarSx from '../../../../utils/scrollBarSx';


export default function ChatContactsList () {
    const [atEnd, scrollProps] = useScrollEnd();
    const shadow = useShadow();

    return (
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
            {
                contacts.map((contact, index) => (
                    <React.Fragment key={contact._id}>
                        <ChatContactItem {...contact}/>
                        {index !== contacts.length - 1 && 
                        <Divider variant="inset" component="li" />
                        }
                    </React.Fragment>
                ))
            } 
            
            </List>
        </Box>
    );
}

const contacts = [
    {
        name: 'Victor mongolo',
        lastNotice: 'Salut mon frere je suis déjà chez toi',
        avatarSrc: '/',
        _id: 'hxdgshdjghhs2454',
    },
    {
        name: 'Obed Ngolo',
        lastNotice: 'Tu es à la maison ?',
        avatarSrc: '/',
        _id: 'fdfjhdfvhhs2454',
    },
    {
        name: 'Naomi kingale',
        lastNotice: 'Bonjour mon cher !',
        avatarSrc: '/',
        _id: 'fdfjhdfvhhsdfjbf544',
    },
    {
        name: 'Filia Mula',
        lastNotice: 'Ndeko omoni message ya maman ?',
        avatarSrc: '/',
        _id: 'fsdbshdvhsdfj545444',
    },
    {
        name: 'Daniel Mputu',
        lastNotice: 'Je suis pret pour te voir',
        avatarSrc: '/',
        _id: 'fdsjhdgfhgsdvhhsdfjbf565894',
    },
    {
        name: 'Eliel Maboso',
        lastNotice: `Ce soir ci je te partage un document lié à la Dantic`,
        avatarSrc: '/',
        _id: 'wxbvcbfsdysgevhhsd45544',
    },
    {
        name: 'Victor mongolo tanzey fataki',
        lastNotice: 'Salut mon frere je suis déjà chez toi',
        avatarSrc: '/',
        _id: 'hxdgdhwvdshdjghhs2454',
    },
    {
        name: 'Obed Ngolo',
        lastNotice: 'Tu es à la maison ?',
        avatarSrc: '/',
        _id: 'fdfjdjfbjdffvhhs2454',
    },
    {
        name: 'Naomi kingale',
        lastNotice: 'Bonjour mon cher !',
        avatarSrc: '/',
        _id: 'fdfjhdfjhvsdsdfjbf544',
    },
    {
        name: 'Filia Mula',
        lastNotice: 'Ndeko omoni message ya maman ?',
        avatarSrc: '/',
        _id: 'fsdbshjfhbhfdfj545444',
    },
    {
        name: 'Daniel Mputu',
        lastNotice: 'Je suis pret pour te voir',
        avatarSrc: '/',
        _id: 'fdsjhddfddvhhsdfjbf565894',
    },
    {
        name: 'Eliel Maboso',
        lastNotice: `Ce soir ci je te partage un document lié à la Dantic`,
        avatarSrc: '/',
        _id: 'wxbvcbfsdydffvhhsd45544',
    },

]