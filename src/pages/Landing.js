import React from 'react';
import { Box, Typography } from '@mui/material';

const Landing = () => {
  return (
    <Box sx={{ p: 5, textAlign: 'center' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Overcooked Level Selector
      </Typography>
      <Typography variant="h5" component="p">
        Navigate through the levels and explore their challenge scores.
      </Typography>
    </Box>
  );
};

export default Landing;
