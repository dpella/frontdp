/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {CssBaseline,ThemeProvider, createTheme
} from "@mui/material";
import {Routes, Route} from "react-router-dom";
import { StartPage } from "./components/StartPage";
import  LogIn  from "./components/LogIn";
import {DAFS}   from "./components/DAFS";
import Multistepform from './components/MultiStepForm'
import { DCscreenOne } from "./components/DCscreenOne";
import MultiStepFormDC from "./components/MultiStepFormDC";
import { UserProvider } from "./components/UserContext";
import QueryResult from "./components/QueryResults";
import {AssignAnalyst} from "./components/AssignAnalyst";
import AdminUsersPage from "./components/AdminUsersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutDP from "./components/AboutDP";
import EditDataset from "./components/EditDataset";
import { editDataset } from "./api/request";



function App() {

  const theme = createTheme({
    typography: {
      fontFamily: 'Gilroy, sans-serif',
      fontWeightRegular: 400,
      fontWeightMedium: 500, 
      body1: {
        color: '#BCBCBC',
      },
      body2: {
        color: 'black',
      },
    },
    palette: {
        primary: {
          main: '#2B2B2B',
        },
        secondary: {
          main: '#6AA84F'
        },
        error: {
          main: '#E06666'
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                contained: {
                borderRadius: 20,
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#92C56E',
                },
                fontWeight: 500
                },
                root: {
                  textTransform: 'none',
                },
            },
        },
        MuiCssBaseline: {
          styleOverrides: `
            @font-face {
              font-family: 'Gilroy';
              font-style: normal;
              font-display: swap;
              font-weight: 400;
              src: local('Gilroy-Regular'), url(./assets/Gilroy-Regular.ttf) format('truetype');
              unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
            }

            @font-face {
              font-family: 'Gilroy';
              font-style: normal;
              font-display: swap;
              font-weight: 500;
              src: local('Gilroy-Medium'), url(./assets/Gilroy-Medium.ttf) format('truetype');
              unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
            }
          `,
        },
    }   
});


  return (
  <>
  <UserProvider>
  <ThemeProvider theme={theme}>
    <CssBaseline/>
    <Routes>
        <Route path="/" element={<StartPage />}/>
        <Route path="/login" element={<LogIn/>}/>
        <Route path="/aboutdp" element={<AboutDP/>}/>
        <Route path="/multistep" element={
          <ProtectedRoute allowedRoles={['Analyst']}>
           < Multistepform/>
          </ProtectedRoute>
        }/>
        <Route path="/DAFS" element={
          <ProtectedRoute allowedRoles={['Analyst']}>
           < DAFS/>
          </ProtectedRoute>
        }/>
        <Route path="/data-curator" element={
          <ProtectedRoute allowedRoles={['Curator']}>
           < DCscreenOne/>
          </ProtectedRoute>
        }/>
        <Route path="/multistep-DC" element={
          <ProtectedRoute allowedRoles={['Curator']}>
           < MultiStepFormDC/>
          </ProtectedRoute>
        }/>
        <Route path="/queryResult" element={
          <ProtectedRoute allowedRoles={['Analyst']}>
           < QueryResult/>
          </ProtectedRoute>
        }/>
        <Route path="/assignAnalyst" element={
          <ProtectedRoute allowedRoles={['Curator']}>
           < AssignAnalyst/>
          </ProtectedRoute>
        }/>
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['Admin']}>
           < AdminUsersPage/>
          </ProtectedRoute>
        }/>
        <Route path="/editDataset" element={
          <ProtectedRoute allowedRoles={['Curator']}>
           <EditDataset updateDatasetInfo={editDataset} />
          </ProtectedRoute>
        }/>
    </Routes>
    </ThemeProvider>
    </UserProvider>
  </>
  );
}

export default App;
