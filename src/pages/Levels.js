import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Link,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink } from 'react-router-dom';


const Levels = () => {
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    setIsDialogOpen(true);
  };
  
  const getScoreColor = (score) => {
    const numericScore = Number(score);
    if (numericScore >= 8) return '#ffcdd2'; // red
    if (numericScore >= 5) return '#fff9c4'; // yellow
    return '#c8e6c9'; // green
  };

  const renderWorlds = () => {
    if (filteredLevels.length === 0 && searchActive) {
        return <Typography>No levels found matching the criteria.</Typography>
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
        <Box key={worldNum} sx={{ mb: 5 }}>
            <Typography variant="h5" component="h3" sx={{ mb: 3 }}>
                World {worldNum}
            </Typography>
            <Grid container spacing={2}>
                {worlds[worldNum].sort((a, b) => Number(a.split('_')[2]) - Number(b.split('_')[2])).map(levelId => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={levelId}>
                        <Box
                            sx={{
                                p: 5,
                                boxShadow: 2,
                                border: '1px solid',
                                borderColor: 'grey.300',
                                borderRadius: 5,
                                cursor: 'pointer',
                                bgcolor: getScoreColor(allLevelsData[levelId].challenge_score),
                                '&:hover': {
                                    boxShadow: 4,
                                },
                            }}
                            onClick={() => handleLevelClick(levelId)}
                        >
                            <Typography variant="h6">
                                {levelId.replace(/_/g, ' ').replace('Level ', 'Level ')}
                            </Typography>
                            <Typography sx={{ mt: 4 }}>
                                Challenge Score: {allLevelsData[levelId].challenge_score}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    ));
  };

  return (
    <Box sx={{ p: 5, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h3" component="h1" textAlign="center" sx={{ mb: 5 }}>
        Overcooked Level Selection
      </Typography>

      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" component="h2">
          A look behind the challenge
        </Typography>
        <Typography sx={{ mt: 3 }}>
          Each level's challenge score was calculated by examining various aspects of each Overcooked 2 level to see how task load is manipulated through game design.
          Click the button below to see how each of these aspects are defined in our taxonomy.
        </Typography>
        <Button component={RouterLink} to="/challenge" variant="outlined" sx={{ mt: 3 }}>
          Challenge Score Breakdown
        </Button>
      </Box>
      
      <Box sx={{ mb: 5, p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 1, bgcolor: 'grey.50' }}>
        <Typography variant="h5" component="h3" sx={{ mb: 4 }}>
          Filter Levels
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              select
              fullWidth
              label="Start at Go?"
              name="start_at_go"
              value={filters.start_at_go}
              onChange={handleFilterChange}
              sx={{ width: 'fit-content', minWidth: 200 }}
            >
              <MenuItem value="">All</MenuItem>
              {filterOptions.start_at_go.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              select
              fullWidth
              label="Fixed Environment?"
              name="fixed_environment"
              value={filters.fixed_environment}
              onChange={handleFilterChange}
              sx={{ width: 'fit-content', minWidth: 200 }}
            >
              <MenuItem value="">All</MenuItem>
              {filterOptions.fixed_environment.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              select
              fullWidth
              label="Dish Washer?"
              name="dish_washer"
              value={filters.dish_washer}
              onChange={handleFilterChange}
              sx={{ width: 'fit-content', minWidth: 200 }}
            >
              <MenuItem value="">All</MenuItem>
              {filterOptions.dish_washer.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              select
              fullWidth
              label="Challenge Score"
              name="challenge_score"
              value={filters.challenge_score}
              onChange={handleFilterChange}
              sx={{ width: 'fit-content', minWidth: 200 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1-4">1-4</MenuItem>
              <MenuItem value="5-10">5-10</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={applyFilters}>
            Search
          </Button>
          {searchActive && <Button onClick={clearFilters} variant="outlined">Clear Search</Button>}
        </Box>
      </Box>

      <Box>
        {notification && <Typography fontWeight="bold" sx={{ mb: 3 }}>{notification}</Typography>}
        {renderWorlds()}
      </Box>

      {selectedLevel && (
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedLevel.id.replace(/_/g, ' ')}
            <IconButton
              aria-label="close"
              onClick={() => setIsDialogOpen(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Table>
              <TableBody>
                {Object.entries(selectedLevel).filter(([key]) => key !== 'id').map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ textTransform: 'capitalize' }}>
                      {key.replace(/_/g, ' ')}
                    </TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {selectedLevel.id === 'Level_1_1' && (
              <Button
                component={Link}
                href="/Overcooked 2 level 1.1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                fullWidth
                sx={{ mt: 4 }}
              >
                Full Level Breakdown
              </Button>
            )}
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Levels;
