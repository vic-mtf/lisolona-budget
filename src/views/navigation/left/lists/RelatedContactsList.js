import React from 'react';
import { alpha, Divider, List, ListSubheader, Toolbar } from '@mui/material';
import useScrollEnd from '../../../../utils/useScrollEnd';
import Box from '../../../../components/Box';
import Button from '../../../../components/Button';
import RelatedContactItem from '../contacts/RelatedContactItem';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import groupArrayInAlphaOrder from '../../../../utils/groupArrayInAlphaOrder';
import useShadow from './useShadow';
import scrollBarSx from '../../../../utils/scrollBarSx';

export default function RelatedContactsList () {
    const [atEnd, scrollProps] = useScrollEnd();
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
                {/* {
                    contacts.map((contact, index) => (
                        <React.Fragment key={contact._id}>
                            <RelatedContactItem {...contact}/>
                            {index !== contacts.length - 1 && 
                            <Divider variant="inset" component="li" />
                            }
                        </React.Fragment>
                    ))
                }  */}
                {groupArrayInAlphaOrder(contacts).map(({label, children}) => (
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
                                <React.Fragment key={contact._id}>
                                    <RelatedContactItem {...contact}/>
                                    {index !== contacts.length - 1 && 
                                    <Divider variant="inset" component="li" />
                                    }
                                </React.Fragment>
                            ))
                            }
                        </List>
                    </li>
                ))}
                </List>
            </Box>
        </React.Fragment>
    );
}

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