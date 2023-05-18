import React, { useEffect, useState } from 'react';
import { Divider, List, ListSubheader,  Toolbar } from '@mui/material';
import useScrollEnd from '../../../../utils/useScrollEnd';
import Box from '../../../../components/Box';
import Button from '../../../../components/Button';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import useShadow from './useShadow';
import IconButton from '../../../../components/IconButton';
import Typography from '../../../../components/Typography';
import InviteContactItem from '../items/InviteContactItem';
import timeHumanReadable from '../../../../utils/timeHumanReadable';
import scrollBarSx from '../../../../utils/scrollBarSx';
import LoadingList from './LoadingList';
import EmptyContentMessage from './EmptyContentMessage';
import {  useSelector } from 'react-redux';
import { useSocket } from '../../../../utils/SocketIOProvider';
import { union } from 'lodash';

export default function NotificationList ({search, navigation}) {
    const [atEnd, scrollProps] = useScrollEnd();
    const [currentList, setCurrentList] = useState(null);
    const shadow = useShadow();
    const socket = useSocket();
    const notifications = useSelector(store => store?.data?.notifications);
    const items = [
        InviteContactItem,
    ];
    
    return ( navigation === 3 &&
        <React.Fragment>
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
                    <LoadingList 
                        loading={notifications === null} 
                        lengthItem={9}
                    />
                    <EmptyContentMessage
                        title="Aucune nouvelle notification"
                        show={union(
                            ...(notifications || [])?.map(
                                ({children}) => [...children]
                            ))?.length === 0
                        }
                        description={`
                            Les alertes apparaissent pour vous informer 
                            d'une nouvelle activité.`
                        }
                    />
                {!currentList ? 
                    <MultiList 
                        list={notifications}
                        setCurrentList={setCurrentList}
                        items={items}
                    /> : 
                    <MonoList
                        {...currentList}
                        Item={items[currentList?.indexItem]}
                    />
                }
                </List>
                
            </Box>
        </React.Fragment>
    );
}

const MultiList = ({list, setCurrentList, items}) => (
    list?.map(({
        label, 
        children, 
        id, 
        indexItem,

    }) => !!children?.length && (
        <li key={id}>
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
                children?.slice(0, 3).map((contact, index, contacts) => {
                    const Item = items[indexItem];
                    return(
                        <React.Fragment key={contact.id}>
                            <Item {...contact} date={timeHumanReadable(contact?.date)}/>
                            {index !== contacts.length - 1 ? 
                            <Divider variant="inset" component="li" /> : 
                            contacts?.length > 4 &&
                            <Button 
                                LinkComponent="li"
                                sx={{mx: 2}}
                                onClick={() => setCurrentList({label, children, Item, indexItem})}
                            >Voir plus... </Button>
                            }
                        </React.Fragment>
                    )
                })
                }
            </List>
        </li>
)))

const MonoList = ({children, Item}) => (
    children.map((contact, index, contacts) => {
       return (
            <React.Fragment key={contact.id}>
                <Item {...contact} date={timeHumanReadable(contact?.date)}/>
                {index !== contacts.length - 1 && 
                <Divider variant="inset" component="li" /> 
                }
            </React.Fragment>
        )
}))

// const contacts = [
//     {
//         name: 'Victor mongolo',
//         email: 'Phalphie1@gmail.com',
//         avatarSrc: '/',
//         _id: 'hxdgshdjghhs2454',
//     },
//     {
//         name: 'Obed Ngolo',
//         email: 'obedngolo@gmail.com',
//         avatarSrc: '/',
//         _id: 'fdfjhdfvhhs2454',
//     },
//     {
//         name: 'Naomi kingale',
//         email: 'naomikingale@outlook.com',
//         avatarSrc: '/',
//         _id: 'fdfjhdfvhhsdfjbf544',
//     },
//     {
//         name: 'Filia Mula',
//         email: 'filiamula@outlook.fr',
//         avatarSrc: '/',
//         _id: 'fsdbshdvhsdfj545444',
//     },
//     {
//         name: 'Daniel Mputu',
//         email: 'danielm45@yahoo.fr',
//         avatarSrc: '/',
//         _id: 'fdsjhdgfhgsdvhhsdfjbf565894',
//     },
//     {
//         name: 'Eliel Maboso',
//         email: 'elielmaboso34@gmail.com',
//         avatarSrc: '/',
//         _id: 'wxbvcbfsdysgevhhsd45544',
//     },
//     {
//         name: 'Victor mongolo tanzey fataki',
//         email: 'tanzeyfataki@outlook.fr',
//         avatarSrc: '/',
//         _id: 'hxdgdhwvdshdjghhs2454',
//     },
//     {
//         name: 'Thoma mukendi',
//         email: 'thomamukendiyahoo.com',
//         avatarSrc: '/',
//         _id: 'fdfjdjfbjdffvhhs2454',
//     },
//     {
//         name: 'Aline kizanga',
//         email: 'alinekizanga53@gmail.com',
//         avatarSrc: '/',
//         _id: 'fdfjhdfjhvsdsdfjbf544',
//     },
//     {
//         name: 'Fifi Kasongo',
//         email: 'fifi@Kasongo.com',
//         avatarSrc: '/',
//         _id: 'fsdbshjfhbhfdfj545444',
//     },
//     {
//         name: 'Rosie Masita',
//         email: 'rosie@yahoo.fr',
//         avatarSrc: '/',
//         _id: 'fdsjhddfddvhhsdfjbf565894',
//     },
//     {
//         name: 'George Ngambale',
//         email: `phalphe15@gmail.com`,
//         avatarSrc: '/',
//         _id: 'wxbvcbfsdydffvhhsd45544',
//     },

// ];

// const notifications = [
//     {
//         label: 'Invitations',
//         children: contacts,
//         _id: '_invite',
//         Item: InviteContactItem,
//     },
//     {
//         label: 'Annonces',
//         children: [],
//         _id: '_notice',
//         Item: RelatedContactItem,
//     },
// ];