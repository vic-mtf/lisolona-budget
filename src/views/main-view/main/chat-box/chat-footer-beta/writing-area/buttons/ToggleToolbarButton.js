import React, { useCallback } from 'react';
import CallToActionOutlinedIcon from '@mui/icons-material/CallToActionOutlined';
import IconButton from '../../../../../../components/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { modifyData } from '../../../../../../redux/data';

export default function ToggleToolbarButton () {
    const selected = useSelector(store => store.data.chatBox.footer.toolbar);
    const dispatch = useDispatch();
    const toggleToolbar = useCallback(() => {
        dispatch(
            modifyData({
                data: !selected,
                key: 'chatBox.footer.toolbar',
            })
        )
    }, [dispatch, selected]);

    return (
        <IconButton
            value=""
            size="small"
            selected={selected}
            color="primary"
            onClick={toggleToolbar}
            sx={{
                transform: 'rotate(180deg)'
            }}
        >
        <CallToActionOutlinedIcon fontSize="small"/>
    </IconButton>
    );
}