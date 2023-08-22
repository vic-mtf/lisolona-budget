import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import IconButton from '../../../../../components/IconButton';
import { Stack, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { setConferenceData } from '../../../../../redux/conference';
import useClientState from '../../actions/useClientState';

export default function AdminOptionsButton () {
    const nav = useSelector(store => store.conference.nav);
    const selected = useMemo(() => /admin-options-open/.test(nav), [nav]);
    const dispatch = useDispatch();
    const id = useSelector(store => store.meeting.me.id);
    const state = useClientState({id, props:['isAdmin']});

    return (Boolean(state.isAdmin) &&
        <Stack
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            spacing={.1}
        >
            <Tooltip title="Options de modérateur " arrow>
                <IconButton
                    size="small"
                    color="primary"
                    selected={selected}
                    disabled
                    sx={{
                        zIndex: 0,
                        borderRadius: 1,
                        boxShadow: 'none',
                    }}
                    onClick={() => dispatch(
                        setConferenceData({
                             data :{ nav: selected ? 'admin-options-close' : 'admin-options-open' }
                        })
                    )}
                >
                    <AdminPanelSettingsOutlinedIcon/>
                </IconButton>
            </Tooltip>
        </Stack>
    );
}
