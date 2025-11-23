import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
} from '@mui/material';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const recipientEmail = 'your.email@example.com'; // Replace with the actual recipient email
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoLink;
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
    </Box>
  );
};

export default Contact;
