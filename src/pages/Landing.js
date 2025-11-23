import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {/* Blurred Video Background */}
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(8px)',
          zIndex: -1,
          objectFit: 'cover'
        }}
      >
        <source src="/overcooked-landing-vid.mp4" type="video/mp4" />
      </Box>

      {/* Dark Overlay for better text visibility */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 0
      }} />

      {/* Content */}
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        p: 4,
        textAlign: 'center',
        '@keyframes fadeIn': {
          from: {
            opacity: 0,
            transform: 'translateY(-20px)'
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 800,
            color: 'white',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
            animation: 'fadeIn 1.5s ease-in-out',
            mb: 3
          }}
        >
          Welcome to Overcooked Level Selector
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{
            color: 'white',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
            animation: 'fadeIn 1.5s ease-in-out 0.3s backwards',
            mb: 4
          }}
        >
          Navigate through the levels and explore their challenge scores.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/levels')}
          sx={{
            animation: 'fadeIn 1.5s ease-in-out 0.6s backwards',
            mt: 2,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
              transform: 'scale(1.05)',
              transition: 'all 0.3s ease'
            }
          }}
        >
          Explore Levels
        </Button>
      </Box>
    </Box>
  );
};

export default Landing;
