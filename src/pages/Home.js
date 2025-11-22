import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  Heading,
  Select,
  Button,
  Grid,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Tbody,
  Tr,
  Td,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';


const Home = () => {
  const [allLevelsData, setAllLevelsData] = useState({});
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [filters, setFilters] = useState({
    start_at_go: '',
    fixed_environment: '',
    dish_washer: '',
    challenge_score: '',
  });
  const [filterOptions, setFilterOptions] = useState({
    start_at_go: [],
    fixed_environment: [],
    dish_washer: [],
  });
  const [notification, setNotification] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    fetch('/all_levels.json')
      .then((response) => response.json())
      .then((data) => {
        setAllLevelsData(data);
      });
  }, []);

  useEffect(() => {
    const startAtGoOptions = [...new Set(Object.values(allLevelsData).map(level => level.start_at_go))];
    const fixedEnvironmentOptions = [...new Set(Object.values(allLevelsData).map(level => level.fixed_environment))];
    const dishWasherOptions = [...new Set(Object.values(allLevelsData).map(level => level.dish_washer))];

    setFilterOptions({
      start_at_go: startAtGoOptions,
      fixed_environment: fixedEnvironmentOptions,
      dish_washer: dishWasherOptions,
    });
    
    if (!searchActive) {
        setFilteredLevels(Object.keys(allLevelsData));
    }

  }, [allLevelsData, searchActive]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = useCallback(() => {
    setSearchActive(true);
    let levels = Object.keys(allLevelsData);

    if (filters.start_at_go) {
      levels = levels.filter(level => allLevelsData[level].start_at_go === filters.start_at_go);
    }
    if (filters.fixed_environment) {
      levels = levels.filter(level => allLevelsData[level].fixed_environment === filters.fixed_environment);
    }
    if (filters.dish_washer) {
      levels = levels.filter(level => allLevelsData[level].dish_washer === filters.dish_washer);
    }
    if (filters.challenge_score) {
      const [min, max] = filters.challenge_score.split('-').map(Number);
      levels = levels.filter(level => {
        const score = Number(allLevelsData[level].challenge_score);
        return score >= min && score <= max;
      });
    }

    setFilteredLevels(levels);
    setNotification(`${levels.length} results found`);
  }, [allLevelsData, filters]);


  const clearFilters = () => {
    setSearchActive(false);
    setFilters({
      start_at_go: '',
      fixed_environment: '',
      dish_washer: '',
      challenge_score: '',
    });
    setNotification('');
  };

  const handleLevelClick = (levelId) => {
    setSelectedLevel({id: levelId, ...allLevelsData[levelId]});
    onOpen();
  };
  
  const getScoreColor = (score) => {
    const numericScore = Number(score);
    if (numericScore >= 8) return 'red.100';
    if (numericScore >= 5) return 'yellow.100';
    return 'green.100';
  };

  const renderWorlds = () => {
    if (filteredLevels.length === 0 && searchActive) {
        return <Text>No levels found matching the criteria.</Text>
    }

    const worlds = {};
    filteredLevels.forEach(levelId => {
        const worldNum = levelId.split('_')[1];
        if (!worlds[worldNum]) {
            worlds[worldNum] = [];
        }
        worlds[worldNum].push(levelId);
    });

    return Object.keys(worlds).sort((a, b) => Number(a) - Number(b)).map(worldNum => (
        <Box key={worldNum} mb={5}>
            <Heading as="h3" size="md" mb={3}>World {worldNum}</Heading>
            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
                {worlds[worldNum].sort((a, b) => Number(a.split('_')[2]) - Number(b.split('_')[2])).map(levelId => (
                    <Box
                        key={levelId}
                        p={5}
                        shadow="md"
                        borderWidth="1px"
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => handleLevelClick(levelId)}
                        bg={getScoreColor(allLevelsData[levelId].challenge_score)}
                    >
                        <Heading fontSize="xl">{levelId.replace(/_/g, ' ').replace('Level ', 'Level ')}</Heading>
                        <Text mt={4}>Challenge Score: {allLevelsData[levelId].challenge_score}</Text>
                    </Box>
                ))}
            </Grid>
        </Box>
    ));
  };

  return (
    <Box p={5} maxW="1200px" mx="auto">
      <Box mb={5}>
        <Heading as="h2" size="lg">A look behind the challenge</Heading>
        <Text mt={3}>
          Each level's challenge score was calculated by examining various aspects of each Overcooked 2 level to see how task load is manipulated through game design.
          Click the button below to see how each of these aspects are defined in our taxonomy.
        </Text>
        <Button as={RouterLink} to="/challenge" colorScheme="gray" mt={3}>Challenge Score Breakdown</Button>
      </Box>

      <Heading as="h2" size="lg" mb={4}>Levels</Heading>
      <Flex>
        <Box w="300px" p={5} mr={5} border="1px" borderColor="gray.200" borderRadius="md" bg="gray.50" h="fit-content">
          <Heading as="h3" size="md" mb={4}>Filter Levels</Heading>
          <Select name="start_at_go" value={filters.start_at_go} onChange={handleFilterChange} mb={3}>
            <option value="">Start at Go?</option>
            {filterOptions.start_at_go.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </Select>
          <Select name="fixed_environment" value={filters.fixed_environment} onChange={handleFilterChange} mb={3}>
            <option value="">Fixed Environment?</option>
            {filterOptions.fixed_environment.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </Select>
          <Select name="dish_washer" value={filters.dish_washer} onChange={handleFilterChange} mb={3}>
            <option value="">Dish Washer?</option>
            {filterOptions.dish_washer.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </Select>
          <Select name="challenge_score" value={filters.challenge_score} onChange={handleFilterChange} mb={3}>
            <option value="">Challenge Score</option>
            <option value="1-4">1-4</option>
            <option value="5-10">5-10</option>
          </Select>
          <Button colorScheme="blue" onClick={applyFilters} width="100%" mb={2}>Search</Button>
          {searchActive && <Button onClick={clearFilters} width="100%" variant="outline">Clear Search</Button>}
        </Box>
        <Box flex="1">
          {notification && <Text fontWeight="bold" mb={3}>{notification}</Text>}
          {renderWorlds()}
        </Box>
      </Flex>

      {selectedLevel && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedLevel.id.replace(/_/g, ' ')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table variant="simple">
                <Tbody>
                  {Object.entries(selectedLevel).filter(([key]) => key !== 'id').map(([key, value]) => (
                    <Tr key={key}>
                      <Td textTransform="capitalize">{key.replace(/_/g, ' ')}</Td>
                      <Td>{value}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {selectedLevel.id === 'Level_1_1' && (
                  <Button as={ChakraLink} href="/Overcooked 2 level 1.1.pdf" isExternal mt={4} w="100%">
                      Full Level Breakdown
                  </Button>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default Home;
