import React, { useState } from 'react';
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
            
            <Divider
                variant="middle"
                sx={{
                    position: 'relative',
                    top: '30px'
                }}
            >
                    <Chip 
                        //size="small" 
                        label={date} 
                        sx={{opacity: 0}} 
                    />
            </Divider>
            <MuiBox 
                component={ListSubheader}
                bgcolor="transparent"
                mb={2}
                justifyContent="center"
                display="flex"
                pt={.5}
            >

                    <Chip 
                        size="small" 
                        label={date} 
                        sx={{
                            //bgcolor: 'primary.main',
                            //border: theme => `1px solid ${theme.palette.divider}`,
                        }} 
                    />
            </MuiBox>
            {
                messages?.map((message, index, messages) => (
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