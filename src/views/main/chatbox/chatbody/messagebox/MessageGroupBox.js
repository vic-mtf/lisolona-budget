import React from 'react';
import {
    Box as MuiBox, 
    Chip, 
    Divider, 
    ListSubheader
} from '@mui/material';
import MessageBox from './MessageBox';

export default function MessageGroupBox ({date, messages}) {

    return (
        <MuiBox
            mb={10}
        >
            <MuiBox 
                component={ListSubheader}
                bgcolor="transparent"
                mb={2}
            >
                <Divider
                    variant="middle"
                >
                    <Chip 
                        //size="small" 
                        label={"12/05/2022"} 
                        sx={{
                            bgcolor: 'background.paper',
                            border: theme => `1px solid ${theme.palette.divider}`,
                        }} 
                    />
                </Divider>
            </MuiBox>
            {
                messages.map(message => {
                    const isYourself = Math.random() > .5;
                    const userId = isYourself ? 'aaaa_': ['aaaa_b', 'aaaa_c'][
                        Math.round(Math.random() * 3)
                    ];
                    return ({
                        ...message, 
                        userId,
                        isYourself
                    });

                }).map((message, index, messages) => (
                    <MessageBox
                        key={index} 
                        {...message}
                        hideAvatar={
                            messages[index + 1]?.userId === message?.userId
                            
                        }
                        joinBox={
                            messages[index - 1]?.userId === message?.userId
                        }
                    />
                ))
            }
        </MuiBox>
    );
}