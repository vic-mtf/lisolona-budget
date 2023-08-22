import React, { useCallback } from 'react';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import IconButton from '../../../../../../components/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { modifyData } from '../../../../../../redux/data';

export default function ToggleEmojiBarButton () {
    const selected = useSelector(store => store.data.chatBox.footer.emojiBar);
    const dispatch = useDispatch();
    const toggleToolbar = useCallback(() => {
        dispatch(
            modifyData({
                data: !selected,
                key: 'chatBox.footer.emojiBar',
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
        >
            <SentimentSatisfiedAltOutlinedIcon fontSize="small"/>
        </IconButton>
    );
}