import React, { useState } from 'react';
import { Divider, List, ListSubheader,  Toolbar } from '@mui/material';
import useScrollEnd from '../../../../utils/useScrollEnd';
import Box from '../../../../components/Box';
import Button from '../../../../components/Button';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import useShadow from '../../../../utils/useShadow';
import IconButton from '../../../../components/IconButton';
import Typography from '../../../../components/Typography';
import InviteContactItem from '../items/InviteContactItem';
import timeHumanReadable from '../../../../utils/timeHumanReadable';
import LoadingList from './LoadingList';
import EmptyContentMessage from './EmptyContentMessage';
import {  useSelector } from 'react-redux';
import { union } from 'lodash';

export default function NotificationList ({search, navigation}) {
    const [atEnd, scrollProps] = useScrollEnd();
    const [currentList, setCurrentList] = useState(null);
    const shadow = useShadow();
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
                {Boolean(notifications?.length) && 
                <List
                    dense
                    {...scrollProps}
                    subheader={<li/>}
                    sx={{
                        overflow: 'auto',
                        height: "100%",
                        width: 'auto',
                        '& ul': { padding: 0 },
                    }}
                > 
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
                </List>}
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
            </Box>
        </React.Fragment>
    );
}

const MultiList = ({list, setCurrentList, items}) => (
    list?.map(({label, children, id, indexItem}) => Boolean(children?.length) && (
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
