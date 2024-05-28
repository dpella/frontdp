/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { Stepper, Step, StepLabel, Button, CircularProgress} from '@mui/material';
import  Header from "../components/Header";
import '../styling/MultiStepFormDC.css';
import {useTheme} from '@mui/material/styles';
import { Stack } from '@mui/material';
import DCupload1 from './DCupload1';
import DCupload2 from '../components/DCupload2';
import DCupload3 from "../components/DCupload3";
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from "./UserContext";
import { uploadDataSchema, uploadDatasetData} from '../api/request';
import { Budget, DatasetSchema } from '../types/interfaces';

/**
 * A constant which is used to set up the multistep form for the uploading process of a dataset for a data curator.
 */
const MultiStepFormDC = () => {
    //States for handling the progress of the multistep form
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['name of dataset', 'confirm variables', 'privacy notion and budget'];

    //Using MUI theme for consistent styling across the app
    const theme = useTheme() 

    //States for handling the changes of the data connected to the dataset
    const [dataSetName, setDataSetName] = useState<string>("")
    const [privacyNotion, setPrivacyNotion] = useState<string>("PureDP");
    const [schemas, setSchema] = useState<(DatasetSchema[])>([])
    const [totalBudget, setTotalBudget] = useState<Budget>({delta: 0, epsilon: 0})
    const [variables, setVariables] = useState<string[]>([]) 
    const [selectedType, setSelectedType] = useState<string[]>([])
    const [isChecked, setIsChecked] = useState<boolean[]>([])

    //States for handling the information from the previous location
    const [file, setFile] = useState<File | null>(null)
    const [datasetNameFromLocation, setDatasetNameFromLocation] = useState<string>("")

    //Loading while the information is sent to the server and waiting for an accepted response
    const [isLoading, setIsLoading] = useState<boolean>(false)

    //Navigation hook to navigate between routes
    const navigate = useNavigate();

    //Access the current user's context to personalize content.
    const { user } = useUser();

    /**
    * Constant for testing and validating the structure of the schemas
    */
    const validateSchemas = () : boolean => {
      for (const schema of schemas) {
        if (schema.type.name === "Int" || schema.type.name === "Double") {
          return (schema.type.high === undefined || isNaN(schema.type.high) || schema.type.low === undefined || isNaN(schema.type.low))
        }
        else if (schema.type.name === "Enum") {
          if (schema.type.labels === undefined || schema.type.labels.length === 0) return true
          for (const label of schema.type.labels) {
            if (label === '') return true
          }
      }
        
      }
      return false;
    }

    /**
    * Constant for testing and validating the inserted budget
    */
    const validateBudget = () : boolean => {
      if (privacyNotion === "PureDP") {
        return(isNaN(totalBudget.epsilon) || totalBudget.epsilon === 0)
      }
      else if (privacyNotion === "ApproxDP") {
        return(isNaN(totalBudget.epsilon) || totalBudget.epsilon === 0 || totalBudget.delta === undefined ||
              isNaN(totalBudget.delta) || totalBudget.delta === 0)
      }
      return false;
    } 

    /**
    * Constant for validating the progress of the multistep form
    */
    const validateProgress = (currentstep : number) : boolean => {
      if (currentstep === 0 && dataSetName === "") {
        alert("Please give the dataset a name before proceeding")
        return false
      }
      else if (currentstep === 1 && validateSchemas()){
        alert("Please fill in all fields of the marked variables")
        return false
      }
      else if (currentstep === 2 && validateBudget()) {
        alert("Please fill in the inputfields with nonzero values")
        return false
      }
      else {
        return true
      }
    }

    /**
    * Constant for handling the stepping within the multistep form
    */
    const handleStep = (stepIndex : number) => {
      const isValid = validateProgress(stepIndex - 1);
      if (!isValid) return;
      setActiveStep(stepIndex);
    }

    /**
    * Constant for handling the action of proceeding in the mutlistep form
    */
    const handleNext = async () => {
      const isValid = validateProgress(activeStep);
      if (!isValid) return;

      if (activeStep === steps.length - 1 && user) {
        setIsLoading(true)
        try {
          await uploadDataset();
          navigate('/data-curator')
        } catch (error) {
          console.error('Failed to create statistics:', error);
        }
        finally {
          setIsLoading(false)
        }
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    };

    /**
     * Constant for handling the action of going backwards in the multistep form
     */
    const handleBack = () => {
      if (activeStep === 0) {
        navigate('/data-curator');
      }
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    /**
     *  Constants for updating the states after the callback function is invoked
     */
    const updatePrivacyNotion = (chosen : string) => {
      setPrivacyNotion(chosen);
    }
    const updateDataSetName = (name : string) => {
      setDataSetName(name);
    }
    const updateTotalBudget = (budget : Budget) => {
      setTotalBudget(budget)
    }
    const updateSchemas = (schemas : DatasetSchema[]) => {
      setSchema(schemas)
    }

    /**
    * Location and effect hooks for handling the informations sent from the previous location
    */
    const location = useLocation();
    useEffect(() => {
      if (location.state) {
        setDatasetNameFromLocation(location.state.name);
        setDataSetName(location.state.name)
        setFile(location.state.file);
      }
    }, [location.state]);

    useEffect(() => {
      if (datasetNameFromLocation && file) {
        findVariables();
      }
    }, [datasetNameFromLocation, file]);  

    /**
     * Constant for finding the variables in the incoming file
    */
    const findVariables = () => {
      if (!file) return;
      const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target) {
            const contents = event.target.result as string;
            const extension = file.name.split('.').pop();
            var lines : string[] = [];
            var vars : string[] = [];
            if (extension === "csv") {
              lines = contents.split('\n');
              if (lines.length > 0) {
                vars = lines[0].split(',');
                let lastVariable : string = vars[vars.length-1];
                vars[vars.length-1] = lastVariable.slice(0, (lastVariable.length)-1) //Needed this line too get rid of suffix '\r' from the last variable in csv files
              }
            }
            else if (extension === "tsv" || extension === "tab") {
              lines = contents.split('\t');
              for (let i = 0; i < lines.length; i++) {
                if (!lines[i].includes("\n")) {
                  vars.push(lines[i]);
                }
                else {
                  vars.push(lines[i].split('\n')[0])
                  i = lines.length;
                }
              }
            }
            setVariables(vars);
            let listbool : boolean[] = [];
            let listempty : string[] = [];
            vars.forEach(() => {
              listbool.push(false)
              listempty.push('Int')}
              )
            setIsChecked(listbool) //Build the default list of isChecked depending on the no. variables, fill ischecked with the same amount of falses
            setSelectedType(listempty) //Build the default list of selectedTypes which is the global variable of which types that are selected
          }
        };
        reader.readAsText(file);
      }
      
      /**
      * Constant for finding the variables in the incoming file
      */
      const uploadDataset = async () => {
        if (!file || !user) return;
        const id = await uploadDataSchema(dataSetName, user.handle, privacyNotion, schemas, totalBudget);

        const reader = new FileReader();
          reader.onload = async (event) => {
            if (event.target) {
              const contents = event.target.result as string;
              const dataSeperated : string[] = contents.split(/,|\n(?=\S)/) //Sepereated the datafromcontent in to an array with every datapoint as an string-element

              let falseIndices : number[] = [];
              let trueIndices : number[] = []
              for (let i = 0; i < isChecked.length; i++) { //Retrieve the index of the variables which are false. 
                if (isChecked[i] === false) {
                  falseIndices.push(i+1); //One-based indices, easier to do maths in upcoming for-loop.
                }
                else {
                  trueIndices.push(i+1)
                }
              }
            
              if (falseIndices.includes(variables.length)) { //If the last variable is not checked, we need to add 0 as a base case, otherwise the computation below wont work because the last variable would always be included
                falseIndices.push(0);
              } 

              let formattedFilteredData : string = "";
              //Filter the dataset so only the columns that corresponds to the variables that are marked as checked is uploaded to the server.
              const filteredData = dataSeperated.filter((_, index) => !falseIndices.includes((index+1) % variables.length))
              filteredData.forEach((datapoint, index) => {  
                if(((index+1) % trueIndices.length) === 0) {
                  formattedFilteredData += datapoint.trim() + '\n';
                }
                else {
                  formattedFilteredData += datapoint.trim() + ',';
                }
              })     
              await uploadDatasetData(id, formattedFilteredData);
            } 
          }
          reader.readAsText(file);
        }  

  //For testing purposes only. Used to see the updated wished variable while the user enters information
  /*  useEffect(() =>  { 
      console.log("schemas is:", (JSON.stringify(schemas)))
    }, [schemas])*/

    /**
    * Constant for give every stepIndex a JSX component that should be returned for the user in the multistep form.
    */
    const getStepContent = (stepIndex: number) => {
      switch (stepIndex) {
        case 0:
          return <DCupload1 dataSetName={datasetNameFromLocation} updateDataSetName={updateDataSetName}/>;
        case 1:
          return <DCupload2 variables={variables} isChecked={isChecked} schemas={schemas} selectedType={selectedType} setSelectedType={setSelectedType} setIsChecked={setIsChecked} updateSchemas={updateSchemas}/>;
        case 2:
          return <DCupload3 privacyNotion={privacyNotion} totalBudget={totalBudget} updatePrivacyNotion={updatePrivacyNotion} updateTotalBudget={updateTotalBudget}/>;
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

export default MultiStepFormDC;
