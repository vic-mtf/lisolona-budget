import {
    Box as MuiBox,
    Tabs,
    alpha,
} from '@mui/material';
import FileThumb from './FileThumb';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Multimedia from '../../../multimedia/Multimedia';
import { useFooterContext } from '../ChatFooter';

export default function FilesThumbView () {
    const [{files, target}, {setFiles}] = useFooterContext();
    const [defaultFile, setDefaultFile] = useState(null);
    const filesUrlsRef = useRef([]);
    const valueRef = useRef(files.length - 1);
    const handleRemoveFile = useCallback(id => {
        setFiles(
            files => {
                const index = files.findIndex(file => file.id === id);
                valueRef.current = index ? index - 1 : 0;
                return files.filter(file => file.id !== id);
            }
        );
    }, [setFiles]);
    
    const handleGetType = useCallback(File => {
        const [type] = File.type.split('/');
        return type.toString().trim();
    }, []);

    const handleGenerateUrl = useCallback(file => {
        const findUrl =  filesUrlsRef.current.find(({id}) => id === file.id);
        const url = findUrl ? findUrl.url : URL.createObjectURL(file.File);
        if(!findUrl)
            filesUrlsRef.current.push({url, ...file});
        return url;
    }, []);

    const items = useMemo(() => 
        files.filter(({File}) => File.type.match(/video|image/igm))
        .map(file => {
            const url = handleGenerateUrl(file);
            const [subType] = file.File.type.split('/');
           
            return {
                ...file,
                urls: {regular: url, small: url, thumb: url},
                subType,
                type: 'media'
            };
        }),
        [files, handleGenerateUrl]
    );

    const defaultValue = useMemo(() => 
        items?.findIndex(item => item.id === defaultFile),
        [items, defaultFile]
    );

    useEffect(() => {
        filesUrlsRef.current.forEach(fileRef => {
            const notFound = !files?.find(file => file.id === fileRef.id);
            if(notFound) {
                URL.revokeObjectURL(fileRef.url);
                filesUrlsRef.current = filesUrlsRef.current.filter(
                    file => file.id !== fileRef.id
                );
            };
        });
        valueRef.current = files.length - 1;
    }, [files])

    return (
        <React.Fragment>
            <Multimedia
                open={Boolean(defaultFile)}
                defaultValue={defaultValue}
                items={items}
                onClose={() => setDefaultFile(null)}
                headerTitle={`envoyer à ${target.name}`}
            />
            <MuiBox
                width="100%"
                display="flex"
                p={.5}
                mb={1}
                borderRadius={1}
                sx={{
                    bgcolor: theme =>  alpha(theme.palette.common[
                        theme.palette.mode === 'light' ? 'black' : 'white'
                    ], 0.04),
                    border: theme => `1px solid ${theme.palette.divider}`
                }}
            >
                <Tabs
                    value={valueRef.current}
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
                    {files.map((file) => (
                        <FileThumb
                            key={file.id}
                            file={file}
                            files={files}
                            type={handleGetType(file.File)}
                            onRemoveFile={() => handleRemoveFile(file.id)}
                            onOpen={() => setDefaultFile(file.id)}
                            url={handleGenerateUrl(file)}
                        />
                    ))}
                </Tabs>
            </MuiBox>
        </React.Fragment>
    );
}