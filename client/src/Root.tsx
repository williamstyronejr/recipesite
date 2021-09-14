import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
import RecipeListPage from './scenes/recipes/Recipe';
import RecipePage from './scenes/recipe/Recipe';
import SettingsPage from './scenes/account/Settings';
import CreateRecipePage from './scenes/account/CreateRecipe';
import ProfilePage from './scenes/account/Profile';

const MissingPage = () => <section className="missing">404</section>;

export default () => (
  <Router>
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

        <Route path="/search" component={SearchPage} />
        <Route path="/recipes/:type" component={RecipeListPage} />
        <Route path="/recipe/:id" component={RecipePage} />

        <Route path="/account/settings" component={SettingsPage} />
        <Route path="/account/recipe/create" component={CreateRecipePage} />
        <Route path="/account/profile" component={ProfilePage} />

        <Route component={MissingPage} />
      </Switch>
    </main>
    <Footer />
  </Router>
);
