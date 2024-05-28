/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Stack, Container, Typography, Paper, TableHead, Table, TableCell, TableRow, TableBody, Tooltip, Checkbox} from '@mui/material';
import '../styling/Query1.css';
import React, { useCallback, useEffect, useState} from 'react';
import {useTheme} from '@mui/material/styles';
import { getDatasetSchema} from '../api/request';
import { LabelEdit, Variable, DatasetSchema, VariableSelectorProps } from '../types/interfaces';
import EditIcon from '@mui/icons-material/Edit';

/**
 * A component that allows users to select variables from a dataset schema for further query configuration.
 * It supports selecting individual variables, editing their labels, and applying selections to the whole set.
 * @param {VariableSelectorProps} props - Props for `VariableSelector` component.
 * @param {number} [props.datasetID] - The optional ID of the dataset to fetch the schema from.
 * @param {(selectedVariables: Variable[]) => void} props.onVariablesSelected - Callback to invoke when the selected variables change.
 * @param {Variable[]} props.selectedVariables - The currently selected variables.
 * @param {LabelEdit} props.labelEdits - An object mapping variable names to their edited labels.
 * @param {(edits: LabelEdit) => void} props.onLabelEdit - Callback to invoke when label edits are made.
 */
const VariableSelector: React.FC<VariableSelectorProps> = ({ datasetID, onVariablesSelected,selectedVariables, labelEdits: parentLabelEdits, onLabelEdit }) => {
  // Using MUI theme for consistent styling across the app
  const theme = useTheme() 

  // State to hold the dataset schema.
  const [schema, setSchema] = useState<DatasetSchema[]>([]);

  // State to track selected variables.
  const [selected, setSelected] = useState<Variable[]>(selectedVariables);

  // Helper function to check if a variable is selected.
  const isItemSelected = (name: string) => selected.some(item => item.name === name);

  // State to manage which variable's label is being edited.
  const [editingLabelOfVariable, setEditingLabelOfVariable] = useState<string | null>(null);

  // State to store the current value being typed into the label edit field.
  const [editValue, setEditValue] = useState<string>("");

  // State to store any changes to variable labels.
  const [labelEdits, setLabelEdits] = useState<LabelEdit>(parentLabelEdits);

  // Function using useCallback to determine if all variables in the schema are selected.
  const areAllSelected = useCallback(() => {
    return schema.length === selected.length;
  }, [schema, selected]);

  // Function to determine if all variables are selected.
  const [selectAllChecked, setSelectAllChecked] = useState(areAllSelected());


  /**
   * Effect hook to update the 'selectAll' state.
   * It only runs when the selected variables or the schema changes.
   */
  useEffect(() => {
    setSelectAllChecked(areAllSelected());
  }, [selected, schema, areAllSelected]);

  /**
   * Effect hook to fetch the dataset schema.
   * It only runs when the datasetID changes.
   */
  useEffect(() => {
    const fetchSchema = async () => {
      if (datasetID !== undefined) {
        try {
          const fetchedSchema = await getDatasetSchema(datasetID);
          setSchema(fetchedSchema);
        } catch (error) {
          console.error('Failed to fetch dataset schema:', error);
        }
     }
    };
    fetchSchema();
  }, [datasetID]);

  /**
   * Handles selecting or deselecting a variable from the list.
   * @param {string} itemName - Name of the variable to toggle selection.
   */
  const handleSelect = (itemName: string) => {
    const selectedIndex = selected.findIndex(variable => variable.name === itemName);
    let newSelected: Variable[] = [...selected];
  
    if (selectedIndex === -1) {
      const schemaItem = schema.find(item => item.name === itemName);
      if (!schemaItem) {
        console.error("Schema item not found for name:", itemName);
        return;
      }
      const newVariable: Variable = {
        name: itemName,
        type: schemaItem.type
      };
      newSelected.push(newVariable);
    } else {
      newSelected.splice(selectedIndex, 1);
    }
  
    setSelected(newSelected);
    onVariablesSelected(newSelected);
  };
  
  /**
   * Handles the 'Select All' checkbox action.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event triggered by changing the checkbox.
   */
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
        const newSelecteds = schema.map((item) => ({
            name: item.name,
            type: item.type,
        }));
        setSelected(newSelecteds);
        onVariablesSelected(newSelecteds);
    } else {
        setSelected([]);
        onVariablesSelected([]);
    }
    setSelectAllChecked(event.target.checked);
  };

  /**
   * Initiates editing of a variable's label.
   * @param {string} variableName - Name of the variable whose label is to be edited.
   */
  const handleEditClick = (variableName: string) => {
    setEditingLabelOfVariable(variableName);
    const currentLabel = labelEdits[variableName] || variableName;
    setEditValue(currentLabel);
  };

   /**
   * Saves the edited label and exits the edit mode.
   * @param {string} originalName - The original name of the variable whose label was edited.
   */
  const saveLabelEdit = (originalName: string) => {
    const newLabelEdits = { ...labelEdits, [originalName]: editValue };
    setLabelEdits(newLabelEdits);
    onLabelEdit(newLabelEdits);
    setEditingLabelOfVariable(null);
    setEditValue("");
  };

  return (
    <Stack sx={{ background: theme.palette.primary.main, minHeight: '200px', position: 'relative', alignItems: 'center', spacing: 2 }}>
      <Container maxWidth="xl" sx={{ textAlign: 'center' }}>
        <Typography variant="h5" color="white" sx={{ mb: 2 }} className="variableSelectorHeader">Confirm variables</Typography>
        <Paper sx={{ width: '100%', overflow: 'hidden', background: 'transparent', boxShadow: 'none' }}>
          <Table sx={{ '.MuiTableCell-root': { color: 'white' } }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" width="5%">
                  <Tooltip title="Mark all" >
                  <Checkbox
                    color="primary"
                    onChange={handleSelectAllClick}
                    checked={selectAllChecked}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': {
                        color: 'white',
                      },
                    }}
                  />
                  </Tooltip>
                </TableCell>
                <TableCell width="23.75%"sx={{ fontSize: '1rem' }}>Variable name</TableCell>
                <TableCell width="23.75%"sx={{ fontSize: '1rem' }}>Variable label</TableCell>
                <TableCell width="23.75%"sx={{ fontSize: '1rem' }}>Type</TableCell>
                <TableCell width="23.75%"sx={{ fontSize: '1rem' }}>Additional variable information</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schema.map((item, index) => {
                const displayLabel = labelEdits[item.name] ?? item.name;
                return (
                  <TableRow key={index} role="checkbox" aria-checked={isItemSelected(item.name)} selected={isItemSelected(item.name)}  sx={{
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)'
                    }
                    }}
                    >
                    <TableCell padding="checkbox">
                      <Checkbox
                        onClick={() => handleSelect(item.name)} 
                        color="primary"
                        checked={isItemSelected(item.name)}
                        inputProps={{ 'aria-labelledby': `checkbox-${index}` }}
                        sx={{
                          color: 'white',
                          '&.Mui-checked': {
                            color: 'white',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      {editingLabelOfVariable === item.name ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => saveLabelEdit(item.name)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveLabelEdit(item.name);
                            }
                          }}
                          autoFocus
                          style={{ color: 'black' }}
                        />
                      ) : (
                        <>
                          {displayLabel}
                          <Tooltip title="Edit" >
                          <EditIcon
                            onClick={() => handleEditClick(item.name)}
                            sx={{ ml: 1, cursor: 'pointer' }}
                          />
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                    <TableCell>{item.type.name}</TableCell>
                    <TableCell>
                      {item.type.low !== undefined && `Low: ${item.type.low} `}
                      {item.type.high !== undefined && `High: ${item.type.high} `}
                      {item.type.labels && `Labels: ${item.type.labels.join(', ')}`}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </Stack>
  );
};

export default VariableSelector;