/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useState} from 'react';
import Query1 from './Query1';
import Query2 from './Query2';
import Query3 from './Query3';
import { Stepper, Step, StepLabel, Button, Box, Container, Typography, Stack, CircularProgress } from '@mui/material';
import  Header from "./Header";
import '../styling/MultiStepForm.css';
import {useTheme} from '@mui/material/styles';
import { evaluateQuery } from '../api/request';
import { useLocation, useNavigate } from 'react-router-dom';
import { Variable, QueryData, Budget, Confidence, LabelEdit} from '../types/interfaces'

/**
 * A multi-step form component for creating statistical queries based on selected variables and budget constraints.
 */
const MultiStepForm = () => {
  // State to track the current active step in the stepper component
  const [activeStep, setActiveStep] = useState(0);

  // Labels for the steps in the stepper
  const steps = ['confirm variables', 'statistics measure', 'set budget'];

  // Using MUI theme for consistent styling across the app
  const theme = useTheme();

  // Accessing router location state, expected to contain dataset information
  const location = useLocation();
  const { dataset } = location.state || {};

  // State to manage the selection of variables for the query
  const [selectedVariables, setSelectedVariables] = useState<Variable[]>([]);

  // State to manage the budget for the query
  const [selectedBudget, setSelectedBudget] = useState<Budget>({ epsilon: 0, delta: dataset.budget.allocated.delta > 0 ? 0: undefined,});

  const [selectedConfidence, setSelectedConfidence] = useState<Confidence>({ confidence: 0});

  // Navigation hook to navigate between routes
  const navigate = useNavigate();

  // State to indicate loading process during query evaluation
  const [isLoading, setIsLoading] = useState(false);

  // State to manage label edits for variable names
  const [labelEdits, setLabelEdits] = useState<LabelEdit>({});

  // State to manage configuration of the query
  const [queryData, setQueryData] = useState<QueryData>({
    statistics: '',
    variable: '',
  });

  /**
   * Validates the form's progress before moving to the next step.
   * Alerts the user with specific messages if validation fails.
   * 
   * @param {number} currentStep - The index of the current step to validate.
   * @returns {boolean} True if the current step is valid, otherwise false.
   */
  const validateProgress = (currentStep: number): boolean => {
    if (currentStep === 0 && selectedVariables.length === 0) {
      alert("Please select at least one variable to proceed.");
      return false;
    } 
    else if (currentStep === 1 && (queryData.statistics === '' || queryData.variable === '')) {
      alert("Please fill in the statistics and variable to proceed.");
      return false;
    } 
    else if (currentStep === 1 && queryData.showHistogram && queryData.statistics!=="count") {
      if (!queryData.groupBy) {
        alert("Please select a 'Group By' variable");
        return false;
      }
      else if ((queryData.groupBy?.type.name === 'Int' || queryData.groupBy?.type.name === 'Double') && !queryData.binOptions) {
        alert("Please specify bin options for the numeric 'Group By' variable.");
        return false;
      } 
      else if (queryData.groupBy?.type.name === 'Enum' && (!queryData.enumOptions || queryData.enumOptions.length === 0)) {
        alert("Please select at least one label for the 'Group By' variable.");
        return false;
      }
    } 
    else if (currentStep === 2) {
      if (selectedBudget.epsilon <= 0) {
        alert("Epsilon must be greater than 0.");
        return false;
      }
      if (selectedBudget.delta !== undefined && selectedBudget.delta <= 0) {
        alert("Delta must be greater than 0 when included in the budget.");
        return false;
      }
    }
    return true;
  };
  
  /**
   * Directly navigates to a selected step in the form.
   * Validates the progress of the current step before allowing the navigation to proceed.
   * 
   * @param {number} stepIndex - The index of the step to navigate to.
   */
  const handleStep = (stepIndex: number) => {
    const isValid = validateProgress(stepIndex - 1);
    if (!isValid) return;
    setActiveStep(stepIndex);
  };

   /**
   * Handles navigation to the next step in the form.
   * Validates the current step before proceeding and executes the query if on the final step.
   */
  const handleNext = async () => {
    const isValid = validateProgress(activeStep);
    if (!isValid) return;
  
    if (activeStep === steps.length - 1 && queryData) {
      setIsLoading(true);
      try {
        const result = await evaluateQuery(dataset.id, queryData.statistics, queryData.variable, selectedBudget, queryData.groupBy, queryData.enumOptions, queryData.binOptions, queryData.equalBinsNumber, labelEdits);
  
        const updatedVariableName = labelEdits[queryData.variable] || queryData.variable;
  
        navigate('/queryResult', { 
          state: { 
            queryResult: result, 
            method: queryData.statistics, 
            variable: updatedVariableName, 
            histogram: queryData.showHistogram,
            labelEdits: labelEdits,
            dataset:dataset
          } 
        });
      } catch (error) {
        console.error('Failed to create statistics:', error);
        alert(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
   /**
   * Handles navigation to the previous step or exits to the available datasets if on the first step.
   */
  const handleBack = () => {
    if (activeStep === 0) {
      navigate('/DAFS');
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

   /**
   * Updates the state to reflect the selection of variables made in the Query1 component.
   * 
   * @param {Variable[]} variables - The variables selected in the current step.
   */
  const handleVariableSelection = (variables: Variable[]) => {
    setSelectedVariables(variables);
  };
  
   /**
   * Updates the state to reflect changes to the labels of variables made in the Query1 component.
   * 
   * @param {LabelEdit} edits - The current edits to the variable labels.
   */
  const handleLabelEdit = (edits: LabelEdit) => {
    setLabelEdits(edits);
  };

  /**
   * Determines and returns the content to display based on the current step.
   * 
   * @param {number} stepIndex - The index of the current step.
   * @returns {JSX.Element} The content for the current step.
   */
  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <Query1 datasetID = {dataset? dataset.id: undefined} onVariablesSelected={handleVariableSelection} selectedVariables={selectedVariables} labelEdits={labelEdits} onLabelEdit={handleLabelEdit}/>;
      case 1:
        return <Query2 variables={selectedVariables}  onDataSelected={setQueryData} selectedData={queryData} />;
      case 2:
        return <Query3 budget={dataset ? dataset.budget : undefined} selectedBudget={selectedBudget} onBudgetChange={setSelectedBudget} />;
      default:
        return 'unavailable step';
    }
  };

  return (
    <Stack sx={{background: theme.palette.primary.main, minHeight: '100vh'}}> 
    <>
    <Header />
    <Container style={{ position: 'relative', top: '50px', width: '100%'}}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '20%' }}>
          <Typography variant="subtitle1">Dataset name:</Typography>
          <Box sx={{ p: 1, bgcolor: 'primary.main', border: 1, borderColor: 'white' }}>
            <Typography textAlign="center">{dataset ? dataset.name : 'No dataset chosen'}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '20%' }}>
          <Typography variant="subtitle1">Remaining Epsilon:</Typography>
          <Box sx={{ p: 1, bgcolor: 'primary.main', border: 1, borderColor: 'white' }}>
            <Typography textAlign="center">{dataset ? `${dataset.budget.allocated.epsilon - dataset.budget.consumed.epsilon} ε` : 'No dataset chosen'}</Typography>
          </Box>
        </Box>
        {dataset && dataset.budget.allocated.delta > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '20%' }}>
            <Typography variant="subtitle1">Remaining Delta:</Typography>
            <Box sx={{ p: 1, bgcolor: 'primary.main', border: 1, borderColor: 'white' }}>
              <Typography textAlign="center">{`${dataset.budget.allocated.delta - dataset.budget.consumed.delta} δ`}</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
    <div className="content-container">
    <Stepper className='MuiStepIcon' activeStep={activeStep} alternativeLabel>
      {steps.map((label, index) => (
        <Step key={label} onClick={() => handleStep(index)}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
      <div>
        {getStepContent(activeStep)}
        <div className="buttonContainer">
            <Button
              variant="contained"
              onClick={handleBack}
              className="navigationButton"
            >
              Back
            </Button>
            {isLoading ? (
            <CircularProgress color="secondary" />
            ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              className="navigationButton"
            >
              {activeStep === steps.length - 1 ? 'Create Statistics' : 'Next'}
            </Button>
            )}
          </div>
        </div>
      </div>
    </>
    </Stack>

  );
};

export default MultiStepForm;
