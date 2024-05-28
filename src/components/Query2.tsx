/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Box, Switch, FormControlLabel, Typography, RadioGroup, Radio, useTheme, Slider } from '@mui/material';
import '../styling/Query2.css';
import ToggleButton from './ToggleButton';
import { useState, useEffect } from 'react';
import { QuerySelectorProps } from '../types/interfaces';

/**
 * Component for selecting statistical parameters, variables, and budget.
 * Provides a user interface for dynamic query configuration based on the selected parameters and options.
 *
 * @param {QuerySelectorProps} props - Properties required for the Query Selector component.
 * @param {Variable[]} props.variables - List of variables available for selection.
 * @param {(data: QueryData) => void} props.onDataSelected - Callback function triggered when any selection data changes.
 * @param {QueryData} props.selectedData - Current state of selections including variable, statistics type, and other configurations.
 */
const QuerySelector: React.FC<QuerySelectorProps> = ({ variables, onDataSelected, selectedData}) => {
  // Using MUI theme for consistent styling across the app
  const theme = useTheme();

  // State management for various selections and configurations within the component.
  const [selectedVariable, setSelectedVariable] = useState(selectedData.variable);
  const [selectedGroupBy, setSelectedGroupBy] = useState(selectedData.groupBy);
  const [selectedStatistics, setSelectedStatistics] = useState(selectedData.statistics);
  const [showHistogram, setShowHistogram] = useState(selectedData.showHistogram || false);
  const [binOptions, setBinOptions] = useState('');
  const [enumOptions, setEnumOptions] = useState<string[]>(selectedData.enumOptions || []);
  const [equalBinsNumber, setEqualBinsNumber] = useState<number>(selectedData.equalBinsNumber || 2);

  // Fetches the detailed object of the currently selected variable for grouping from the list of all available variables.
  const selectedGroupByVariable = variables.find(variable => variable.name === selectedGroupBy?.name);

  // Determining if the selected group by variable is an enumeration type for specific binning options.
  const isEnumSelected = selectedGroupByVariable && selectedGroupByVariable.type.name === 'Enum';

  /**
  *  Retrieves a filtered list of variables based on the selected statistics.
  */
  const getFilteredVariables = () => {
    if (selectedStatistics === "count") {
      return [{ name: 'rows', type: { name: 'Special' } }];
    } else {
      return variables.filter(v => v.type.name === 'Int' || v.type.name === 'Double');
    }
  };

  /** 
   * Effect to update the parent component whenever selection changes occur. 
   */
  useEffect(() => {
    if (selectedVariable && selectedStatistics) {
      onDataSelected({
        ...selectedData, 
        statistics: selectedStatistics,
        variable: selectedVariable,
        groupBy: selectedGroupBy,
        equalBinsNumber: equalBinsNumber,
        showHistogram: showHistogram,
      });
    }
  }, [selectedVariable, selectedStatistics, selectedGroupBy, onDataSelected, equalBinsNumber, showHistogram]);
  
  /** 
   * Effect to synchronize the bin options from external changes. 
   */
  useEffect(() => {
    setBinOptions(selectedData.binOptions || '');
  }, [selectedData.binOptions]);

  // Calculate the maximum value for the bin sliders.
  let actualHigh = selectedGroupByVariable && selectedGroupByVariable.type.high;
  let min = 0, max = 1;
  if (selectedGroupByVariable && selectedGroupByVariable.type.low !== undefined && selectedGroupByVariable.type.high !== undefined) {
    min = selectedGroupByVariable.type.low;
    max = selectedGroupByVariable.type.high - min > 100 ? 100 : selectedGroupByVariable.type.high - min;
  }
  
   /**
   * Toggle the selection of enumeration options for histogram grouping.
   * @param {string} label - The label of the enumeration option to toggle.
   */
  const handleEnumOptionChange = (label: string) => {
    const currentIndex = enumOptions.indexOf(label);
    const newEnumOptions = [...enumOptions];

    if (currentIndex === -1) {
      newEnumOptions.push(label);
    } else {
      newEnumOptions.splice(currentIndex, 1);
    }

    setEnumOptions(newEnumOptions);
    onDataSelected({ ...selectedData, enumOptions: newEnumOptions });
  };

  /** 
   * Handles changes to the 'Show Histogram' switch.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event triggered by toggling the switch.
   */
  const handleShowHistogramChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newShowHistogram = event.target.checked;
    onDataSelected({
      ...selectedData,
      showHistogram: newShowHistogram
    });
    setShowHistogram(newShowHistogram);
  };

  /** 
   * Handles slider changes to set the number of equal bins.
   * @param {Event} event - The event triggered by slider change.
   * @param {number | number[]} newValue - The new value of the slider, expected to be a number.
   */
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setEqualBinsNumber(newValue as number);
    onDataSelected({
      ...selectedData,
      equalBinsNumber: newValue as number
    });
  };

  /** 
   * Handles radio button changes to set the binning option.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event triggered by radio button change.
   */
  const handleBinOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBinOptions = event.target.value;
    setBinOptions(newBinOptions);
    onDataSelected({
      ...selectedData,
      binOptions: newBinOptions
    });
  };

  return (
    <div>
    <Typography variant="h5"sx={{marginBottom: 4,marginTop:4, textAlign: "center"}}>Which single-variable statistic would you like to use? </Typography>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="5vh"
    >
    <ToggleButton
    text="mean"
    onClick={() => setSelectedStatistics("mean")}
    selected={selectedStatistics === "mean"}
    />
    <ToggleButton
    text="sum"
    onClick={() => setSelectedStatistics("sum")}
    selected={selectedStatistics === "sum"}
    />
     <ToggleButton
    text="minimum"
    onClick={() => setSelectedStatistics("min")}
    selected={selectedStatistics === "min"}
    />
     <ToggleButton
    text="maximum"
    onClick={() => setSelectedStatistics("max")}
    selected={selectedStatistics === "max"}
    />
     <ToggleButton
    text="count"
    onClick={() => setSelectedStatistics("count")}
    selected={selectedStatistics === "count"}
    />
    </Box>
    <Typography variant="h5"sx={{marginBottom: 4,marginTop:4, textAlign: "center"}}>Which variable would you like to use?</Typography>
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="5vh">
        {getFilteredVariables().map(variable => (
          <ToggleButton key={variable.name} text={variable.name} onClick={() => setSelectedVariable(variable.name)} selected={selectedVariable === variable.name} />
        ))}
    </Box>
    <Typography variant="h5"sx={{marginBottom: 4,marginTop:4, textAlign: "center"}}>Bar Chart?</Typography>
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="5vh">
      <Switch color="secondary" checked={showHistogram} onChange={handleShowHistogramChange} />
    </Box>
    {showHistogram && (
        <Box>
        <Typography variant="h5"sx={{marginBottom: 4,marginTop:4, textAlign: "center"}}>Group by </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="5vh">
          {variables.filter(v => v.type.name !== 'Text').map((variable) => (
            <ToggleButton
              key={variable.name}
              text={variable.name}
              onClick={() => setSelectedGroupBy(variable)}
              selected={selectedGroupBy === variable}
            />
          ))}
        </Box>
      </Box>
    )}
    {showHistogram && (selectedGroupBy?.type.name==="Int" || selectedGroupBy?.type.name==="Double") && (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5"sx={{marginBottom: 4,marginTop:4, textAlign: "center"}}>Choose option for bins </Typography>
        <RadioGroup
          aria-labelledby="bin-option-radio-buttons-group"
          name="bin-options"
          value={binOptions}
          onChange={handleBinOptionChange}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
        {actualHigh && actualHigh <= 100 && (
        <FormControlLabel value="One bin per value" control={<Radio sx={{color: theme.palette.secondary.main, '&.Mui-checked': {color: theme.palette.secondary.main}}}/>} label="One bin per value" />
        )}
        <FormControlLabel value="Equal range bins within variable bounds" control={<Radio sx={{color: theme.palette.secondary.main, '&.Mui-checked': {color: theme.palette.secondary.main}}}/>} label="Equal range bins within variable bounds" />
        </RadioGroup>
        {binOptions === "Equal range bins within variable bounds" && (
           <>
             <Slider
              aria-label="Number of bins"
              value={equalBinsNumber}
              onChange={handleSliderChange} 
              step={1}
              marks
              min={2}
              max={max}
              valueLabelDisplay="auto"
              sx={{width: 200}}
           />
           <Typography>Enter number of bins</Typography> 
        </>
      )}
      </Box>
    )}
    {showHistogram && isEnumSelected && (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Typography variant="h5"sx={{marginBottom: 4,marginTop:4, textAlign: "center"}}>Choose option for bins</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            {(selectedGroupByVariable?.type.labels ?? []).map(label => (
                <ToggleButton
                    key={label}
                    text={label}
                    onClick={() => handleEnumOptionChange(label)}
                    selected={enumOptions.includes(label)}
                />
            ))}
        </Box>
    </Box>
    )}
    </div>
  );
};

export default QuerySelector;
