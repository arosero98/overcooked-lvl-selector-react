import React from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
} from '@chakra-ui/react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Thank you for your message!');
  };

  return (
    <Box p={5} maxW="800px" mx="auto">
      <Heading as="h2" size="lg" mb={5}>Contact Us</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input type="text" placeholder="Your Name" />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="your.email@example.com" />
          </FormControl>
          <FormControl id="subject" isRequired>
            <FormLabel>Subject</FormLabel>
            <Input type="text" placeholder="Subject of your message" />
          </FormControl>
          <FormControl id="message" isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea placeholder="Your message here..." rows={5} />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">Send</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Contact;
