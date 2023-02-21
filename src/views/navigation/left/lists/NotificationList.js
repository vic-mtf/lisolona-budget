import React, { useState } from 'react';
import { alpha, Divider, List, ListSubheader, Stack, Toolbar } from '@mui/material';
import useScrollEnd from '../../../../utils/useScrollEnd';
import Box from '../../../../components/Box';
import Button from '../../../../components/Button';
import RelatedContactItem from '../contacts/RelatedContactItem';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
//import groupArrayInAlphaOrder from '../../../../utils/groupArrayInAlphaOrder';
import useShadow from './useShadow';
import IconButton from '../../../../components/IconButton';
import Typography from '../../../../components/Typography';
import InviteContactItem from '../contacts/InviteContactItem';
import timeHumanReadable from '../../../../utils/timeHumanReadable';
import scrollBarSx from '../../../../utils/scrollBarSx';

export default function NotificationList () {
    const [atEnd, scrollProps] = useScrollEnd();
    const [currentList, setCurrentList] = useState(null);
    const shadow = useShadow();

    return (
        <React.Fragment>
           
            <Toolbar variant="dense">
                <Button 
                    children="Inviter un contact" 
                    variant="outlined"
                    color="inherit"
                    sx={{mx: 'auto'}}
                    startIcon={<PersonAddAlt1OutlinedIcon/>}
                />
            </Toolbar>
             {currentList && 
                <Toolbar variant="dense" disableGutters sx={{mx: 1}}>
                    <IconButton onClick={() => setCurrentList(null)} >
                        <KeyboardBackspaceOutlinedIcon fontSize="small" />
                    </IconButton>
                    <Typography 
                        ml={2}
                        flexGrow={1}
                        variant="body1"
                        fontWeight="bold"
                        color="text.secondary"
                        children={currentList?.label}
                    />
                </Toolbar>
            }
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
                {!currentList ? 
                    <MultiList 
                        list={notifications}
                        setCurrentList={setCurrentList}
                    /> : 
                    <MonoList
                        {...currentList}
                    />
               
                }
                </List>
            </Box>
        </React.Fragment>
    );
}

const MultiList = ({list, setCurrentList}) => (
    list?.map(({label, children, _id, Item}) => !!children?.length && (
        <li key={_id}>
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
                children?.slice(0, 3).map((contact, index, contacts) => (
                    <React.Fragment key={contact._id}>
                        <Item {...contact} date={timeHumanReadable(Date.now() - 24 * 60 * 60 * 100 * Math.random() * 60, true )}/>
                        {index !== contacts.length - 1 ? 
                        <Divider variant="inset" component="li" /> : 
                        <Button 
                            LinkComponent="li"
                            sx={{mx: 2}}
                            onClick={() => setCurrentList({label, children, Item})}
                        >Voir plus... </Button>
                        }
                    </React.Fragment>
                ))
                }
            </List>
        </li>
)))

const MonoList = ({children, Item}) => (
    children.map((contact, index, contacts) => (
        <React.Fragment key={contact._id}>
            <Item {...contact}/>
            {index !== contacts.length - 1 && 
            <Divider variant="inset" component="li" /> 
            }
        </React.Fragment>
)))

const contacts = [
    {
        name: 'Victor mongolo',
        email: 'Phalphie1@gmail.com',
        avatarSrc: '/',
        _id: 'hxdgshdjghhs2454',
    },
    {
        name: 'Obed Ngolo',
        email: 'obedngolo@gmail.com',
        avatarSrc: '/',
        _id: 'fdfjhdfvhhs2454',
    },
    {
        name: 'Naomi kingale',
        email: 'naomikingale@outlook.com',
        avatarSrc: '/',
        _id: 'fdfjhdfvhhsdfjbf544',
    },
    {
        name: 'Filia Mula',
        email: 'filiamula@outlook.fr',
        avatarSrc: '/',
        _id: 'fsdbshdvhsdfj545444',
    },
    {
        name: 'Daniel Mputu',
        email: 'danielm45@yahoo.fr',
        avatarSrc: '/',
        _id: 'fdsjhdgfhgsdvhhsdfjbf565894',
    },
    {
        name: 'Eliel Maboso',
        email: 'elielmaboso34@gmail.com',
        avatarSrc: '/',
        _id: 'wxbvcbfsdysgevhhsd45544',
    },
    {
        name: 'Victor mongolo tanzey fataki',
        email: 'tanzeyfataki@outlook.fr',
        avatarSrc: '/',
        _id: 'hxdgdhwvdshdjghhs2454',
    },
    {
        name: 'Thoma mukendi',
        email: 'thomamukendiyahoo.com',
        avatarSrc: '/',
        _id: 'fdfjdjfbjdffvhhs2454',
    },
    {
        name: 'Aline kizanga',
        email: 'alinekizanga53@gmail.com',
        avatarSrc: '/',
        _id: 'fdfjhdfjhvsdsdfjbf544',
    },
    {
        name: 'Fifi Kasongo',
        email: 'fifi@Kasongo.com',
        avatarSrc: '/',
        _id: 'fsdbshjfhbhfdfj545444',
    },
    {
        name: 'Rosie Masita',
        email: 'rosie@yahoo.fr',
        avatarSrc: '/',
        _id: 'fdsjhddfddvhhsdfjbf565894',
    },
    {
        name: 'George Ngambale',
        email: `phalphe15@gmail.com`,
        avatarSrc: '/',
        _id: 'wxbvcbfsdydffvhhsd45544',
    },

];

const notifications = [
    {
        label: 'Invitations',
        children: contacts,
        _id: '_invite',
        Item: InviteContactItem,
    },
    {
        label: 'Annonces',
        children: [],
        _id: '_notice',
        Item: RelatedContactItem,
    },
];