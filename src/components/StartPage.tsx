/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { Header } from "./Header";
import '../styling/StartPage.css';
import { useTheme } from "@mui/material/styles";

/**
 * A component that returns the Start page of the application and presenting the FrontDP logo aswell as a Login Button
 */
export function StartPage ( ) {
   const theme = useTheme();
   const navigate = useNavigate();

    return (
    <Stack sx={{background: theme.palette.primary.main, minHeight: '100vh'}}>
      <Header/>
        <Box className="centering mt-32 mb-10">
            <img src="logo_square.png" className="logo-m" alt="logo-m"/>
        </Box>
        <Box className="centering logsignbuttons">
                <Button variant="contained" color="secondary" onClick={() => {navigate('/login')}}>Log In</Button>
        </Box>
    </Stack>
    )
 }