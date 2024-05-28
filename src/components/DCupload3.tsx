/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {Box, FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography, useTheme} from "@mui/material";
import '../styling/DCupload3.css';
import React, {useEffect, useState} from "react";
import {Budget} from "../types/interfaces";

/**
 * @param {IDCupload3} props - Props for `DCUpload3` component.
 * @param {string} props.privacyNotion - A string representing the chosen privacy notion
 * @param {Budget} props.totalBudget - A Budget prop representing the total budget of the dataset.
 * @param {(privacyNotion: string) => void} props.updatePrivacyNotion - Callback to invoke when the privacy notion is changed.
 * @param {(budget: Budget) => void} props.updateTotalBudget - Callback to invoke when the budget of the dataset changes.
 */
interface IDCupload3{
    privacyNotion : string
    totalBudget : Budget;
    updatePrivacyNotion : (privacyNotion : string) => void;
    updateTotalBudget : (budget : Budget) => void;
}

/**
 * A component that allows the users to choose a privacy notion for the dataset and give it a total budget
 */
const DCUpload3 : React.FC<IDCupload3> = ({privacyNotion, totalBudget, updatePrivacyNotion, updateTotalBudget}) => {
    // Using MUI theme for consistent styling across the app
    const theme = useTheme()

    //States that handles the changes of epsilon and delta values.
    const [epsilon, setEpsilon] = useState<string>('0'); 
    const [delta, setDelta] = useState<string>('0');

    //Effect hook to set the values of the dataset's total_budget parameter depending on the values inputed by the user (epsilon, delta)
    useEffect(() => {
            const newtotalBudget = totalBudget;
            newtotalBudget.delta = parseFloat(delta);
            newtotalBudget.epsilon = parseFloat(epsilon);

            if (isNaN(newtotalBudget.delta)) {
                setDelta('');
            }
            if (isNaN(newtotalBudget.epsilon)) {
                setEpsilon('');
            } else {
                updateTotalBudget(newtotalBudget);
            }
    },[delta, epsilon])

    return (
        <Stack className="center" direction="column" alignItems="center" sx={{marginTop: 5}}>
            <Typography variant="h6" borderBottom={1} sx={{marginBottom: 2}}>Choose Privacy Notion</Typography>
            <FormControl>
                <RadioGroup
                    aria-labelledby="radio-p-button"
                    value={privacyNotion}
                    onChange={event => {updatePrivacyNotion(event.target.value)}}
                    sx={{display: 'flex',
                    flexDirection: 'row'}}
                    >
                    <FormControlLabel value="PureDP" control={<Radio sx={{color: theme.palette.secondary.main, '&.Mui-checked': {color: theme.palette.secondary.main}}}/>} label="PureDP" />
                    <FormControlLabel value="ApproxDP" control={<Radio sx={{color: theme.palette.secondary.main, '&.Mui-checked': {color: theme.palette.secondary.main}}}/>} label="ApproxDP" />
                </RadioGroup>
            </FormControl>

        <Typography variant="h6" borderBottom={1} sx={{marginTop: 5, marginBottom: 2}}>Set total budget</Typography>
            <Stack flexDirection="row" justifyContent="center" justifyItems="space-evenly">
            <Box marginRight={privacyNotion === "ApproxDP" ? 2 : 0}>
                <Typography borderBottom={1} marginY={1}>Epsilon</Typography>
                <input className={'inputField'}
                type="number"
                min="0"
                step="0.001"
                value={epsilon}
                onChange={(e) => {
                    // Validate input to ensure it's a valid number and not negative
                    if (/^\d*\.?\d*$/.test(e.target.value) && e.target.value !== '-') {
                        setEpsilon(e.target.value);
                    }
                }}
            />
            </Box>
            {privacyNotion === "ApproxDP" && <Box marginRight={2}>                    
                <Typography borderBottom={1} marginY={1}>Delta</Typography>
            <input className={'inputField'}
            type="number"
            min="0"
            step="0.0001"
            value={delta}
            onChange={(e) => {
                // Validate input to ensure it's a valid number and not negative
                if (/^\d*\.?\d*$/.test(e.target.value) && e.target.value !== '-') {
                    setDelta(e.target.value);
                }
            }}
            />
            </Box>}
            </Stack>
        </Stack>
    )
}

export default DCUpload3;