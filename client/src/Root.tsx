import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import HomePage from './scenes/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import SigninPage from './scenes/auth/Signin';
import SignupPage from './scenes/auth/Signup';
import FaqPage from './scenes/Faq';
import StartedPage from './scenes/Started';
import FeedbackPage from './scenes/Feedback';
import AboutPage from './scenes/About';
import SupportPage from './scenes/Support';
import SearchPage from './scenes/search/Search';
import RecipePage from './scenes/recipe/Recipe';
import SettingsPage from './scenes/account/Settings';
import CreateRecipePage from './scenes/account/CreateRecipe';
import ProfilePage from './scenes/account/Profile';
import EditRecipePage from './scenes/recipe/EditRecipe';
import MissingPage from './scenes/Missing';
import ExplorePage from './scenes/explore/Explore';
import DashboardPage from './scenes/dashboard/Dashboard';
import ManageRecipesPage from './scenes/dashboard/ManageRecipes';
import AnalyticsPage from './scenes/dashboard/Analytics';
import RecoveryPage from './scenes/auth/Recovery';
import FavoritesPage from './scenes/dashboard/Favorites';
import { AuthProvider, useAuthContext } from './context/auth';

// eslint-disable-next-line react/require-default-props
const ProtectedRoutes: React.FC<{ children?: any }> = ({ children = null }) => {
  const { state } = useAuthContext();
  return state.authenticated ? children : <Navigate to="/signin" />;
};

export default () => (
  <Router>
    <AuthProvider>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/started" element={<StartedPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/support" element={<SupportPage />} />

          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/recovery" element={<RecoveryPage />} />

          <Route path="/search" element={<SearchPage />} />
          <Route path="/recipe/:recipeId" element={<RecipePage />} />
          <Route path="/explore/:type" element={<ExplorePage />} />

          <Route path="/account/profile/:userId" element={<ProfilePage />} />

          <Route
            path="/recipe/:recipeId/edit"
            element={
              <ProtectedRoutes>
                <EditRecipePage />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <DashboardPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/dashboard/manage"
            element={
              <ProtectedRoutes>
                <ManageRecipesPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/dashboard/analytics"
            element={
              <ProtectedRoutes>
                <AnalyticsPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/dashboard/favorites"
            element={
              <ProtectedRoutes>
                <FavoritesPage />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/account/settings"
            element={
              <ProtectedRoutes>
                <SettingsPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/account/recipe/create"
            element={
              <ProtectedRoutes>
                <CreateRecipePage />
              </ProtectedRoutes>
            }
          />

          <Route element={<MissingPage />} />
        </Routes>
      </main>

      <Footer />
    </AuthProvider>
  </Router>
);
