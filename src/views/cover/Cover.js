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
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import useAxios, { axiosBase } from "../../utils/useAxios";
import { useSelector } from "react-redux";
import getData from "../../utils/getData";
import db, { clearDatabase } from "../../database/db";
import { useNavigate } from "react-router-dom";
import { useTimer } from "react-timer-hook";

export default function Cover ({getters, setters}) {
    const token = useSelector(store => store.user.token);
    const userId = useSelector(store => store.user.id);
    const navigateTo = useNavigate();
    const [{loading}, refresh] = useAxios({
        url: '/api/chat',
        headers: {Authorization: `Bearer ${token}`}
    }, {manual: true});
    const startApp =  useMemo(() => getters.startApp, [getters.startApp]);

    const handelLauncher = useCallback(async () => {
        setters?.setLoading(false);
        navigateTo('/');
        getters.isStarted.current = false;
    },[setters, navigateTo, getters]);

    const handleStartApp = useCallback(async () => {
        const key = "a2f4c6d8e0b1f7a9c3e5d7b9f2a0c1e6";
        const user = await db.user.get(key);
        if(user && user?.userId !== userId) {
            clearDatabase().then(() => {
                window.location.reload();
            });
        }
        else if(user === undefined) 
            await db.user.put({id: key, userId});
        try {
            const { data } = await refresh();
            const { chats: discussions, contacts, invitations, callHistory } = data || {};
            getData({ discussions, userId, contacts, meetings: []}, handelLauncher);
        } catch(error) { 
            handelLauncher(); 
        }
    }, [handelLauncher, refresh, userId]);

    useLayoutEffect(() => {
        if(userId && startApp) 
            handleStartApp();
    },[userId, startApp, handleStartApp]);

    useTimer({
        expiryTimestamp: (() => {
          const time = new Date();
          time.setMilliseconds(2800);
          return time;
        })(),
        onExpire () {
          if(!startApp) setters.setStartApp(true);
        }
    });
    useGetCalls();
    
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
                {loading &&
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

const useGetCalls = () => {
    const token = useSelector(store => store.user.token);
    const loadingRef = useRef(true);
    useEffect(() => {
        if(token && loadingRef.current) {
            loadingRef.current = false;
            axiosBase.get('/api/chat/room/call/', {
                    headers: {Authorization: `Bearer ${token}`}
            }).then(({data: meetings}) => {
                getData({meetings})
            }).catch(err => {
            });
        }
    }, [token]);
    
};
