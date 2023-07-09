import { Stack, Box as MuiBox } from '@mui/material';
import Button from '../../../../../../components/Button';
import React from 'react';
import onDownload from './onDownLoad';
import getServerUri from '../../../../../../utils/getServerUri';
import onSend from './onSend';
import downloadFile from './downloadFile';
import openFile from './openFile';

export default function DocMessageActions ({
    buffer,
    sended,
    showViewer,
    download,
    downloadsRef,
    setDownload,
    content,
    fileName,
    typeMIME,
    infos,
    setBuffer,
    id,
}) {
    return (
        <MuiBox
            p={1}
            display="flex"
            width="100%"
            justifyContent="center"
            alignItems="center"
            component={Stack}
            spacing={1}
            direction="row"
        >
        {buffer ?
            (sended ? 
                (<React.Fragment>
                    { showViewer &&
                    <Button variant="outlined" fullWidth
                        onClick={() => openFile(buffer)}
                    > Ouvrir</Button>}
                    <Button 
                        variant="outlined"
                        fullWidth
                        onClick={() => downloadFile(buffer)}
                    > Enregister
                    </Button>
                </React.Fragment>):
                (<React.Fragment>
                    {Boolean(download) ?
                    (<Button 
                        variant="outlined" 
                        fullWidth
                        onClick={() => {
                            download?.cancel();
                            downloadsRef.current = downloadsRef.current.filter(
                                ({id}) => id !== download?.id
                            );
                            setDownload(null);
                        }}
                    > Annuler
                    </Button>):
                    (<Button 
                        variant="outlined" 
                        fullWidth
                        onClick={() => {
                            setDownload(
                                onSend({
                                    id,
                                    url: getServerUri({pathname: content}).toString(),
                                    downloadsRef,
                                    name: fileName,
                                    typeMIME,
                                    size: infos?.size,
                                    setBuffer
                                })
                            );
                        }}
                    > Envoyer
                    </Button>)}
                </React.Fragment>)
            ):
        (<React.Fragment>
            {Boolean(download) ?
            (<Button 
                variant="outlined" 
                fullWidth
                onClick={() => {
                    download?.cancel();
                    downloadsRef.current = downloadsRef.current.filter(
                        ({id}) => id !== download?.id
                    );
                    setDownload(null);
                }}
            > Annuler
            </Button>):
            (<Button 
                variant="outlined" 
                fullWidth
                onClick={() => {
                    setDownload(
                        onDownload({
                            id,
                            url: getServerUri({pathname: content}).toString(),
                            downloadsRef,
                            name: fileName,
                            typeMIME,
                            size: infos?.size,
                            setBuffer
                        })
                    );
                }}
            > Télécharger
            </Button>)}
        </React.Fragment>)}
    </MuiBox>
    )
}