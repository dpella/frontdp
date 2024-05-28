/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import Box from '@mui/material/Box';
import { Slider, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import '../styling/Query3.css';
import { ContinuousSliderProps} from '../types/interfaces';
//import { getAccuracy } from '../api/request';
import { useLocation } from 'react-router-dom';
//import { userInfo } from 'os';
//import { useState, useEffect } from 'react';


/**
 * Displays sliders for adjusting budget parameters, specifically epsilon and optionally delta,
 * within predefined limits based on the budget allocated and consumed.
 * @param {ContinuousSliderProps} props - The properties required for the Continuous Slider component.
 * @param {BudgetInfo} props.budget - The allocated and consumed budget values, providing limits for the sliders.
 * @param {Budget} props.selectedBudget - The current selections for epsilon and delta values.
 * @param {(newBudget: Budget) => void} props.onBudgetChange - Callback function that is triggered when the budget values are adjusted.
 * @param {Confidence} props.confidence - The current selection for confidence value.
 * @param {(newConfidence: Confidence) => void} props.onConfidenceChange - Callback function that is triggered when the confidence value is adjusted.
 */
const ContinuousSlider: React.FC<ContinuousSliderProps> = ({ budget, selectedBudget, onBudgetChange}) => {
    //The commented out const are used for Explore Budget feature that Tumult does not support.
    //const [accuracy, setAccuracy] = useState<number | null>(null);
    //const [open, setOpen] = useState(false);
    const remainingEpsilon = budget.allocated.epsilon - (budget.consumed?.epsilon || 0);
    const hasDelta = budget.allocated.delta > 0;
    const remainingDelta = budget.allocated.delta - (budget.consumed?.delta|| 0);
    const location = useLocation();
    //const { dataset, username } = location.state || {};

     /**
     * Converts the slider value to a string appended with 'ε' to denote epsilon.
     * @param {number} value - The current value of the slider.
     * @returns {string} The formatted string representation of the value.
     */
    function valuetext(value: number) {
        return `${value}ε`;
    }
    
    /**
     * Handles changes to the epsilon slider, updating the selected budget's epsilon value.
     * @param {Event} event - The event object.
     * @param {number | number[]} newValue - The new value of the epsilon slider.
     */
    const handleEpsilonChange = (event: Event, newValue: number | number[]) => {
        onBudgetChange({ ...selectedBudget, epsilon: newValue as number });
    };

     /**
     * Handles changes to the delta slider, updating the selected budget's delta value.
     * @param {Event} event - The event object.
     * @param {number | number[]} newValue - The new value of the delta slider.
     */
    const handleDeltaChange = (event: Event, newValue: number | number[]) => {
        onBudgetChange({ ...selectedBudget, delta: newValue as number });
    };

    /**
     * Handles changes to the confidence slider, updating the selected budget's confidence value. This is a part of the Explore Budget feature.
     * @param {Event} event - The event object.
     * @param {number | number[]} newValue - The new value of the delta slider.
     */

    //In order to use this confidence slider, please uncomment the codes in .css files, in the Multistepform.tsx file, and the code below

    //const handleConfidenceChange = (event: Event, newValue: number | number[]) => {
    //    onConfidenceChange({ ...selectedConfidence, confidence: newValue as number });
    //};

    //const handleOpen = () => {
    //    setOpen(true);
    //};

    //const handleClose = (value: number) => {
    //    setOpen(false);
    //    onBudgetChange(selectedBudget); // Save the changes when closing the dialog
    //};

    //useEffect(() => {
    //    const fetchAccuracy = async () => {
    //        try {
    //            const accuracyValue = await getAccuracy(username, dataset.id, dataset.budget.allocated.epsilon, dataset.budget.allocated.delta ?? 0, selectedConfidence.confidence);
    //           setAccuracy(accuracyValue);
    //        } catch (error) {
    //            console.error('Error fetching accuracy:', error);
    //        }
    //    };

    //    fetchAccuracy();
    //}, [selectedBudget, selectedConfidence, dataset.id, username]); 

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* This is code for the Explore Budget-feature that calculates accuracy depending on selected budget and confidence.
            Tumult Analytics does not support calculation of accuracy, and so this is commented out for future potential work when a solution with Tumult is reached.

            <Box className='box' style={{ marginBottom: '10px', marginTop: '30px', width: 'fit-content' }}>
                <Button variant="contained" onClick={handleOpen}>
                    Explore Budget
                </Button>
            </Box>
            <Dialog open={open} onClose={handleClose} style={{ maxWidth: '300', width: '300' }}>
                <DialogTitle>Explore Budget</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: 500 }}> 
                        <Box sx={{ width: 200 }}>
                            <Typography id="non-linear-slider" gutterBottom color={'#17213B'}>
                                Epsilon: {selectedBudget.epsilon}
                            </Typography>
                            <Slider
                                className='dialogEpsilonSlider'
                                aria-label="Small steps"
                                value={selectedBudget.epsilon}
                                getAriaValueText={valuetext}
                                onChange={handleEpsilonChange}
                                step={0.005}
                                marks
                                min={0}
                                max={remainingEpsilon}
                                valueLabelDisplay="auto"
                            />
                        </Box>
                        {hasDelta && (
                        <Box sx={{ width: 200 }}>
                            <Typography id="non-linear-slider" gutterBottom color={'#17213B'}>
                                Delta: {selectedBudget.delta}
                            </Typography>
                            <Slider
                                className='dialogEpsilonSlider'
                                aria-label="Small steps"
                                value={selectedBudget.delta ?? 0}
                                getAriaValueText={valuetext}
                                onChange={handleDeltaChange}
                                step={0.005}
                                marks
                                min={0}
                                max={remainingDelta}
                                valueLabelDisplay="auto"
                            />
                        </Box>
                        )}
                        <Box sx={{ width: 200 }}>
                            <Typography id="non-linear-slider" gutterBottom color={'#17213B'}>
                                Confidence: {selectedConfidence.confidence}
                            </Typography>
                            <Slider
                                className='dialogEpsilonSlider'
                                aria-label="Small steps"
                                value={selectedConfidence.confidence}
                                getAriaValueText={valuetext}
                                onChange={handleConfidenceChange}
                                step={0.005}
                                marks
                                min={0}
                                max={1}
                                valueLabelDisplay="auto"
                            />
                        </Box>
                    </Box>
                    <Box>
                        <Typography id="non-linear-slider" gutterBottom color={'#17213B'}> Accuracy: {accuracy}</Typography> 
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(selectedBudget.epsilon)} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            */}
            <div>
                <Typography variant="h5"sx={{marginBottom: 4,marginTop:4, textAlign: "center"}}>Set budget</Typography>
                <Box display={'flex'} flexDirection={'row'} justifyContent={hasDelta ? 'space-around' : 'center'} sx={{ maxWidth: '600px', margin: 'auto' }}>
                    <Box sx={{ width: 200 }}>
                        <Typography id="non-linear-slider" gutterBottom>
                            Epsilon: {selectedBudget.epsilon}
                        </Typography>
                        <Slider
                            className='epsilonSlider'
                            aria-label="Small steps"
                            value={selectedBudget.epsilon}
                            getAriaValueText={valuetext}
                            onChange={handleEpsilonChange}
                            step={0.005}
                            marks
                            min={0}
                            max={remainingEpsilon}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                    {hasDelta && (
                        <Box sx={{ width: 200, marginLeft:10}}>
                            <Typography id="non-linear-slider" gutterBottom>
                                Delta: {selectedBudget.delta}
                            </Typography>
                            <Slider
                                className='epsilonSlider'
                                aria-label="Small steps"
                                value={selectedBudget.delta ?? 0}
                                getAriaValueText={valuetext}
                                onChange={handleDeltaChange}
                                step={0.005}
                                marks
                                min={0}
                                max={remainingDelta}
                                valueLabelDisplay="auto"
                            />
                        </Box>
                    )}
                </Box>
        </div>
    </div>    
    );
}
export default ContinuousSlider;