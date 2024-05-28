/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import axios, { AxiosStatic } from 'axios';
import AttributeSelector from '../components/DCupload1';


test('Test if the name field provides the correct name', async () => {

const updateDataSetName = jest.fn()
    
const {getByTestId} = render(
    <AttributeSelector dataSetName='default' updateDataSetName={updateDataSetName}></AttributeSelector>
)

const inputField = getByTestId('datasetname') as HTMLInputElement

fireEvent.change(inputField, {target: {value: 'salaries.csv'}})

fireEvent.blur(inputField)

await waitFor(() => {
    expect(updateDataSetName).toHaveBeenCalledWith('salaries.csv')
})

})