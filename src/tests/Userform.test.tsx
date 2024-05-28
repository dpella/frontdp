/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { UserForm } from '../components/UserForm';
import { MemoryRouter } from 'react-router-dom';

test('Submitting user form with valid credentials', async () => {
    // Mock handleSubmit function
    const handleSubmit = jest.fn();
  
    // Render the user form wrapped with MemoryRouter
    const { getByLabelText, getByRole } = render(
      <MemoryRouter>
        <UserForm submitText="Submit" handleSubmit={handleSubmit} />
      </MemoryRouter>
    );
  
    // Fill in the username and password fields
    const usernameInput = getByLabelText('Username') as HTMLInputElement;
    const passwordInput = getByLabelText('Password') as HTMLInputElement;
    fireEvent.change(usernameInput, { target: { value: 'john123' } });
    fireEvent.change(passwordInput, { target: { value: 'hunter2' } });
  
    // Submit the form
    const submitButton = getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
  
    // Wait for the form submission to complete
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith('john123', 'hunter2');
    });
  });