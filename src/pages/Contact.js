import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ open: true, message: `Email sent! Preview URL: ${data.previewUrl}`, severity: 'success' });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setNotification({ open: true, message: data.message || 'Failed to send email.', severity: 'error' });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setNotification({ open: true, message: 'An error occurred while sending the email.', severity: 'error' });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            required
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            required
            label="Subject"
            type="text"
            placeholder="Subject of your message"
            fullWidth
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <TextField
            required
            label="Message"
            multiline
            rows={5}
            placeholder="Your message here..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Send
          </Button>
        </Stack>
      </form>
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
