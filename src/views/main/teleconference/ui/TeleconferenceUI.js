import { Dialog, DialogContent, Box as MuiBox, Slide } from '@mui/material';
import { createContext, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { drawerWidth } from '../../../navigation/Navigation';
import MiniChatBox from './mini-chatbox/MiniChatBox';
import TeleconferenceBody from './teleconference-body/TeleconferenceBody';
import TeleconferenceFooter from './teleconference-footer/TeleconferenceFooter';
import TeleconferenceHeader from './teleconference-header/TeleconferenceHeader';
import MembersList from './MembersList/MembersList';

const TeleconferenceUIContext = createContext(null);
export const useTeleconferenceUI = () => useContext(TeleconferenceUIContext);

//const MAX_SCREENS = 32;

export default function TeleconferenceUI () {
    const [page, setPage] = useState(1);
    const [openChatBox, setOpenChatBox] = useState(false);
    const [openNavMembers, setOpenNavMembers] = useState(false);
    const screen = useSelector(store => store.teleconference.screen);
    const isSmall = useMemo(() => screen === 'medium', [screen]);
    const component = useMemo(() => isSmall ? 
        MediumScreenContainer : FullScreenContainer, [isSmall]
    );
     const getters = useMemo(() => ({
        page,
        openChatBox,
        openNavMembers,
     }), [page, openChatBox, openNavMembers]);

     const setters = useMemo(() => ({
        setOpenChatBox,
        setPage,
        setOpenNavMembers
     }),[setOpenChatBox, setPage]);

     return (
        <TeleconferenceUIContext.Provider value={[getters, setters]}>
                <MuiBox
                    display="flex"
                    height="100%"
                    width="100%"
                >
                    <MuiBox 
                        component={component}
                        screen={screen}
                        sxProps={{ 
                            width:  `calc(100% - ${(openChatBox || openNavMembers) ? drawerWidth * (Number(isSmall) + 1) : 0}px)`,
                            mr:0,
                            transition: theme => theme.transitions.create(['margin', 'width', 'flex'], {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen,
                            }),
                            position: 'relative',
                        }}
                    >
                        <TeleconferenceHeader/>
                        <TeleconferenceBody/>
                        <TeleconferenceFooter/>
                        {!openNavMembers && <MiniChatBox open={openChatBox}/>}
                        {!openChatBox && <MembersList open={openNavMembers}/>}
                        
                    </MuiBox>
                </MuiBox>
        </TeleconferenceUIContext.Provider>
     )
}

const FullScreenContainer = ({children, sxProps, screen}) => {
    const open = useMemo(() => screen !== 'none');
    return (
        <Dialog
            open={open}
            fullScreen
        >
            <DialogContent sx={{p:0}}>
                <MuiBox
                    sx={{
                        flex: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100vw',
                        height: '100vh',
                        ...sxProps,
                    }}
                    component="main"
                >
                {children}
                </MuiBox>
        </DialogContent>
        </Dialog>
    )
};

const MediumScreenContainer = ({children, sxProps}) => {
    return (
        <Slide in direction="right">
            <MuiBox
                sx={{
                    bgcolor: 'background.paper',
                    height: '100%',
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: 400/8,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    ...sxProps,
                }}
            >
                {children}
            </MuiBox>
        </Slide>
    )
};