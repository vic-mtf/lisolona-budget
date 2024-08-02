import { Box as MuiBox, Modal, Stack, Divider, Tabs } from '@mui/material';

export default function GalleryFooter () {
    return (
        <MuiBox
            display="flex"
            width="100%"
            overflow="hidden"
            bgcolor="background.paper"
        >
        <Tabs
            value={0}
            sx={{
                "& .MuiTabs-indicator": {
                    display: 'none',
                },
                maxWidth: '100%',
                borderRadius: 1,
            }}
                scrollButtons={false}
                allowScrollButtonsMobile
                variant="scrollable"
            >
                z
                {/* {files.map(id => {
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
                })} */}
            </Tabs>
        </MuiBox>
    );
}