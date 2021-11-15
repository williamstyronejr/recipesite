import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
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
import { AuthProvider, useAuthContext } from './context/auth';

const ProtectedRoutes = ({ children }: { children: any }) => {
  const { state } = useAuthContext();

  return state.authenticated ? children : <Redirect to="/signin" />;
};

export default () => (
  <Router>
    <AuthProvider>
      <Header />
      <main className="main">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/faq" component={FaqPage} />
          <Route path="/started" component={StartedPage} />
          <Route path="/feedback" component={FeedbackPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/support" component={SupportPage} />

          <Route path="/signin" component={SigninPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/recovery" component={RecoveryPage} />

          <Route path="/search" component={SearchPage} />
          <Route exact path="/recipe/:recipeId" component={RecipePage} />
          <Route path="/explore/:type" component={ExplorePage} />

          <Route path="/account/profile/:userId" component={ProfilePage} />
          <ProtectedRoutes>
            <Route path="/recipe/:recipeId/edit" component={EditRecipePage} />

            <Route exact path="/dashboard" component={DashboardPage} />
            <Route path="/dashboard/manage" component={ManageRecipesPage} />
            <Route path="/dashboard/analytics" component={AnalyticsPage} />

            <Route path="/account/settings" component={SettingsPage} />
            <Route path="/account/recipe/create" component={CreateRecipePage} />
          </ProtectedRoutes>
          <Route component={MissingPage} />
        </Switch>
      </main>
      <Footer />
    </AuthProvider>
  </Router>
);
