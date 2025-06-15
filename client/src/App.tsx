import { BrowserRouter as Router, Routes, Route } from 'react-router';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import CreateRecipe from './pages/CreateRecipe';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/recipes' element={<BrowsePage />} />
          <Route path='/recipes/create' element={<CreateRecipe />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
