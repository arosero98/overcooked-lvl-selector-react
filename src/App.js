import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import Header from './components/Header';
import Landing from './pages/Landing';
import Levels from './pages/Levels';
import ChallengeScorecard from './pages/ChallengeScorecard';
import Contact from './pages/Contact';
import About from './pages/About';

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <Box>
      {!isLandingPage && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/challenge" element={<ChallengeScorecard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </Box>
  );
}

export default App;
