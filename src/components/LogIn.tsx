/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { UserForm } from "./UserForm";
import { useState } from "react";
import {loginUser, getUserInfo} from "../api/request"
import { useNavigate } from 'react-router-dom';
import { useUser } from "./UserContext";

/**
 * This component utilizes a `UserForm` for user input, performs user authentication
 * and routing based on the user's roles.
 */
const LogIn = () =>  {
   // Navigation hook to navigate between routes
   const navigate = useNavigate();

   // State to store potential error messages related to user login.
   const [errorMsg, setErrorMsg] = useState<string | undefined>();

   // Access the current user's context to personalize content.
   const { setUser } = useUser();
   /**
    * Attempts to log in a user with a username and password.
    * Upon successful login, the user's information is fetched and the user context is updated.
    * Depending on the user's roles, the application navigates to different routes.
    * @param username 
    * @param password 
    */
   const sendLoginRequest = async (username: string, password: string) => {
      try {
         await loginUser(username, password);
         const userInfo = await getUserInfo(username);
         if (userInfo) {
           setUser({ name: userInfo.name, roles: userInfo.roles , handle:username});
            if (userInfo.roles.includes('Curator')) {
            navigate('/data-curator');
            } 
            if(userInfo.roles.includes('Analyst')){
            navigate('/DAFS');
            }
            if(userInfo.roles.includes('Admin')){
               navigate('/admin');
            }
         } 
         else {
           setErrorMsg('Could not get userInfo.');
         }
      } 
      catch (error) {
         console.error(error);
         setErrorMsg('Error, try again');
       }
     };
   return (<UserForm submitText="Log in" errorText={errorMsg} handleSubmit={sendLoginRequest} />);
}
export default LogIn;


