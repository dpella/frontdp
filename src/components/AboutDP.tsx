/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { useTheme } from "@mui/material/styles";
import { Box, Stack, Typography, Divider, useMediaQuery } from "@mui/material";
import { Header } from "./Header";
import { useNavigate } from "react-router-dom";

/**
 * AboutDP Component: Renders information about Differential Privacy.
 * Utilizes Material-UI components for styling.
 * @returns JSX.Element
 */
const AboutDP: React.FC = () => {
    const theme = useTheme()
    const navigate = useNavigate(); 
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const contentPadding = isSmallScreen ? '0 24px' : '0 32px'; 

    return (
      <Stack sx={{ background: theme.palette.primary.main, minHeight: '100vh', alignItems: 'center' }}> 
          <Header />
          <Box sx={{ maxWidth: '900px', margin: '2rem auto 0', textAlign: 'justify', marginTop: '2rem' }}>
              <Box sx={{ padding: contentPadding }}>
                  <Typography variant="h3" gutterBottom align="center">
                      Unleash the power of analytics
                  </Typography>
                  <Typography variant="h4" gutterBottom align="center">
                      while maintaining the privacy of individuals
                  </Typography>
              </Box>
              <Divider sx={{ backgroundColor: 'white', margin: 'auto', width: '70%', height: '2px' }} />
              <Box sx={{ padding: contentPadding, marginTop: '2rem' }}>
                  <Typography variant="body1" paragraph>
                      Differential privacy is one of the most innovative and modern data anonymization techniques, 
                      and is used to protect data by big companies such as Google and Apple. DP is different from 
                      other methods in the way that it changes the process of accessing data instead of changing 
                      the database itself.
                  </Typography>
                  <Typography variant="body1" paragraph>
                      DP works by adding noise to a dataset- using a randomized function to decide if accessed data 
                      should be changed or kept as it was. The dataset with added noise will thus generate an altered dataset, 
                      and depending on the amount of noise that is added to alter the data, the levels of privacy protection will vary. 
                      It is therefore called the privacy parameter epsilon. The smaller epsilon is (approaching zero), 
                      the stronger the protection.
                  </Typography>
                  <Typography variant="body1" paragraph>
                      The absence of any individual that the original dataset contains does not significantly affect the probability distribution of the outcomes. 
                      DP therefore guarantees that a data analyst cannot obtain much about any specific individual in the dataset when analysing the algorithm's output.
                  </Typography>
                  <Typography variant="body1" paragraph>
                      As with other data anonymization techniques, there are specific requirements for DP to be implemented correctly. As mentioned previously, 
                      DP works by adding noise to a dataset. If the dataset is not large enough, the generated data will be misleading. Therefore, there is a size requirement for DP. 
                      This is known as the Law of Large Numbers.
                  </Typography>
              </Box>
          </Box>
      </Stack>
  );
};
    
export default AboutDP;