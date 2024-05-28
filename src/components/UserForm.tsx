/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
   Button, Card, Container, FilledInput, FormControl, FormHelperText,
   IconButton, InputAdornment, InputLabel, Stack, TextField
} from "@mui/material";
import { FormEvent, useState } from "react";
import Header from "./Header";
import '../styling/UserForm.css';
import { useTheme } from "@mui/material/styles";

// The different Userform fields
type UserFormField = "username" | "password";

/**
 * A function that returns a user form where the user can insert its credentials in order to login.
 * @param {string} submitText - The text to display on the submit button.
 * @param {UserFormField} [errorField] - The field (either "username" or "password") that has an error. Optional.
 * @param {string} [errorText] - The error message to display if there is an error. Optional.
 * @param {(username: string, password: string) => void} handleSubmit - The function to call when the form is submitted, with the username and password as arguments.
 * @returns {JSX.Element} - A JSX element representing the user form.
 */
export function UserForm ({submitText, errorField, errorText, handleSubmit }: {
    submitText: string
    errorField?: UserFormField
    errorText?: string
    handleSubmit: (username: string, password: string) => void}) {
   const [username, setUsername] = useState<string>("");
   const [password, setPassword] = useState<string>("");

   const theme = useTheme();

   return (
      <Stack sx={{background: theme.palette.primary.main, minHeight: '100vh'}}>
      <Header/>
      <Container maxWidth="sm" sx={{ mt: 20 }}>
         <form onSubmit={(e: FormEvent) => {
            e.preventDefault();
            handleSubmit(username, password);
         }}
         >
            <Card sx={{ width: 450 }}>
               <Stack spacing={2} sx={{ m: 2 }} >
                  <UserNameField
                     hasError={errorField === "username" || errorField === undefined && errorText !== undefined }
                     content={username}
                     setContent={setUsername}/>
                  <PasswordField
                     hasError={errorField === "password" || errorField === undefined && errorText !== undefined }
                     content={password}
                     setContent={setPassword} />
                  {errorText && <FormHelperText error>{errorText}</FormHelperText>}
                  <Button
                     type="submit"
                     variant="contained"
                     color="secondary"
                  >
                     {submitText}
                  </Button>
               </Stack>
            </Card>
         </form>
      </Container>
      </Stack>
   );
}

/**
 * A component for rendering the username input field in the user form.
 * @param {Object} props - The component props.
 * @param {boolean} props.hasError - Indicates whether the username field has an error.
 * @param {string} props.content - The current value of the username input.
 * @param {(username: string) => void} props.setContent - The function to update the username value.
 * @returns {JSX.Element} - A JSX element representing the username input field.
 */
function UserNameField({ hasError, content, setContent }: {
   hasError: boolean,
   content: string,
   setContent: (username: string) => void
}) {
   return (
      <TextField className="rounded-lg" /*id="filled-basic"*/ label="Username" /*variant="filled"*/ error={hasError}
         value={content}
         onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setContent(event.target.value);
         }}
      />
   );
}

/**
 * A component for rendering the password input field in the user form.
 * @param {Object} props - The component props.
 * @param {boolean} props.hasError - Indicates whether the password field has an error.
 * @param {string} props.content - The current value of the password input.
 * @param {(password: string) => void} props.setContent - The function to update the password value.
 * @returns {JSX.Element} - A JSX element representing the password input field.
 */
function PasswordField({ hasError, content, setContent }: {
   hasError: boolean,
   content: string,
   setContent: (password: string) => void
}) {
   const [showPassword, setShowPassword] = useState(false);
   const handleClickShowPassword = () => setShowPassword((show) => !show);
   const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
   };

   return (
      <FormControl variant="filled">
         <InputLabel error={hasError} htmlFor="filled-adornment-password">Password</InputLabel>
         <FilledInput
            error={hasError}
            id="filled-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={content}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
               setContent(event.target.value);
            }}
            endAdornment={
               <InputAdornment position="end">
                  <IconButton
                     aria-label="toggle password visibility"
                     onClick={handleClickShowPassword}
                     onMouseDown={handleMouseDownPassword}
                     edge="end"
                  >
                     {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
               </InputAdornment>
            }
         />
      </FormControl>
   );
}