import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
} from '@mui/material';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Thank you for your message!');
  };

  return (
    <Box sx={{ p: 5, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" component="h2" sx={{ mb: 5 }}>
        Contact Us
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <TextField
            required
            label="Name"
            type="text"
            placeholder="Your Name"
            fullWidth
          />
          <TextField
            required
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            fullWidth
          />
          <TextField
            required
            label="Subject"
            type="text"
            placeholder="Subject of your message"
            fullWidth
          />
          <TextField
            required
            label="Message"
            multiline
            rows={5}
            placeholder="Your message here..."
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Send
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Contact;
