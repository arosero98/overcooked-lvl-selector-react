// src/components/Header.js
import React from 'react';
import { Box, Flex, Heading, Link } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const getLinkStyles = (path) => {
    return location.pathname === path ? { fontWeight: 'bold', textDecoration: 'underline' } : {};
  };

  return (
    <Flex
      as="header"
      justify="space-between"
      align="center"
      mb={5}
      p={5}
      borderBottom="1px"
      borderColor="gray.200"
    >
      <Heading as="h1" size="lg">
        Overcooked Level Selector
      </Heading>
      <Box as="nav">
        <Link as={RouterLink} to="/" p={3} {...getLinkStyles('/')}>
          Home
        </Link>
        <Link as={RouterLink} to="/" p={3} {...getLinkStyles('/')}>
          Taxonomy
        </Link>
        <Link as={RouterLink} to="/challenge" p={3} {...getLinkStyles('/challenge')}>
          Measuring Challenge
        </Link>
        <Link as={RouterLink} to="/contact" p={3} {...getLinkStyles('/contact')}>
          Contact
        </Link>
      </Box>
    </Flex>
  );
};

export default Header;
