import { BrowserRouter as Router, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import CreateRecipe from './pages/CreateRecipe';
import RecipeDetail from './pages/RecipeDetail';
import EditRecipe from './pages/EditRecipe';
import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthProvider';
import { ModalProvider } from './context/ModalContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ModalProvider>
          <Router>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/recipes' element={<BrowsePage />} />
                <Route path='/recipes/create' element={<CreateRecipe />} />
                <Route path='/recipes/:id' element={<RecipeDetail />} />
                <Route path='/recipes/:id/edit' element={<EditRecipe />} />
              </Route>
            </Routes>
          </Router>
        </ModalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
