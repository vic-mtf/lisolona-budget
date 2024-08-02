import React from 'react';
import "@draft-js-plugins/text-alignment/lib/plugin.css";
import { WritingAreaToolbar } from './WritingArea';
import { Box as MuiBox} from '@mui/material';
import ToggleToolbarButton from './buttons/ToggleToolbarButton';
import ToggleEmojiBarButton from './buttons/ToggleEmojiBarButton';
import ToggleVoiceRecordAndTextMessageButton from './buttons/ToggleVoiceRecordAndTextMessageButton';
import AddFilesButton from './buttons/AddFilesButton';
import store from '../../../../../redux/store';
import { modifyData } from '../../../../../redux/data';
import { useSelector } from 'react-redux';

export default React.memo(function  WritingAreaFooter ({isEmpty, filesRef, hasFocus, onSubmit, editorRef, media}) {
    return (
        <WritingAreaToolbar>
        {
            () => (
                <MuiBox
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: .5,
                    }}
                    onMouseDown={event => event.preventDefault()}
                    onMouseUp={event => event.preventDefault()}
                >
                    <MuiBox
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        flexGrow={1}
                        gap={.5}
                    >
                        <ToggleToolbarButton/>
                        <ToggleEmojiBarButton/>
                        {media && <AddFilesButton filesRef={filesRef}/>}
                    </MuiBox>
                    <MuiBox
                        position="relative"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height={40}
                        width={40}
                    >
                        <SubmitButton
                            onSubmit={onSubmit}
                            isEmpty={isEmpty}
                            media={media}
                        />
                    </MuiBox>
                </MuiBox>
            )
        }
        </WritingAreaToolbar>
    );
});

const SubmitButton = ({onSubmit, isEmpty, media}) => {
    const isFiles = useSelector(store => store.data.chatBox.footer.files.length);

    return (
        <ToggleVoiceRecordAndTextMessageButton
            onRecord={() => {
                store.dispatch(
                    modifyData({
                        data: true,
                        key: 'chatBox.footer.recording',
                    })
                );
            }}
            onSend={onSubmit}
            type={(isFiles || !isEmpty) ? 'text' : 'voice'}
            disabledVoice={!media}
            
        />
    );
};