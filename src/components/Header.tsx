/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {AppBar, Button, Toolbar, IconButton} from '@mui/material';
import '../styling/Header.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from "./UserContext";
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from "../api/request";

/**
 * Header displays a navigation bar with dynamic links based on the user's role and includes a logout button.
 */
export function Header() {
  const navigate = useNavigate(); // Hook to handle navigation
  const { user } = useUser(); // Accessing user contex

  /**
   * Navigate to specific pages based on user roles when the Home button is clicked.
   */
  function handleHome (){
    if(user?.roles.includes('Curator')){
      navigate('/data-curator')
    }else if(user?.roles.includes('Admin')){
      navigate('/admin')
    }
    else if(user?.roles.includes('Analyst')){
      navigate('/DAFS')
    }
    else{
      navigate('/login')
    }
    
  }

  /**
   * Logs out the user and navigates to the home page, then reloads the window.
   */
  function handleLogOut (){
    logout()
    navigate('/')
    window.location.reload();
  }

  return (
    <AppBar position="static" >
      <Toolbar className="toolbar">
        <div className="logo-wrapper">
        <Button onClick={() => {handleHome()}}>
          <img src="logo.png" className="logo" alt="logo"/>
        </Button>
        </div>
        <div className="buttons">
          <Button color="inherit" onClick={() => {handleHome()}} >Home</Button>
          <Button color="inherit" onClick={() => navigate(`/aboutdp`)} >About</Button>
          {user ? (
              <IconButton  onClick={() => {handleLogOut()}}
                           sx={{ color: '#E06666' }}>
                <LogoutIcon />
              </IconButton>
          ) : null}
        </div>
      </Toolbar>
    </AppBar>
  );
}
export default Header;