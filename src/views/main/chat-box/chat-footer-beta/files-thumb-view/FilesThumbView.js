import { Fade, Box as MuiBox, Tabs } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import FileThumb from './FileThumb';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';
import IconButton from '../../../../../components/IconButton';
import { modifyData } from '../../../../../redux/data';

export default function FilesThumbView ({filesRef}) {
    const files = useSelector(store => store.data.chatBox.footer.files);
    const lengthRef = useRef();
    const [value, setValue] = useState(0);
    const dispatch = useDispatch();
    const filesUrlsRef = useRef([]);

    const handleGenerateUrl = useCallback(file => {
        const findUrl =  filesUrlsRef.current.find(({id}) => id === file.id);
        const url = findUrl ? findUrl.url : URL.createObjectURL(file.File);
        if(!findUrl) filesUrlsRef.current.push({url, ...file});
        return url;
    }, []);

    const handleRemoveFile = id => {
        const index = filesRef.current.findIndex(file => file.id === id);
        if(index > -1) {
            delete filesRef.current[index];
            filesRef.current = filesRef.current.filter(file => file);
            const data = filesRef.current.map(({id}) => id);
            setValue(index > 0 ? index -1 : 0)
            dispatch(
                modifyData({
                    data,
                    key: 'chatBox.footer.files',
                })
            );
        }
    };

    useEffect(() => {
        filesUrlsRef.current.forEach(file => {
            const notFound = !files?.find(id => id === file.id);
            if(notFound) {
                URL.revokeObjectURL(file.url);
                filesUrlsRef.current = filesUrlsRef.current.filter(
                    ({id}) => id !== file.id
                );
            };
        });
        if(lengthRef.current < files.length -1)
            setValue(files.length - 1);
        lengthRef.current = files.length -1;
    }, [files]);

    return (
        <MuiBox
            position="relative"
            onMouseDown={event => event.preventDefault()}
            p={.5}
        >
             <Tabs
                value={value}
                ScrollButtonComponent={ScrollButtonComponent}
                sx={{
                    "& .MuiTabs-indicator": {
                        display: 'none',
                    },
                    maxWidth: '100%',
                    borderRadius: 1,
                }}
                    scrollButtons="auto"
                    variant="scrollable"
                >
                    {files.map(id => {
                        const data = filesRef.current.find(file => file?.id === id);
                        return (
                            <FileThumb
                                key={id}
                                file={data}
                                files={filesRef.current}
                                type={handleGetType(data.File)}
                                onRemoveFile={() => handleRemoveFile(data.id)}
                                // onOpen={() => setDefaultFile(file.id)}
                                url={handleGenerateUrl(data)}
                            />
                        );
                    })}
                </Tabs>
        </MuiBox>
    );
}

const handleGetType = File => {
    const [type] = File.type.split('/');
    return type.toString().trim();
};

const ScrollButtonComponent = ({direction, slotProps, slot, ...otherPros}) => {
    const Icon = direction === 'right' ? NavigateNextOutlinedIcon : NavigateBeforeOutlinedIcon;
    return (
        <MuiBox
            position="absolute"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
                [direction]: 0,
                zIndex: 1,
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
            }}
        >
            <IconButton 
                {...otherPros} 
                size="small"
                sx={{
                    boxShadow: 1,
                    zIndex: theme => theme.zIndex.drawer +100,
                    background: theme => theme.palette.background.paper + '50',
                    backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                    "&:hover": {
                        background: theme => theme.palette.background.paper + 'df',
                        backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                    },
                    "&:disabled": {
                        border:  theme => `1px solid ${theme.palette.divider}`,
                        boxShadow: 0,
                    },
                    border:  theme => `1px solid ${theme.palette.divider}`,
                }}
            >
                <Icon fontSize="small"/>
            </IconButton>
        </MuiBox>
    )
}