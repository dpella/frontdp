/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { DatasetSchema } from '../types/interfaces';
import { AdditionalVariableSelector, VariableRow } from '../components/DCupload2';

interface IVariableRow {
    name: string;
    index: number;
    isChecked: boolean[];
    schemas: DatasetSchema[];
    variables: string[];
    selectedType : string[];
    setSelectedType : (types : (string[])) => void;
    setIsChecked: (list: boolean[]) => void;
    updateSchemas: (schemas: DatasetSchema[]) => void;
}

interface IAdditionalVariableSelector {
    type : string;
    name : string;
    index : number;
    isChecked : boolean[];
    schemas : DatasetSchema[];
    variables : string[];
    updateSchemas : (schemas : DatasetSchema[]) => void; 
}

const mockPropsVR: IVariableRow = {
    name: 'Test Name',
    index: 1,
    isChecked: [false, false, false, false],
    schemas: [], 
    variables: ['name', 'age', 'job', 'salary'],
    selectedType: ['Int', 'Int', 'Int', 'Int'],
    setSelectedType: jest.fn(),
    setIsChecked: jest.fn(),
    updateSchemas: jest.fn()
};

const mockPropsADS: IAdditionalVariableSelector = {
    type: 'Int',
    name: 'Test Name',
    index: 1,
    isChecked: [false, false, false, false],
    schemas: [], 
    variables: ['name', 'age', 'job', 'salary'],
    updateSchemas: jest.fn()
};



test('test to see if the checkbox checks correct variable', () => {
    const { getByTestId } = render(
        <VariableRow {...mockPropsVR}/>
    )

    const checkBox = getByTestId(`checkBox-${mockPropsVR.index}`)

    fireEvent.click(checkBox)

    expect(mockPropsVR.setIsChecked).toBeCalledWith([false, true, false, false])
    
});

test('test to see if the type-select is set correctly', () => {
    const { getByTestId } = render(
        <VariableRow {...mockPropsVR}/>
    )

    const typeSelect = getByTestId(`typeSelect-${mockPropsVR.index}`) as HTMLSelectElement

    fireEvent.change(typeSelect, { target: { value: 'Enum' } });

    expect(typeSelect.value).toBe('Enum')
})

test('test to see if the input fields are set correctly', () => {

    const { getByTestId } = render(
        <AdditionalVariableSelector {...mockPropsADS}/>
    )

    const intMinInputField = getByTestId(`intMinInputField-${mockPropsADS.index}`) as HTMLInputElement
    const intMaxInputField = getByTestId(`intMaxInputField-${mockPropsADS.index}`) as HTMLInputElement

    fireEvent.change(intMinInputField, { target: { value: '0' } })
    fireEvent.change(intMaxInputField, { target: { value: '100' } })

    expect(intMinInputField.value).toBe('0')
    expect(intMaxInputField.value).toBe('100')
})


//Not correctly implemented yet
/*test('test to see if the schemas are updated correctly', async () => {
    
    const { getByTestId } = render(
        <><AdditionalVariableSelector {...mockPropsADS} /><VariableRow {...mockPropsVR} /></>
    )

    const checkBox = getByTestId(`checkBox-${mockPropsVR.index}`) as HTMLInputElement
    const intMinInputField = getByTestId(`intMinInputField-${mockPropsADS.index}`) as HTMLInputElement
    const intMaxInputField = getByTestId(`intMaxInputField-${mockPropsADS.index}`) as HTMLInputElement

    fireEvent.click(checkBox)
    //fireEvent.change(typeSelect, { target: { value: 'Int' } });
    fireEvent.change(intMinInputField, { target: { value: '0' } })
    fireEvent.change(intMaxInputField, { target: { value: '1' } })

    console.log('Min Input:', intMinInputField.value); 
    console.log('Max Input:', intMaxInputField.value); 

    expect(mockPropsADS.updateSchemas).toHaveBeenCalledTimes(4);

    const schema : DatasetSchema = {name: mockPropsADS.variables[1], type: {high: 1, low: 0, name: 'Int'}}


    await waitFor(() => {
        expect(mockPropsADS.updateSchemas).toHaveBeenNthCalledWith(4, [schema])
    })
    
})*/
