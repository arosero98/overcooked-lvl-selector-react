import React from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { Field } from '@chakra-ui/react/field';

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
          <Field.Root required>
            <Field.Label>Name</Field.Label>
            <Input type="text" placeholder="Your Name" />
          </Field.Root>
          <Field.Root required>
            <Field.Label>Email</Field.Label>
            <Input type="email" placeholder="your.email@example.com" />
          </Field.Root>
          <Field.Root required>
            <Field.Label>Subject</Field.Label>
            <Input type="text" placeholder="Subject of your message" />
          </Field.Root>
          <Field.Root required>
            <Field.Label>Message</Field.Label>
            <Textarea placeholder="Your message here..." rows={5} />
          </Field.Root>
          <Button type="submit" colorScheme="blue" width="full">Send</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Contact;
