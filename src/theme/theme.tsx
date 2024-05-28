/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { createTheme } from "@mui/material";

/**
 * A MUI theme which is created in order to make it easier to inherit the same theme on all pages.
 */
export const theme = createTheme({
    palette: {
        primary: {
          main: '#6AA84F',
          light: '#BCBCBC'
        },
        secondary: {
          main: '#BCBCBC'
        },
        background: {
          default: '#2B2B2B'
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                borderRadius: 20,
                },
            },
        }
    }   
});