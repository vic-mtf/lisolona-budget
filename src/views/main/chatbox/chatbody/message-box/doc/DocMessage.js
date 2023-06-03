import { 
     Stack, 
     Box as MuiBox,
     ListItem,
     ListItemAvatar,
     Avatar,
     ListItemText,
     Divider,
     Paper,
     ThemeProvider,
     createTheme,
} from '@mui/material';
import getDocInfos from './getDocInfos';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import DoCMiniViewer from './DocMiniViewer';
import isTextFile from '../../../../../../utils/isTextFile';
import fileExtensionBase from '../../../../../../utils/fileExtensionBase';
import hasCommonElement from '../../../../../../utils/hasCommonElement';
import humanReadableSize from '../../../../../../utils/humanReadableSize';
import bull from './bull';
import getFileNameAndExtension from './getFileNameAndExtension';
import { useData } from '../../../../../../utils/DataProvider';
import DownloadLevel from './DownloadLevel';
import DocMessageActions from './DocMessageActions';
import { useTheme } from '@emotion/react';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

export default function DocMessage ({type:typeMIME, bgcolor, buffer:bf, content, id, cover, sended, numPages, isMine}) {
    const [{downloadsRef}] = useData();
    const [download, setDownload] = useState(null);
    const [buffer, setBuffer] = useState(bf);
    const [infos, setInfos] = useState({
        size: buffer?.size,
        numPages
    });
    const [,type] = useMemo(() => typeMIME?.split('/') || [], [typeMIME]); ;
    const {icon, docType} = useMemo(() => 
        fileExtensionBase.find((infos) => hasCommonElement(infos.typeMIME, [typeMIME]) ) || {}, 
        [typeMIME]
    );
    const fileName = buffer?.name || getFileNameAndExtension(content);
    const isText = useMemo(() => isTextFile(type), [type]);
    const showViewer = useMemo(() => (isText || typeMIME === 'application/pdf'), [isText, typeMIME]);
    const theme = useTheme();

    useLayoutEffect(() => {
        if(typeof infos?.size !== 'number')
            getDocInfos({content}).then(_infos => {
                setInfos(infos => ({...infos, ..._infos}))
            });
    }, [content, infos?.size]);

    useLayoutEffect(() => {
        const download = downloadsRef.current?.find(data => data.id === id);
        if(download) setDownload(download);
    }, [downloadsRef, id]);

    return (
        <ThemeProvider theme={isMine ? createTheme({palette: {mode : 'light'}}) : theme}>
          <Stack bgcolor={bgcolor} width={330} display="flex" pb={2.5} divider={<Divider/>}>
            { showViewer && 
                <DoCMiniViewer 
                    isText={isText} 
                    id={id} 
                    content={content} 
                    cover={cover}
                    setInfos={setInfos}
                    typeMIME={typeMIME}
                    buffer={buffer}
                />}
            <Paper
                sx={{bgcolor: '#00000005'}}
                display="flex"
                component={Stack}
                mx={1}
                mt={1}
                elevation={0}
                divider={<Divider variant="middle"  />}
          >
            <ListItem 
                secondaryAction={Boolean(download) && 
                <DownloadLevel 
                    setBuffer={setBuffer}
                    download={download}
                    setDownload={setDownload}
                />} 
            >
                <ListItemAvatar>
                    <Avatar 
                        variant="rounded" 
                        src={icon}
                        children={
                            <InsertDriveFileOutlinedIcon/>
                        }
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={fileName}
                    secondary={
                        <MuiBox>
                            {docType}
                            {infos?.numPages && (<> {bull} {infos?.numPages} pages</>)}
                            {typeof infos?.size === 'number' && (<> {bull} {humanReadableSize(infos?.size)} </>)}
                        </MuiBox>
                    }
                    primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 'bold',
                        textOverflow: 'ellipsis',
                        noWrap: true,
                        title: fileName,
                        pr: Boolean(download) ? 1.5: 0,
                    }}
                    secondaryTypographyProps={{
                        variant: 'caption',
                        textOverflow: 'ellipsis',
                        noWrap: true,
                    }}
                />
                </ListItem>
                <DocMessageActions
                    typeMIME={type}
                    buffer={buffer}
                    sended={sended}
                    showViewer={showViewer}
                    download={download}
                    downloadsRef={downloadsRef}
                    setDownload={setDownload}
                    content={content}
                    fileName={fileName}
                    infos={infos}
                    setBuffer={setBuffer}
                    id={id}
                />
            </Paper>
          </Stack>
        </ThemeProvider>
    );
}