/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useTheme } from "@mui/material/styles";
import { Stack } from "@mui/material";
import { Header } from "./Header";
import { useEffect, useState } from 'react';
import { Stepper, Step, StepLabel, Button, CircularProgress} from '@mui/material';
import '../styling/MultiStepFormDC.css';
import DCupload1 from './DCupload1';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from "./UserContext";
import { editDataset } from '../api/request';
import { Budget, DatasetInfo } from '../types/interfaces';
import EditDataset2 from "./EditDataset2";

/**
 * Props interface for EditDataset component.
 */
interface Props {
  updateDatasetInfo: (updatedDataset: DatasetInfo) => void;
}

/**
 * EditDataset Component: Allows users to edit dataset information.
 * Utilizes Material-UI components for styling.
 */
const EditDataset = ({ }: Props) => {
    //States handling the steps in the multistepform
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['name of dataset', 'privacy notion and budget'];

    // Using MUI theme for consistent styling across the app
    const theme = useTheme();

    //States handling the changes of the name, notion and the budget
    const [dataSetName, setDataSetName] = useState("");
    const [privacyNotion, setPrivacyNotion] = useState("PureDP");
    const [totalBudget, setTotalBudget] = useState<Budget>({ delta: 0, epsilon: 0 });
    const [datasetInfo, setDatasetInfo] = useState<any>(null);

    //States handling the information from the previous location
    const [datasetNameFromLocation, setDatasetNameFromLocation] = useState("");
    const location = useLocation();
    const [datasetID, setDataSetID] = useState<number>(0);

    //Navigation hook to navigate between routes
    const navigate = useNavigate();

    //Access the current user's context to personalize content.
    const { user } = useUser();

    //Loading while the information is sent to the server and waiting for an accepted response
    const [isLoading, setIsLoading] = useState<boolean>(false);

    //Effect hook for setting the settings from the DCScreenOne page
    useEffect(() => {
      if (location.state) {
        const dataset = location.state.dataset;
        setDataSetName(dataset.name);
        setPrivacyNotion(dataset.privacy_notion);
        setDataSetID(dataset.id);
        setDatasetNameFromLocation(dataset.name)
      }
    }, [location.state]);

    //Effect hook for handling new values inserted in the input fields
    useEffect(() => {
      setDatasetInfo({
        id: datasetID, 
        name: dataSetName,
        privacy_notion: privacyNotion,
        budget: totalBudget
      });
    }, [datasetID, dataSetName, privacyNotion, totalBudget]);

    /**
     * Handles editing the dataset.
     */
    const handleEditDataset = async () => {

      if (!user || !datasetInfo || datasetID===null) return;
      try {
        await editDataset(datasetInfo); 
        console.log('Dataset edited successfully!');
        navigate('/data-curator', { state: { name: dataSetName } });
      } catch (error) {
        console.error('Failed to edit dataset:', error);
      }
    };

    /**
     * Validates the budget input.
     * @returns Whether the budget is valid.
     */
    const validateBudget = (): boolean => {
      if (privacyNotion === "PureDP") {
        return isNaN(totalBudget.epsilon) || totalBudget.epsilon === 0;
      } else if (privacyNotion === "ApproxDP") {
        return (
          isNaN(totalBudget.epsilon) || totalBudget.epsilon === 0 ||
          totalBudget.delta === undefined ||
          isNaN(totalBudget.delta) || totalBudget.delta === 0
        );
      }
      return false;
    };

    /**
     * Validates the progress of the stepper.
     * @param currentstep The current step of the stepper.
     * @returns Whether the progress is valid.
     */
    const validateProgress = (currentstep: number): boolean => {
      if (currentstep === 0 && dataSetName === "") {
        alert("Please give the dataset a name before proceeding");
        return false;
      } else if (currentstep === 1 && validateBudget()) {
        alert("Please fill in the inputfields with nonzero values");
        return false;
      } else {
        return true;
      }
    };

    /**
     * Handles clicking on a step.
     * @param stepIndex The index of the step clicked.
     */
    const handleStep = (stepIndex: number) => {
      const isValid = validateProgress(stepIndex - 1);
      if (!isValid) return;
      setActiveStep(stepIndex);
    };

    /**
     * Handles moving to the next step.
     */
    const handleNext = async () => {
      const isValid = validateProgress(activeStep);
      if (!isValid) return;

      if (activeStep === steps.length - 1 && user) {
        await handleEditDataset();
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    };

    /**
     * Handles moving to the previous step.
     */
    const handleBack = () => {
      if (activeStep === 0) {
        navigate('/data-curator');
      }
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    /**
     * Updates the privacy notion.
     * @param chosen The chosen privacy notion.
     */
    const updatePrivacyNotion = (chosen: string) => {
      setPrivacyNotion(chosen);
    };

    /**
     * Updates the dataset name.
     * @param name The new dataset name.
     */
    const updateDataSetName = (name: string) => {
      setDataSetName(name);
    };

    /**
     * Updates the total budget.
     * @param budget The new total budget.
     */
    const updateTotalBudget = (budget: Budget) => {
      setTotalBudget(budget);
    };

    /**
     * Gets the content of a step.
     * @param stepIndex The index of the step.
     * @returns The content of the step.
     */
    const getStepContent = (stepIndex: number) => {
      switch (stepIndex) {
        case 0:
          return <DCupload1 dataSetName={datasetNameFromLocation} updateDataSetName={updateDataSetName} />;
        case 1:
          return <EditDataset2 privacyNotion={privacyNotion} totalBudget={totalBudget} updateTotalBudget={updateTotalBudget} />;
        default:
          return 'unavailable step';
      }
    };

    return (
      <Stack sx={{background: theme.palette.primary.main, minHeight: '100vh'}}>
        <Header />
        <div className="content-container">
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} onClick={() => handleStep(index)}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div>
            {getStepContent(activeStep)}
            <div className="button-container">
              <Button
                variant="contained"
                onClick={handleBack}
                className="navigation-button"
              >
                Back
              </Button>
              {isLoading ? (
                <CircularProgress color="secondary"/>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  className="navigation-button"
                >
                  {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Stack>
    );
};

export default EditDataset;
