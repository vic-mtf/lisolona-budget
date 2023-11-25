import { Fade, Box as MuiBox, Tabs } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import FileThumb from './FileThumb';
import { modifyData } from '../../../../../redux/data';
import ThumbView from '../../../../../components/ThumbView';

export default function FilesThumbView ({filesRef}) {
    const files = useSelector(store => store.data.chatBox.footer.files);
    const dispatch = useDispatch();
    const handleRemoveFile = id => {
        const indexByRef = filesRef.current.findIndex(file => file?.id === id);
        const indexByRedux = files.findIndex(file => file?.id === id);
        if(~indexByRef && ~indexByRedux) {
            const { url } = files[indexByRedux];
            const _files = [].concat(files);
            window.URL.revokeObjectURL(url);
            delete filesRef.current[indexByRef];
            delete _files[indexByRedux];
            filesRef.current = filesRef.current.filter(file => file);
            const data = _files.filter(file => file);
            dispatch(
                modifyData({
                    data,
                    key: 'chatBox.footer.files',
                })
            );
        }
    };

    return (
        <MuiBox
            position="relative"
            onMouseDown={event => event.preventDefault()}
            p={.5}
        >
            <ThumbView
                size={100}
                data={files.map(({id, url}) => {
                    const data = filesRef?.current.find(file => file?.id === id);
                    return (
                        <FileThumb
                            key={id}
                            file={data}
                            files={filesRef.current}
                            type={handleGetType(data.File)}
                            onRemoveFile={() => handleRemoveFile(id)}
                            // onOpen={() => setDefaultFile(file.id)}
                            url={url}
                        />
                    );
                })}
            
            />
        </MuiBox>
    );
}

const handleGetType = File => {
    const [type] = File.type.split('/');
    return type.toString().trim();
};