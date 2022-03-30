import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Box } from 'grommet';
import AppBar from './components/AppBar';

import Login from './pages/Login';
import Oops from './pages/Oops';
import Landing from './pages/Landing';
import Generator from './pages/generator/Generator';

function App() {
  useEffect(() => {
    document.title = 'Bingo Creator - Jeffrey Carr';
  });

  return (
    <Box>
      <AppBar />

      <Router>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/generate' element={<Generator />} />
          <Route path='*' element={<Oops />} />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
