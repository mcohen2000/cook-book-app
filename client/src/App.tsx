import { BrowserRouter as Router, Routes, Route } from 'react-router';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import CreateRecipe from './pages/CreateRecipe';
import RecipeDetail from './pages/RecipeDetail';
import EditRecipe from './pages/EditRecipe';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/recipes' element={<BrowsePage />} />
          <Route path='/recipes/create' element={<CreateRecipe />} />
          <Route path='/recipes/:id' element={<RecipeDetail />} />
          <Route path='/recipes/:id/edit' element={<EditRecipe />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
