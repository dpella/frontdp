/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Stack, Typography, Container, Paper, Table, TableHead, TableRow, TableBody, TableCell, Box, Tooltip} from "@mui/material";
import { Header } from "./Header";
import '../styling/DAFS.css';
import {useState, useEffect} from "react";
import { useTheme } from "@mui/material/styles";
import { useUser } from "./UserContext";
import { getAvailableDatasets, getBudgets } from "../api/request";
import IconButton from '@mui/material/IconButton';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { DatasetInfo } from "../types/interfaces";
import SearchBar from './SearchBar';

/**
 * The DAFS component provides a user interface for data analysts to manage datasets, including searching, listing, and navigating dataset options.
 */
export const DAFS = () => {
    // Using MUI theme for consistent styling across the app
    const theme = useTheme();

    // Access the current user's context to personalize content.
    const { user } = useUser();

    // State for storing datasets currently shown and all datasets retrieved
    const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
    const [allDatasets, setAllDatasets] = useState<DatasetInfo[]>([]);

    // Navigation hook to navigate between routes
    const navigate = useNavigate();

    /**
     * Handles the search operation in the datasets list.
     * @param searchTerm The text to search for within dataset names.
     */
    const handleSearch = (searchTerm: string) => {
        if (!searchTerm.trim()) {
            setDatasets(allDatasets);
        } else {
            const filteredDatasets = allDatasets.filter(dataset =>
                dataset.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setDatasets(filteredDatasets);
        }
    };
    /**
     * Effect hook to fetch datasets and budgets.
     * It only runs when the user context changes, indicating a login or logout action.
     */
    useEffect(() => {
      const fetchDatasetsAndBudgets = async () => {
          if (user) {
              try {
                  const datasets = await getAvailableDatasets(user);
                  const budgets = await getBudgets(user.handle); 
  
                  const datasetsWithBudget = datasets.map(dataset => {
                      const datasetBudget = budgets.find(budget => budget.dataset === dataset.id);
                      return { ...dataset, budget: datasetBudget };
                  });
                  setAllDatasets(datasetsWithBudget);
                  setDatasets(datasetsWithBudget);
              } catch (error) {
                  console.error("Error fetching datasets and budgets", error);
              }
          } else {
              console.log("User not logged in");
          }
      };
  
      fetchDatasetsAndBudgets();
  }, [user]);
  
    return(
        <Stack 
          sx={{
            background: theme.palette.primary.main,
            minHeight: '100vh',
            position: 'relative',
            alignItems: 'center',
            spacing: 2,
          }}
        >
        <Header />
        <Container maxWidth="md" sx={{ textAlign: 'center', marginBottom: '20px' }}>
        <Typography variant="h5" color="white" sx={{ my: 2 }}>
            Welcome, {user ? user.name : 'User'}
        </Typography>
        <Typography variant="h4" color="white" sx={{ mb: 2 }} >
            Available Datasets
        </Typography>
        <Box display="flex" justifyContent="flex-end">
            <SearchBar onSearch={handleSearch} />
        </Box>
        <Paper sx={{ width: '100%', overflow: 'hidden', background: 'transparent', boxShadow: 'none' }}>
            <Table sx={{ '.MuiTableCell-root': { color: 'white' } }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Dataset Name</TableCell>
                        <TableCell>Epsilon <br /> Allocated (Consumed)</TableCell>
                        <TableCell>Delta  <br />Allocated (Consumed)</TableCell>
                        <TableCell>Privacy Notation</TableCell>
                        <TableCell>Options</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {datasets.map((dataset, index) => (
                        <TableRow key={index}>
                            <TableCell>{dataset.name}</TableCell>
                            <TableCell>
                                {dataset.budget?.allocated?.epsilon} ( {dataset.budget?.consumed?.epsilon || '0'} )
                            </TableCell>
                            <TableCell>
                                {dataset.budget?.allocated?.delta ? `${dataset.budget.allocated.delta} (${dataset.budget.consumed?.delta ?? '0'})` : '-'}
                            </TableCell>
                            <TableCell>{dataset.privacy_notion}</TableCell>
                            <TableCell>
                            <Tooltip title="Continue to create statistics">
                                <IconButton 
                                    onClick={() => navigate('/multistep', { state: { dataset: dataset } })} 
                                    sx={{ color: 'white' }}
                                >
                                <ArrowForward />
                                </IconButton>
                            </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </Paper>
        </Container>
        </Stack>
    );
};