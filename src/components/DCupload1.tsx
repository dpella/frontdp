/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {Stack, Typography, useTheme} from "@mui/material";
import '../styling/DCUP1.css';
import React, {useState} from "react";
import { NameSelectorProps } from "../types/interfaces";

/**
 * A component that allows users to select variables from a dataset schema for further query configuration.
 * It supports selecting individual variables, editing their labels, and applying selections to the whole set.
 * @param {NameSelectorProps} props - Props for `NameSelector` component.
 * @param {string} props.dataSetName - The original datasetname .
 * @param {(datasetname: string) => void} props.updateDataSetName - Callback to invoke when the datasetname variables change.
 */
const NameSelector : React.FC<NameSelectorProps>  = ({dataSetName, updateDataSetName}) =>{
    // Using MUI theme for consistent styling across the app
    const theme = useTheme();

    return (
            <Stack className="center" sx={{marginTop: 10}}>
                <Typography variant="h6" borderBottom={1} sx={{marginBottom: 5}}>Enter name of dataset:</Typography>
                <label htmlFor={'datasetname'}></label>
                <input
                    data-testid={'datasetname'}
                    type={'text'}
                    defaultValue={dataSetName} //{dataSetName.replace(/\.[^/.]+$/, "")} if you want to get rid of .extension
                    onBlur={event => {
                        updateDataSetName(event.target.value)
                    }} className="inputNameField"/>
                <br/>
            </Stack>
    );
};


export default NameSelector;