// @flow
import React, { useState } from 'react';
import 'react-resizable/css/styles.css';
import { Paper, Stack } from '@mui/material';
import Body from './body/Body';
import Footer from './footer/Footer';
import { useTeleconference } from '../../utils/useTeleconferenceProvider';

export const maxScreen = 15;

export default function Container () {
    const [page, setPage] = useState(1);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <React.Fragment>
            <Paper
                sx={{
                    overflow: 'hidden',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    border: 'radi'
                }}
            >
                <Stack
                    display="flex"
                    flex={1}
                    position="relative"
                >
                    <Stack
                        display="flex"
                        flex={1}
                        position="relative"
                        justifyItems="center"
                        alignItems="center"
                        overflow="hidden"
                        p={.25}
                        borderRadius={2.5}
                    >
                        <Body
                            page={page}
                        />
                    </Stack>
                    <Stack
                        width="100%"
                        bottom={0}
                        justifyContent="center"
                        alignItems="center"
                        overflow="hidden"
                    >
                        <Footer
                            page={page}
                            handleChangePage={handleChangePage}
                        />
                    </Stack>
                </Stack>
            </Paper>
        </React.Fragment>
    )
}