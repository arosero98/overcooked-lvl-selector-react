import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import Header from './components/Header';
import Home from './pages/Home';
import ChallengeScorecard from './pages/ChallengeScorecard';
import Contact from './pages/Contact';

function App() {
  return (
    <Box>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/challenge" element={<ChallengeScorecard />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </Box>
  );
}

export default App;
