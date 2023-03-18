import { Backdrop, Box as MuiBox, Fade, Slide, Zoom } from '@mui/material';
import { createContext, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTeleconference } from '../../../utils/TeleconferenceProvider';
import { drawerWidth } from '../../navigation/Navigation';
import TeleconferenceBody from './teleconference-body/TeleconferenceBody';
import TeleconferenceFooter from './teleconference-footer/TeleconferenceFooter';
import TeleconferenceHeader from './teleconference-header/TeleconferenceHeader';

const TeleconferenceUIContext = createContext(null);
export const useTeleconferenceUI = () => useContext(TeleconferenceUIContext);

const MAX_SCREENS = 32;

export default function TeleconferenceUI ({children}) {
    const [page, setPage] = useState(1);
    const {showTeleconference, component} = useSelector(store => {
        const showTeleconference = store.teleconference.meetingMode !== 'none' &&
        store.teleconference.privileged;
        const isSmall = store.teleconference?.screenMode === 'medium';
        console.log(store.teleconference?.screenMode, '************');
        const component = isSmall ? MediumScreenContainer : FullScreenContainer;
        return {showTeleconference, component}
     });

     return (
        <TeleconferenceUIContext.Provider 
            value={[
                {page},
                {setPage}
            ]}
        >
            {showTeleconference &&
                <MuiBox
                    display="flex"
                    height="100%"
                    width="100%"
                >
                    <MuiBox component={component}>
                        <TeleconferenceHeader/>
                        <TeleconferenceBody/>
                        <TeleconferenceFooter/>
                    </MuiBox>
                </MuiBox>
            }
        </TeleconferenceUIContext.Provider>
     )
}

const FullScreenContainer = ({children}) => {
    return (
        <Backdrop
            sx={{
                zIndex: theme => theme.zIndex.drawer + 100,
                bgcolor: 'background.paper',
                flexDirection: 'column',
                display: 'flex',
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
                }}
            >
            {children}
        </MuiBox>
        </Backdrop>
    )
};

const MediumScreenContainer = ({children}) => {
    return (
        <Slide in direction="right">
            <MuiBox
                sx={{
                    bgcolor: 'background.paper',
                    height: '100%',
                    width: `calc(100% - ${drawerWidth}px)`,
                    overflow: 'hidden',
                    ml: drawerWidth / 8,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {children}
            </MuiBox>
        </Slide>
    )
};