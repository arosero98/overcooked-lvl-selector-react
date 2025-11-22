// src/components/Header.js
import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const getLinkStyles = (path) => {
    return location.pathname === path ? { fontWeight: 'bold', textDecoration: 'underline' } : {};
  };

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 5,
        p: 5,
        borderBottom: '1px solid',
        borderColor: 'grey.300',
      }}
    >
      <Typography variant="h4" component="h1">
        Overcooked Level Selector
      </Typography>
      <Box component="nav">
        <Link component={RouterLink} to="/" sx={{ p: 3, ...getLinkStyles('/') }}>
          Home
        </Link>
        <Link component={RouterLink} to="/" sx={{ p: 3, ...getLinkStyles('/') }}>
          Taxonomy
        </Link>
        <Link component={RouterLink} to="/challenge" sx={{ p: 3, ...getLinkStyles('/challenge') }}>
          Measuring Challenge
        </Link>
        <Link component={RouterLink} to="/contact" sx={{ p: 3, ...getLinkStyles('/contact') }}>
          Contact
        </Link>
      </Box>
    </Box>
  );
};

export default Header;
