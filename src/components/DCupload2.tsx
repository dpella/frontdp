/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Box, Fab, Stack, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import '../styling/DCupload2.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {DatasetSchema } from '../types/interfaces';

/**
 * @param {IDCupload2} props - Props for `DCUpload2` component.
 * @param {string[]} props.variables - A list of all variabels in the dataset.
 * @param {boolean[]} props.isChecked - A list with booleans stating whether the variable is checked or not, first element corresponding to first element in variables list and so forth.
 * @param {DatasetSchema[]} props.schemas - A list containing the schema for all checked variables.
 * @param {string[]} props.selectedType - A list indicating what the type the user set on the variables, first element corresponding to first element in variables list and so forth.
 * @param {(types: string[]) => void} props.setSelectedType - Callback to invoke when the type of a variable changes.
 * @param {(list: boolean[]) => void} props.setIsChecked - Callback to invoke when a variable is either checked or unchecked.
 * @param {(schemas: DatasetSchema[]) => void} props.updateSchemas - Callback to invoke when the schemas of a checked variable changes.
 */
interface IDCupload2 {
    variables : string[];
    isChecked : boolean[];
    schemas : DatasetSchema[];
    selectedType : string[];
    setSelectedType : (types : (string[])) => void;
    setIsChecked : (list : (boolean[])) => void;
    updateSchemas : (schemas : DatasetSchema[]) => void; 
}

/**
 * @param {IVariableRow} props - Props for `VariableRow` component.
 * @param {string} props.name - A string representing the name of the variable.
 * @param {number} props.index - A number representing the index of the variable.
 * @param {boolean[]} props.isChecked - A list with booleans stating whether the variable is checked or not, first element corresponding to first element in variables list and so forth.
 * @param {DatasetSchema[]} props.schemas - A list containing the schema for all checked variables.
 * @param {string[]} props.variables - A list of all variabels in the dataset.
 * @param {string[]} props.selectedType - A list indicating what the type the user set on the variables, first element corresponding to first element in variables list and so forth.
 * @param {(types: string[]) => void} props.setSelectedType - Callback to invoke when the type of a variable changes.
 * @param {(list: boolean[]) => void} props.setIsChecked - Callback to invoke when a variable is either checked or unchecked.
 * @param {(schemas: DatasetSchema[]) => void} props.updateSchemas - Callback to invoke when the schemas of a checked variable changes.
 */
interface IVariableRow {
    name : string;  
    index : number;
    isChecked : boolean[];
    schemas : DatasetSchema[];
    variables : string[];
    selectedType : string[];
    setSelectedType : (types : (string[])) => void;
    setIsChecked : (list : (boolean[])) => void;
    updateSchemas : (schemas : DatasetSchema[]) => void; 
}

/**
 * @param {IAdditionalVariableSelector} props - Props for `AdditionalVariableSelector` component.
 * @param {string} props.type - A string representing the type of the variable.
 * @param {string} props.name - A string representing the name of the variable.
 * @param {number} props.index - A number representing the index of the variable.
 * @param {boolean[]} props.isChecked - A list with booleans stating whether the variable is checked or not, first element corresponding to first element in variables list and so forth.
 * @param {DatasetSchema[]} props.schemas - A list containing the schema for all checked variables.
 * @param {string[]} props.variables - A list of all variabels in the dataset.
 * @param {(schemas: DatasetSchema[]) => void} props.updateSchemas - Callback to invoke when the schemas of a checked variable changes.
 */
interface IAdditionalVariableSelector {
    type : string;
    name : string;
    index : number;
    isChecked : boolean[];
    schemas : DatasetSchema[];
    variables : string[];
    updateSchemas : (schemas : DatasetSchema[]) => void; 
}

/**
 * A component that allows users to select which variables within the dataset that should be analyzed on and set restrictions to them.
 */
const DCUpload2 : React.FC<IDCupload2> = ({variables, isChecked, schemas, selectedType, setSelectedType, setIsChecked, updateSchemas}) => {
    // Using MUI theme for consistent styling across the app
    const theme = useTheme()

    return (
        <>
            <h1 className="variableSelectorHeader">Confirm variables</h1>
            <Stack direction="row">
                <Box className="header" borderBottom={1}>
                    <Box className="box" marginLeft={2}>
                        <p>Variable name</p>
                    </Box>
                    <Box className="box">
                        <p>Type</p>
                    </Box>
                    <Box className="box" flex={2}>
                        <p>Additional Variable Information</p>
                    </Box>
                </Box>
            </Stack>
            {variables.map((name, index) => (
                <Stack  key={index} direction="row" >
                <VariableRow name={name} index={index} isChecked={isChecked} schemas={schemas} variables={variables} selectedType={selectedType} setSelectedType={setSelectedType} setIsChecked={setIsChecked} updateSchemas={updateSchemas}></VariableRow>
                </Stack>
            ))}
        </>
    );
};


/**
 * A component that represents a row in the list of the displayed variables.
 */
export const VariableRow : React.FC<IVariableRow> = ({name, index, isChecked, schemas, variables, selectedType, setSelectedType, setIsChecked, updateSchemas}) => {

    //Handles the event where an variable is checked or unchecked
    const handleCheckboxChange = (index : number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newIsChecked = [...isChecked]
        newIsChecked[index] = event.target.checked;
        setIsChecked(newIsChecked);
    };

    //Handles the event where an variable's type is changed
    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSelectedType = [...selectedType];
        newSelectedType[index] = event.target.value;
        setSelectedType(newSelectedType);
    };

    return (
        <Box className="header" borderBottom={1}>
            <input
                type="checkbox"
                checked={isChecked[index]} // Sets the checked state of the checkbox
                onChange={(e) => handleCheckboxChange(index, e)} // Handles changes to the checkbox
                data-testid={`checkBox-${index}`}
            />
            <Box className="box">
                <p>{name}</p>
            </Box>

            <Box className="box">
                <Box borderBottom={1}>
                    <select className="myDropdown" value={selectedType[index]} onChange={handleTypeChange} data-testid={`typeSelect-${index}`}>
                        <option value="Int">Integer</option>
                        <option value="Enum">Enum</option>
                        <option value="Text">Text</option>
                        <option value="Double">Double</option>
                    </select>
                </Box>
            </Box>
            <AdditionalVariableSelector type={selectedType[index]} name={name} index={index} isChecked={isChecked} schemas={schemas} variables={variables} updateSchemas={updateSchemas}></AdditionalVariableSelector>
        </Box>
    );
}

/**
 * A component that is used to build the schemas of the variables dynamically when the user inserts their input.
 */
export const AdditionalVariableSelector : React.FC<IAdditionalVariableSelector> = ({type, name, index, isChecked, schemas, variables, updateSchemas}) => {

    // States for handling the input of the user.
    const [inputNumValues, setInputNumValues] = useState<(number | undefined)[]>([undefined, undefined]);
    const [inputStringValues, setInputStringValues] = useState<string[]>(['']);
    const [nInputFields, setnInputFields] = useState(inputStringValues.length);

    //Effect hook for resetting the input fields when the type changes
    useEffect(() => {
        if (type === 'Enum') {
            setInputStringValues(['', '', '']);
        } else if (type === 'Int' || type === 'Double') {
            setInputNumValues([undefined, undefined]);
        } else {
            setInputStringValues(['']);
        }
    }, [type]);
    
    //Effect hook for dynamically building the variables is checked or new values are inputted in the input fields.
    useEffect(() => {
        if (isChecked[index] === true) { // build dataschema! If true - add the type and inputs to the schema
            let newSchemaElement : DatasetSchema;
            if (type === "Int" || type === "Double"){ //create specific DatasetSchema depending on type and add it to the schema array
                newSchemaElement = {
                    "name": name,
                    "type": {
                        "high": inputNumValues[1],
                        "low": inputNumValues[0],                            
                        "name": type
                    } 
                }
            }
            else if (type === "Text") {
                newSchemaElement = { 
                    "name": name,
                    "type": {                         
                        "name": type
                    } 
                }
            }
            else { // Enum
                newSchemaElement = {
                    "name": name,
                    "type": {
                        "labels": (inputStringValues.filter((input) => input !== "")),
                        "name": type
                    }
                }

            }
            let newSchema = [...schemas];
            newSchema = newSchema.filter((schema) => schema.name !== name);
            newSchema.push(newSchemaElement)
            newSchema.sort((a, b) => variables.indexOf(a.name) - variables.indexOf(b.name))
            updateSchemas(newSchema);
        }
        else {
            if (isChecked[index] === false) {
                updateSchemas([...schemas].filter((schema) => schema.name !== variables[index]))
            }
        }
    }, [isChecked[index], inputNumValues, inputStringValues]);

    //Handler if the type of variable is integer or double. Seperated string and num in order to make it more intuitive
    const handleInputNumChange = (index : number) => async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newInputValues = [...inputNumValues];
        let newValue : (number | undefined);
        let inputValue = event.target.value;

        if (inputValue.includes('-')) {
            inputValue = inputValue.slice(0, inputValue.length-1)
        }
        if (type === "Double") {
            newValue = parseFloat(inputValue);
        } else {
            newValue = parseInt(inputValue, 10);
        }
        if (!isNaN(newValue)) {  // Check if the parsed value is a valid integer
            newInputValues[index] = newValue;
            setInputNumValues(newInputValues);
        }
        else { 
            newInputValues[index] = undefined;
            setInputNumValues(newInputValues);
        }
    };

    //Handler if the input is string, i.e. the type of the variable is enum. 
    const handleInputStringChange = (index : number) => async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newInputValues = [...inputStringValues]

        if (index === inputStringValues.length) { 
            newInputValues.push(event.target.value)
        }
        else {
            newInputValues[index] = event.target.value;
        }
        setInputStringValues(newInputValues);
    };

    //Handle number of input fields when the user presses on the buttons when type is Enum
    const handleNewTexfield = (addOrRemove : string, event : React.MouseEvent<HTMLButtonElement>) => {
        if (nInputFields < 3 && addOrRemove === "add") {
            setnInputFields(nInputFields + 1);
        }
        if (nInputFields > 1 && addOrRemove === "remove") {
            setnInputFields(nInputFields - 1);
        }
    }

    if (type === "Enum") {
        return (
            <Box className="box" flex={2}>
                {(nInputFields > 1) && <Fab color="error" size="small" sx={{marginRight: 2}}
                    onClick={(e) => handleNewTexfield("remove" , e)}>
                  <RemoveCircleIcon style={{fill: 'red', stroke: 'white', strokeWidth: 2 }}/>
               </Fab>}
                {[...Array(nInputFields)].map((_, index) => (
                    <input className="inputBox" key={index} width={120} style={{marginRight: index === nInputFields - 1 ? 20 : 0, marginLeft: index === 0 ? 0 : 20}}
                    type="text"
                    value={inputStringValues[index]} 
                    onChange={handleInputStringChange(index)}
                    placeholder={"Enum" + (index+1)} //placeholder text
                  />
                ))}
               {(nInputFields < 3) && <Fab color="secondary" size="small" sx={{color: '#FFFFFF'}}
                    onClick={(e) => handleNewTexfield("add", e)}>
                  <AddIcon/>
               </Fab>}
            </Box>
        )
    }

    else if (type === "Int") {
        return (
            <Box className="box" flex={2}>
            <input className="inputBox" width={120}
              type="number"
              value={inputNumValues[0] === undefined ? '' : inputNumValues[0]}
              onChange={handleInputNumChange(0)}
              placeholder={inputNumValues[0] === undefined ? 'Min' : ''}
              data-testid={`intMinInputField-${index}`}
            />
            <input className="inputBox" width={120} style={{marginRight: 10, marginLeft: 20}}
              type="number"
              value={inputNumValues[1] === undefined ? '' : inputNumValues[1]}
              onChange={handleInputNumChange(1)} // Handle changes to the input value
              placeholder={inputNumValues[1] === undefined ? 'Max' : ''}
              data-testid={`intMaxInputField-${index}`}
            />
        </Box>
        )
    }

    else if (type === "Double") {
        return (
            <Box className="box" flex={2}>
            <input className="inputBox" width={120}
              type="number"
              step="0.001"
              value={inputNumValues[0] === undefined ? '' : inputNumValues[0]}
              onChange={handleInputNumChange(0)}
              placeholder={inputNumValues[0] === undefined ? 'Min' : ''}
            />
            <input className="inputBox" width={120} style={{marginRight: 10, marginLeft: 20}}
              type="number"
              step="0.001"
              value={inputNumValues[1] === undefined ? '' : inputNumValues[1]}
              onChange={handleInputNumChange(1)} // Handle changes to the input value
              placeholder={inputNumValues[1] === undefined ? 'Max' : ''}
            />
        </Box>
        )
    }
    else { //Text
        return(
            <Box className="box" flex={2} alignItems="center" height={50}> No input needed
            </Box>
        )
    }
}
export default DCUpload2;