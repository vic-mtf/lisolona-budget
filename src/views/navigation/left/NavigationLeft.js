import Navigation from '../Navigation';
import { Divider, Stack, useMediaQuery, Box as MuiBox } from '@mui/material';
import Box from '../../../components/Box';
import Header from './Header';
import ShortcutOptions  from './shortcut/ShortcutOptions';
import { useCallback, useEffect, useState } from 'react';
import RelatedContactsList from './lists/ContactsList';
import ChatContactsList from './lists/DiscussionList';
import CallContactsList from './lists/CallContactsList';
import NotificationList from './lists/NotificationList';
import NetworkProblemChecker from './NetworkProblemChecker';
import ToggleComponent from '../../../components/ToggleComponent'
import store from '../../../redux/store';

export default function NavigationLeft () {
    const [navigation, setNavigation] = useState(0);
    const [selected, setSelected] = useState(false);
    const [search, setSearch] = useState('');
    const onChangeSearch = useCallback(event => {
        event.preventDefault();
        setSearch(event.target.value);
    }, [setSearch]);
    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const target = store.getState().data.target;
            if(selected && !target) setSelected(false);
            if(!selected && target) setSelected(true);
        })
        return () => {
            unsubscribe();
        };
    }, [selected]);
    const matches = useMediaQuery((theme) => theme.breakpoints.down('md'));
    
    return (
        <ToggleComponent
            componentA={Navigation}
            AProps={{
                disableTooBar: true
            }}
            componentB={MuiBox}
            BProps={{
                sx: {
                    display: 'none'
                }
            }}
            isFirst={!(matches && selected)}
        >
            <Stack
                display="flex"
                flex={1}
                direction="row"
                divider={<Divider flexItem orientation="vertical"/>}
                overflow="hidden"
            >
                <Stack 
                    display="flex"
                    width={55}
                    spacing={1}
                    children={<ShortcutOptions/>}
                />
                <Box overflow="hidden">
                    <Header 
                        onChangeNavigation={(event, value) => setNavigation(value)}
                        navigation={navigation}
                        onChangeSearch={onChangeSearch}
                    />
                    <ChatContactsList
                        search={search}
                        navigation={navigation}
                    />
                    <CallContactsList
                        search={search}
                        navigation={navigation}
                    />
                    <RelatedContactsList
                        search={search}
                        navigation={navigation}
                    />
                    <NotificationList
                        search={search}
                        navigation={navigation}
                    />
                    <NetworkProblemChecker/>
                </Box>
            </Stack>
        </ToggleComponent>
    );
}
