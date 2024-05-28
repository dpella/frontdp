/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { TextField } from '@mui/material';
import { TextFieldAdminProps } from '../types/interfaces';
/**
 * TextFieldAdmin is a component that renders a MUI TextField with custom styling.
 * It is designed to be used across the admin page when text input field is required.
 *
 * @param {TextFieldAdminProps} props - The properties passed to the component based on `TextFieldAdminProps` interface.
 * @param {string} props.value - The current value of the text field, which is controlled by the parent component's state.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onChange - The function to call when the text field's value changes.
 * @param {string} props.placeholder - A placeholder text to display in the text field when it is empty, providing a hint to the user about the expected input.
 */
const TextFieldAdmin: React.FC<TextFieldAdminProps> = ({ value, onChange, placeholder}) => {
    return (
    <TextField
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant="outlined"
        margin="dense"
        size="small"
        InputProps={{
            style: {
            color: 'black', 
            backgroundColor: 'white', 
            },
        }}
        />
    );
};

export default TextFieldAdmin;
