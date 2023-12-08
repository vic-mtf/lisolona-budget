import React, { useMemo } from "react";
import { Box as MuiBox, Stack, useTheme, alpha } from '@mui/material';
import AvatarStatus from "../../../../../components/AvatarStatus";
import useGetSender from "../infinite-loader-message/useGetSender";
import getFullName from "../../../../../utils/getFullName";
import Typography from "../../../../../components/Typography";
import getHoursAndMin from "./getHoursAndMin";
import Text from "./text/Text";
import useBorderRadius from "./getBorderRadius";
import { grey } from '@mui/material/colors';
import ExpireTimeout from "./ExpireTimeout";

const Message = React.memo(({ data, group, small }) => {

    const direction = useMemo(() => group?.direction, [group]); 
    const isLast = useMemo(() => group?.isLast, [group]); 
    const isFirst = useMemo(() => group?.isFirst, [group]); 
    const sender = useGetSender(data);
    const borderRadius = useBorderRadius({isFirst, isLast, direction});
    const theme = useTheme();
    const color = useMemo(() =>
        direction === 'left' ?  
        theme.palette.background.paper : 
        theme.palette.mode === 'light' ? grey[100] :
        alpha(theme.palette.primary.main, .5) 
    ,[direction, theme]);

    return (
        <MuiBox
            display="flex"
            justifyContent={direction}
            flexDirection="row"
            overflow="hidden"
            mx={2}
            sx={{
                paddingBottom: isLast ? '1px' : 2,
                mr: {
                    sm: 2,
                    md: direction === 'right' && !small ? 6.5 : 2,
                }
            }}
        >
            <Stack
                direction='row'
                spacing={1}
                width="100%"
            >
                <MuiBox>
                    {direction === 'left' &&
                    <MuiBox
                        width={30}
                        height={30}
                    >
                        {!isFirst &&
                            <AvatarStatus
                                size={30}
                                name={getFullName(sender)}
                                id={sender?._id}
                                avatarSrc={sender?.imageUrl}
                                invisible
                            />
                        } 
                    </MuiBox>}
                </MuiBox>
                <MuiBox
                    flexGrow={1}
                >
                   {!isFirst &&
                   <MuiBox
                        flexDirection="row"
                        display="flex"
                        overflow="hidden"
                        component="span"
                        justifyContent={direction}
                    >
                      <Typography 
                        variant="caption"
                        color='text.secondary'
                    >
                            {direction === 'left' && getFullName(sender) + ', '} 
                            {getHoursAndMin(data?.createdAt)}
                      </Typography>
                    </MuiBox>}
                    <MuiBox
                        overflow="hidden"
                        flexDirection="row"
                        justifyContent={direction}
                        display="flex"
                        alignItems="end"
                        position="relative"
                    >
                        <MuiBox
                            width="90%"
                            overflow="hidden"
                            flexDirection="row"
                            justifyContent={direction}
                            display="flex"
                        >
                            <MuiBox
                                overflow="hidden"
                                display="inline-block"
                                maxHeight="100%"
                                borderRadius={borderRadius}
                                bgcolor="background.paper"
                            >
                                <Text
                                    content={data?.content}
                                    bgcolor={color}
                                />
                            </MuiBox>
                        </MuiBox>
                        <ExpireTimeout 
                            invisible={direction === 'left' || data?.sended}
                            fontSize="small" 
                            createdAt={data?.createdAt}
                        />
                    </MuiBox>
                </MuiBox>
            </Stack>
        </MuiBox>
    );
});

export default Message;