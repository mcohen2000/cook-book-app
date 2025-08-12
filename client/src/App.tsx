import { BrowserRouter as Router, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowseRecipes';
import BrowseCookbooks from './pages/BrowseCookbooks';
import CookbookDetail from './pages/CookbookDetail';
import CreateRecipe from './pages/CreateRecipe';
import CreateCookbook from './pages/CreateCookbook';
import RecipeDetail from './pages/RecipeDetail';
import EditRecipe from './pages/EditRecipe';
import Profile from './pages/Profile';
import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthProvider';
import { ModalProvider } from './context/ModalContext';
import EditCookbook from './pages/EditCookbook';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicOnlyRoute from './components/auth/PublicOnlyRoute';

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
                {/* Public Routes */}
                <Route path='/' element={<HomePage />} />
                <Route path='/recipes' element={<BrowsePage />} />
                <Route path='/cookbooks' element={<BrowseCookbooks />} />
                <Route path='/recipes/:id' element={<RecipeDetail />} />
                <Route path='/cookbooks/:id' element={<CookbookDetail />} />

                {/* Routes for logged out users only */}
                <Route element={<PublicOnlyRoute />}>
                  <Route path='/register' element={<Register />} />
                  <Route path='/login' element={<Login />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path='/profile' element={<Profile />} />
                  <Route
                    path='/cookbooks/create'
                    element={<CreateCookbook />}
                  />
                  <Route
                    path='/cookbooks/:id/edit'
                    element={<EditCookbook />}
                  />
                  <Route path='/recipes/create' element={<CreateRecipe />} />
                  <Route path='/recipes/:id/edit' element={<EditRecipe />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </ModalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
