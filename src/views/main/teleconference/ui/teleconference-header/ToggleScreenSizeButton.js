import VerticalSplitOutlinedIcon from '@mui/icons-material/VerticalSplitOutlined';
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../../../../../components/IconButton';
import { useMemo } from 'react';
import { createTheme, ThemeProvider, Tooltip } from '@mui/material';
import { addTeleconference } from '../../../../../redux/teleconference';

export default function ToggleScreenSizeButton () {
    const screen = useSelector(store => store?.teleconference.screen);
    const target = useSelector(store => store?.teleconference.target);
    const dispatch = useDispatch();
    const Button = useMemo(() => {
        return ({
            'medium': {
                Icon: MenuOpenOutlinedIcon,
                label: 'Occuper tout l\'écran',
                value: 'full',
            },
            'full': {
                Icon: VerticalSplitOutlinedIcon,
                label: 'Ouvrir la navigation',
                value: 'medium',
            } ,
        })[screen];
    }, [screen]);

    return (
        <Tooltip
            title={Button?.label}
            arrow
        >
            <div>
                <ThemeProvider 
                    theme={createTheme({palette: {mode: 'dark'}})}
                >
                    <IconButton
                        onClick={() => {
                            dispatch(
                                addTeleconference({
                                    key: 'screen', 
                                    data: Button.value,
                                })
                            );
                            dispatch(
                                addTeleconference({
                                    key: 'target', 
                                    data: target,
                                })
                            );
                        }}
                    >
                        {Boolean(Button?.Icon) && <Button.Icon fontSize="small" />}
                    </IconButton>
                </ThemeProvider>
            </div>
        </Tooltip>
    )
}