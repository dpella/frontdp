/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { useState, ChangeEvent} from 'react';
import { InputBase, Paper, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SearchBarProps } from '../types/interfaces';

/**
 * A component that renders a search bar, allowing users to input search terms.
 * The component consists of a text input and a submit button inside a MUI Paper component.
 * 
 * @param {SearchBarProps} props - The properties passed to the SearchBar component.
 * @param {(searchTerm: string) => void} props.onSearch - Callback function to execute when the search is submitted. It takes a single string argument which is the current search term.
 */
const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  // State to hold the current value of the search input
  const [searchTerm, setSearchTerm] = useState<string>('');

   /**
   * Handles the form submission event. Prevents the default form submit behavior and
   * calls the onSearch function with the current search term.
   * 
   * @param {React.FormEvent<HTMLDivElement>} event - The event object associated with form submission.
   */
  const handleSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault(); 
    onSearch(searchTerm);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center' }}>
      <Paper
        sx={{
          p: '2px 4px', 
          display: 'flex',
          alignItems: 'center',
          width: 250, 
          height: '35px', 
        }}
      >
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            fontSize: '0.875rem', 
          }}
          placeholder="Search..."
          inputProps={{ 'aria-label': 'search' }}
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default SearchBar;
