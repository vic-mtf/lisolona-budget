import { 
     Stack, 
     Box as MuiBox,
     ListItem,
     ListItemAvatar,
     Avatar,
     ListItemText,
     Divider,
     Paper,
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

export default function DocMessage ({type:tyeMIME, bgcolor, buffer:bf, content, id, cover, sended, numPages}) {
    const [{downloadsRef}] = useData();
    const iniData = downloadsRef.current?.find(data => data.id === id);
    const [download, setDownload] = useState(iniData);
    const [buffer, setBuffer] = useState(bf);

    const [infos, setInfos] = useState({
        size: buffer?.size,
        numPages
    });
    const [,type] = useMemo(() => tyeMIME?.split('/') || [], [tyeMIME]); ;
    const {icon, docType} = useMemo(() => 
        fileExtensionBase.find((infos) => hasCommonElement(infos.typeMIME, [tyeMIME]) ), 
        [tyeMIME]
    );
    const fileName = buffer?.name || getFileNameAndExtension(content);
    const isText = useMemo(() => isTextFile(type), [type]);
    const showViewer = useMemo(() => (isText || tyeMIME === 'application/pdf'), [isText, tyeMIME]);

    useLayoutEffect(() => {
        if(!infos?.size)
            getDocInfos({content}).then(_infos => {
                setInfos(infos => ({...infos, ..._infos}))
            });
    }, [content, infos?.size]);

    return (
          <Stack bgcolor={bgcolor} width={330} display="flex" pb={2.5}>
            { showViewer && 
                <DoCMiniViewer 
                    isText={isText} 
                    id={id} 
                    content={content} 
                    tyeMIME={tyeMIME}
                    cover={cover}
                    setInfos={setInfos}
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
            <ListItem secondaryAction={Boolean(iniData) && <DownloadLevel {...iniData}/>} >
                <ListItemAvatar>
                    <Avatar variant="rounded" src={icon}/>
                </ListItemAvatar>
                <ListItemText
                    primary={fileName}
                    secondary={
                        <MuiBox>
                            {docType}
                            {infos?.numPages && (<> {bull} {infos?.numPages} pages</>)}
                            {infos?.size && (<> {bull} {humanReadableSize(infos?.size)} </>)}
                        </MuiBox>
                    }
                    primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 'bold',
                        textOverflow: 'ellipsis',
                        noWrap: true,
                        title: fileName,
                        pr: Boolean(iniData) ? 1.5: 0,
                    }}
                    secondaryTypographyProps={{
                        variant: 'caption',
                        textOverflow: 'ellipsis',
                        noWrap: true,
                    }}
                />
                </ListItem>
                <DocMessageActions
                    tyeMIME={type}
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
    );
}