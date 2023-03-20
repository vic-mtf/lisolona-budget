import { Backdrop, Box as MuiBox, Fade, Slide, Zoom } from '@mui/material';
import { createContext, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTeleconference } from '../../../utils/TeleconferenceProvider';
import { drawerWidth } from '../../navigation/Navigation';
import MiniChatBox from './mini-chatbox/MiniChatBox';
import TeleconferenceBody from './teleconference-body/TeleconferenceBody';
import TeleconferenceFooter from './teleconference-footer/TeleconferenceFooter';
import TeleconferenceHeader from './teleconference-header/TeleconferenceHeader';

const TeleconferenceUIContext = createContext(null);
export const useTeleconferenceUI = () => useContext(TeleconferenceUIContext);

const MAX_SCREENS = 32;

export default function TeleconferenceUI ({children}) {
    const [page, setPage] = useState(1);
    const [openChatBox, setOpenChatBox] = useState(false);
    const {showTeleconference, component, isSmall} = useSelector(store => {
        const showTeleconference = store.teleconference.meetingMode !== 'none' &&
        store.teleconference.privileged;
        const isSmall = store.teleconference?.screenMode === 'medium';
        const component = isSmall ? MediumScreenContainer : FullScreenContainer;
        return {showTeleconference, component, isSmall}
     });
     const getters = {
        page,
        openChatBox,
     };
     const setters = {
        setOpenChatBox,
        setPage,
     };

     return (
        <TeleconferenceUIContext.Provider value={[getters, setters]}>
            {showTeleconference &&
                <MuiBox
                    display="flex"
                    height="100%"
                    width="100%"
                >
                    <MuiBox 
                        component={component}
                        overflow="hidden"
                        sxProps={{ 
                            width:  `calc(100% - ${openChatBox ? drawerWidth * (Number(isSmall) + 1) : 0}px)`,
                            mr:0,
                            transition: theme => theme.transitions.create(['margin', 'width', 'flex'], {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen,
                            }),
                        }}
                    >
                        <TeleconferenceHeader/>
                        <TeleconferenceBody/>
                        <TeleconferenceFooter/>
                    </MuiBox>
                    <MiniChatBox open={openChatBox}/>
                </MuiBox>
            }
        </TeleconferenceUIContext.Provider>
     )
}

const FullScreenContainer = ({children, sxProps}) => {
    return (
        <Backdrop
            sx={{
                zIndex: theme => theme.zIndex.drawer,
                bgcolor: 'background.paper',
                flexDirection: 'column',
                display: 'flex',
                alignItems: 'start'
            }}
            open={true}
        >
            <MuiBox
                sx={{
                    flex: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    ...sxProps,
                }}
                component="main"
            >
            {children}
        </MuiBox>
        </Backdrop>
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