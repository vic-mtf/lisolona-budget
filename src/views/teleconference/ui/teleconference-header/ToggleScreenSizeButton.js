import VerticalSplitOutlinedIcon from '@mui/icons-material/VerticalSplitOutlined';
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../../../../components/IconButton';
import { useMemo } from 'react';
import { createTheme, ThemeProvider, Tooltip } from '@mui/material';
import { addTeleconference } from '../../../../redux/teleconference';

export default function ToggleScreenSizeButton () {
    const screenMode = useSelector(store => store?.teleconference.screenMode);
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
        })[screenMode];
    }, [screenMode]);

    return (
        <Tooltip
            title={Button.label}
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
                                    key: 'screenMode', 
                                    data: Button.value,
                                })
                            )
                        }}
                    >
                        <Button.Icon fontSize="small" />
                    </IconButton>
                </ThemeProvider>
            </div>
        </Tooltip>
    )
}