/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {Box, Stack, Typography} from "@mui/material";
import '../styling/DCupload3.css';
import React, {useEffect, useState} from "react";
import {IEditDataset2} from "../types/interfaces";

/**
 * A component used to allow the user to edit the budget of the dataset
 * @param {IEditDataset2} props - Props for `NameSelector` component.
 * @param {string} props.privacyNotion - The privacy notion of the dataset.
 * @param {Budget} props.totalBudget - The total budget of the dataset.
 * @param {(budget: Budget) => void} props.updateTotalBudget - Callback to invoke when the budget changes.
 */
const EditDataset2 : React.FC<IEditDataset2> = ({privacyNotion, totalBudget, updateTotalBudget}) => {
    //States for handling when the epsilon and delta values changes in the input fields
    const [epsilon, setEpsilon] = useState<string>('0');
    const [delta, setDelta] = useState<string>('0');

    //Effect hook for setting the values of the dataset's total_budget parameter depending on the values inputed by the user (epsilon, delta)
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

export default EditDataset2;
