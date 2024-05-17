import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { 
    Divider,
    ListSubheader,
    MenuItem,
    Toolbar, 
} from '@mui/material';
import db from '../../../../database/db';
import { useLiveQuery } from 'dexie-react-hooks';
import Button from '../../../../components/Button';
import AddIcCallOutlinedIcon from '@mui/icons-material/AddIcCallOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import Menu from '../../../../components/Menu';
import { escapeRegExp } from 'lodash';
import LoadingList from './LoadingList';
import EmptyContentMessage from './EmptyContentMessage';
import CustomListItemsGroup from '../../../../components/CustomListItemsGroup';
import { callsItems, menuGlobalCall, sortMeetings } from './contactsListOptions';
import store from '../../../../redux/store';
import { setData } from '../../../../redux/data';

export default function CallContactsList ({navigation}) {
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const anchorElRef = useRef();

    const calls = useLiveQuery(() => 
        db?.calls.orderBy('createdAt').filter(({name}) =>
            new RegExp(escapeRegExp (search.trim().split(/\s/).join('|')), 'ig').test(name)
        ).toArray()
    ,[search]);

    useEffect(() => {
        store.dispatch(setData({
            data: {
                activeCall: Boolean(
                    calls?.find(call => call?.status === 1)
                )
            }
        }))
    },[calls]);

    return (navigation === 1 &&
        <React.Fragment>
            <Toolbar variant="dense">
                <Button
                    children="Lancer un nouvel appel" 
                    variant="outlined"
                    color="inherit"
                    sx={{mx: 'auto'}}
                    ref={anchorElRef}
                    startIcon={<AddIcCallOutlinedIcon/>}
                    endIcon={<ExpandMoreOutlinedIcon/>}
                    onClick={() => {
                        setAnchorEl(anchorElRef.current);
                    }}
                />
            </Toolbar>
            <ListItems
                calls={calls}
                search={search}
            />  
            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                sx={{
                    '& .MuiMenuItem-root': {
                        '& .MuiSvgIcon-root': {
                        fontSize: 18,
                        color: theme => theme.palette.text.secondary,
                        marginRight: theme => theme.spacing(1.5),
                        },
                    }
                }}
            >
                {menuGlobalCall.map(({label, Icon, disabled, onClick}, key) => (
                    <MenuItem
                        key={key}
                        disabled={disabled}
                        onClick={event => {
                            setAnchorEl(null);
                            onClick(event);
                        }}
                    > 
                    {<Icon fontSize="small"/>} {label}
                    </MenuItem>
                )) }
            </Menu>
        </React.Fragment>
    );
}

const ListItems  = ({ calls:_calls, search }) => {
    const meetingsGroups = useMemo(() => sortMeetings(_calls), [_calls]);
    
    const calls = useMemo(() => 
        meetingsGroups.map(({data}) => data).flat(),
        [meetingsGroups]
    );

    const itemContent = useCallback ((index) => {
        const call = calls[index];
        const next = calls[index + 1];
        const isDivisible = Boolean(next) && next?.title ===  call?.title;
        const CallItem = callsItems[call?.key];
       
        return (
            <div>
                {Boolean(CallItem) &&
                <CallItem 
                    call={call}
                    search={search}
                />}
                {isDivisible && <Divider variant="inset" component="div" />}
            </div>
        );

    }, [search, calls]);

    const groupContent = useCallback(index => {
        return (
            <ListSubheader
                sx={{
                    fontWeight: 'bold',
                    height: 50,
                    top: 0,
                    position: 'sticky',
                    zIndex: theme => theme.zIndex.drawer,
                    background: theme => `linear-gradient(transparent 0%, ${theme.palette.background.paper} 100%)`,
                    backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                }}
            >
            {meetingsGroups[index]?.title}
        </ListSubheader>
        )
    }, [meetingsGroups]);

    const groupCounts = useMemo(() => meetingsGroups.map(({count}) => count), [meetingsGroups]);
    return (
        <React.Fragment>
            <LoadingList loading={calls === undefined} />
            <EmptyContentMessage
                title="Aucun appel trouvé"
                show={calls?.length === 0}
                description={`
                Commencez à passer des appels pour voir 
                votre historique d'appel ou des réunions s'afficher ici`
                }
            />
                {Boolean(calls?.length) &&
                 <CustomListItemsGroup
                    itemContent={itemContent}
                    groupCounts={groupCounts}
                    groupContent={groupContent}
                 />
                }
        </React.Fragment>
    );
}