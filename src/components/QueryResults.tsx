/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Typography, Paper, Button, Stack, Box} from '@mui/material';
import {  useLocation, useNavigate} from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
import { Header } from "./Header";
import { BarChart} from '@mui/x-charts';
import { Result } from '../types/interfaces';
import { useEffect, useState } from 'react';

/**
 * Displays the results of a query, as a bar chart or a single statistic value.
 * This component retrieves query result details passed via navigation state and handles their visualization.
 */
const QueryResult = () => {
    // Using MUI theme for consistent styling across the app
    const theme = useTheme();

    // Hook to access the current router location and its state.
    const location = useLocation();
    const { queryResult, method, variable, histogram, dataset } = location.state || {};

    // Navigation hook to navigate between routes
    const navigate = useNavigate();

    // State for managing label display on the X-axis of the chart.
    const [xAxisLabel, setXAxisLabel] = useState('');

    // If method is count then use methodkey with only method in it.
    let methodKey: string;
    if(method==="count"){
      methodKey = `${method}`.toLowerCase();
    }
    else{
      methodKey = `${variable}_${method}`.toLowerCase();
    }


    // Maps the query result to extract series data for the chart.
    const seriesData = queryResult?.map((item: Result) => item[methodKey]);

    /**
     * Determines the key for the X-axis by excluding a specified key from the result object.
     * 
     * @param {Result} resultObject - The object containing the result data.
     * @param {string} excludeKey - The key to exclude when determining the X-axis label.
     * @returns {string | undefined} - The key for the X-axis label, if found.
     */
    const getXAxisKey = (resultObject: Result, excludeKey: string) => {
      const keys = Object.keys(resultObject);
      return keys.find(key => key !== excludeKey);
    };

     /**
     * Computes label for the X-axis based on the query results and a method key.
     * 
     * @param {Result} result - The object containing the result data.
     */
    const xAxisLabels = queryResult?.map((result: Result) => {
      const xAxisKey = getXAxisKey(result, methodKey);
       return xAxisKey ? result[xAxisKey]?.toString() : 'Unknown';
    });

    /**
     * Effect hook to update the X-axis label when query results are available
     * It only triggers when queryResult or method changes.
     */
    useEffect(() => {
      if (queryResult && queryResult.length > 0) {
        const keys = Object.keys(queryResult[0]);
        const newLabel = keys.find(key => key !== methodKey);
        if (newLabel) {
          setXAxisLabel(newLabel);
        }
      }
    }, [queryResult, methodKey]);

   
    /**
     * Configuration for the chart settings.
     */
    const chartSetting = {
      yAxis: [
        {
          label: methodKey,
        },
      ],
      sx: {
        '& .MuiChartsAxis-label': {
          transform: 'translate(-50px, 0)',
        }
      }
    };
    
    return (
        <Stack
          sx={{
            background: theme.palette.primary.main,
            minHeight: '100vh',
            position: 'relative',
            alignItems: 'center',
            color: 'white',
          }}
        >
        <Header />
        <Typography variant="h4"  sx={{ mt: 3 }}>DP-statistics</Typography>
          <Box sx={{display:'flex', justifyContent: 'center', alignItems:'center', top: '50px', width: '100%'}}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '80%'}}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '20%' }}>
                <Typography variant="subtitle1">Dataset name:</Typography>
                <Box sx={{ p: 1, bgcolor: 'primary.main', border: 1, borderColor: 'white' }}>
                  <Typography textAlign="center">{dataset ? dataset.name : 'No dataset chosen'}</Typography>
                </Box>
              </Box>
              <Paper elevation={3} sx={{ 
              width: '100%', 
              height: 300, 
              mt: 2, 
              backgroundColor: '#999999',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              }}>
              {histogram ? (
                  queryResult && (
                    <BarChart
                      dataset={queryResult}
                      xAxis={[{ scaleType: 'band', data: xAxisLabels, label: xAxisLabel}]}
                      series={[{ data: seriesData, color: '#2B2B2B',}]}
                      width={800}
                      height={300}
                      {...chartSetting}
                      tooltip={{ trigger: 'item'}}
                      margin={{ left: 100 }}
                    />
                  )
                ) : (
                  <Typography variant="h5">
                    Result: {method} for {variable} is {seriesData}
                  </Typography>
                )}
              </Paper>
            </Box>
          </Box>
          <Box sx={{ mt: 2, display: 'flex',justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="secondary" onClick={() => navigate('/DAFS')} >Available datasets</Button>
          </Box>
        </Stack>
    );
};
export default QueryResult;