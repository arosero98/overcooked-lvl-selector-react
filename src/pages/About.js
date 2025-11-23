import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';

const About = () => {
  return (
    <Box sx={{ p: 5, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h3" component="h1" textAlign="center" sx={{ mb: 5 }}>
        About the Level Selector
      </Typography>
      <Typography variant="h5" component="h3" sx={{ mt: 5, mb: 2 }}>
        How to use the Level Selector
      </Typography>
      <Typography variant="h5" component="h3" sx={{ mt: 5, mb: 2 }}>
        Reference
      </Typography>
      <Typography variant="h5" component="h3" sx={{ mt: 5, mb: 2 }}>
        Meet the Team
      </Typography>
    </Box>
  );
};

export default About;
