import Box from "../../components/Box"
import _lisolonabudget_logo from '../../assets/group_speak.webp';
import { 
    CardMedia, 
    Stack,
    Box as MuiBox,
    CircularProgress,
    Divider
} from "@mui/material";
import Typography from "../../components/Typography";
import 'animate.css/source/attention_seekers/swing.css';
import _logo_geid from '../../assets/geid_logo_blue_without_title.webp';
import { useCallback, useLayoutEffect, useMemo, useRef, useState} from "react";
import useAxios from "../../utils/useAxios";
import dbConfig from '../../configs/database-config.json';
import Dexie from "dexie";
import { useSelector } from "react-redux";
import getData from "../../utils/getData";
import db from "../../database/db";
import { useData } from "../../utils/DataProvider";
import structureMessages from "../../utils/structureMessages";

export default function Cover ({getters, setters}) {
    const token = useSelector(store => store.user.token);
    const userId = useSelector(store => store.user.id);
    const [install, setInstall] = useState(null);
    const [, {pushMessages}] = useData();
    const [{loading}, refresh] = useAxios({
        url: '/api/chat',
        headers: {Authorization: `Bearer ${token}`}
    }, {manual: true});
    const allowRef = useRef(true);
    const startApp =  useMemo(() => getters.startApp, [getters.startApp]);

    const handelLauncher = useCallback(async () => {
            const data = await db.messages.orderBy('createdAt').toArray();
            const messages = data?.sort((a, b) => 
                new Date(b?.createdAt) - new Date(a?.createdAt) 
            );
            const group = {};
            messages?.forEach(message => {
                const id = message?.targetId;
                if(Array.isArray(group[id])) 
                    group[id].push(message);
                else group[id] = [message];
            });
            Object.keys(group).forEach(id => {
                const groupMessages = structureMessages(group[id]);
                const messages = groupMessages.slice(0, 20);
                const total = groupMessages.length;
                pushMessages({id, messages, total});
            }); 
            setters?.setLoading(false);
    },[setters, pushMessages]);

    useLayoutEffect(() => {
        if(allowRef.current && userId && startApp) {
            const options = JSON.stringify(dbConfig.stores);
            const key = `${dbConfig.name}-user-database-id`;
            const dbName = window.localStorage.getItem(key);
            if(!db || (dbName !== userId)) {
                window.localStorage.setItem(dbConfig.name, options);
                window.localStorage.setItem(key, userId);
                setInstall('ongoing');
                Dexie.getDatabaseNames().then(names => {
                    Promise.all(names.map(
                        name => new Promise((resolve, reject) => {
                        if(!db) Dexie.delete(name).then(resolve).catch(reject);
                    })));
                }).then(() => {
                    window.setTimeout(() => {
                        setInstall('ended');
                        window.setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }, 2000);
                });
            } else {
                (async() => {
                    try {
                        const { data } = await refresh();
                        const { chats, contacts, invitation, callHistory } = data || {};
                        getData({chats, userId, contacts}, handelLauncher);
                        //console.log(callHistory);
                    } catch(error) {
                        handelLauncher();
                    }
                })();
            };
            allowRef.current = false;
        }
    },[userId, startApp, refresh, handelLauncher]);

    return (
        <Box
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                userSelect: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
        >
           <Stack
            display="flex"
            justifyContent="center"
            alignItems="center"
            flex={1}
            spacing={1}
           >
            <CardMedia
                    component="img"
                    src={_lisolonabudget_logo}
                    draggable={false}
                    sx={{
                        height: 100,
                        width: 100,
                        animation: 'swing .5s 1s' ,
                    }}
            />
            <MuiBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                position="relative"
            >
                <Stack 
                    spacing={1} 
                    direction="row" 
                    width={500} 
                    my={1}
                    divider={
                        <Divider 
                            flexItem 
                            orientation="vertical" 
                            sx={{
                                bgcolor: 'text.primary',
                                borderWidth: 1,
                            }}
                        />
                    }
                    display="flex"
                    justifyContent="center"
                >
                    <CardMedia
                        component="img"
                        src={_logo_geid}
                        sx={{width: 120}}
                    />
                    <Typography
                        noWrap
                        variant="h4"
                    >Lisolo Na Budget</Typography>
                </Stack>
                
                {(loading||install) &&
                <MuiBox
                    sx={{position: 'absolute', top: '150%'}}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    color="text.primary"
                    flexDirection="column"
                >
                    <CircularProgress
                        size={15}
                        color="inherit"
                    />
                    {install === 'ongoing' &&
                     <Typography
                        align="center"
                        my={.5}
                    >L'installation de vos données en cours...</Typography>}
                    {install === 'ended' &&
                     <Typography
                        align="center"
                        my={.5}
                    >L'installation terminée, rechargement...</Typography>}
                </MuiBox>
                }
            </MuiBox>
           </Stack>
           <Typography variant="caption" paragraph>
                Direction Archives et Nouvelles Technologie de l'Information et de la Communication ©2022
            </Typography>
        </Box>
    )
}