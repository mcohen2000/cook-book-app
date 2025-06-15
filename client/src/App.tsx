import { BrowserRouter as Router, Routes, Route } from 'react-router';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/recipes' element={<BrowsePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
