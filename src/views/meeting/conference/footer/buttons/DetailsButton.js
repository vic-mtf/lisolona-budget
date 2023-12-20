
import IconButton from '../../../../../components/IconButton';
import { Tooltip, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { setConferenceData } from '../../../../../redux/conference';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function DetailsButton ({getVideoStream}) {
    const nav = useSelector(store => store.conference.nav);
    const selected = useMemo(() => /details-open/.test(nav), [nav]);
    const dispatch = useDispatch();

    return (
        <Stack
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            spacing={.1}
        >
            <Tooltip title="Detail de la réunion" arrow>
                <IconButton
                    size="small"
                    color="primary"
                    selected={selected}
                    onClick={() => dispatch(
                        setConferenceData({
                             data :{ nav: selected ? 'details-close' : 'details-open' }
                        })
                    )}
                    sx={{
                        zIndex: 0,
                        borderRadius: 1,
                        boxShadow: 'none',
                    }}
                >
                    <InfoOutlinedIcon/>
                </IconButton>
            </Tooltip>
        </Stack>
    );
}
