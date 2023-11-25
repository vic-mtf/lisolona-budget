import React, { useMemo } from "react";
import { Box as MuiBox, Stack } from '@mui/material';
import Avatar from "../../../../../components/Avatar";


const Message = React.memo(({data, directions}) => {
    const [, direction, lastDir] = useMemo(() => directions, [directions]);

    return (
        <MuiBox
            display="flex"
            justifyContent={direction}
            flexDirection="row"
            overflow="hidden"
            mx={direction === 'right' ? 6.5 : 1}
            sx={{
                paddingBottom: direction === lastDir ? '1px' : 2,
                ml: 1,
                mr: {
                    sm: 1,
                    md: direction === 'right' ? 6.5 : 1,
                }
            }}
        >
            <Stack
                direction='row'
                spacing={1}
                width="100%"
            >
                <MuiBox>
                    <Avatar
                        sx={{
                            width: 30,
                            height: 30,
                        }}
                    />
                </MuiBox>
                <MuiBox
                    flexGrow={1}
                >
                    <MuiBox
                        flexDirection="row"
                        display="flex"
                        overflow="hidden"
                        component="span"
                        justifyContent={direction}
                        // bgcolor="orange"
                    >Date
                    </MuiBox>
                    <MuiBox
                        // bgcolor='red'
                        overflow="hidden"
                        flexDirection="row"
                        justifyContent={direction}
                        display="flex"
                    >
                        <MuiBox
                            // bgcolor="plum"
                            width="85%"
                            overflow="hidden"
                            flexDirection="row"
                            justifyContent={direction}
                            display="flex"
                        >
                            <MuiBox
                                overflow="hidden"
                                display="inline-block"
                                maxHeight="100%"
                                bgcolor="tomato"
                            >
                                {data?.content}
                            </MuiBox>
                        </MuiBox>
                    </MuiBox>
                </MuiBox>
            </Stack>
        </MuiBox>
    );
});

export default Message;