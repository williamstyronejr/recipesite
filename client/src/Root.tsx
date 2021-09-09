import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './scenes/Home';
import SigninPage from './scenes/auth/Signin';
import SignupPage from './scenes/auth/Signup';
import Footer from './components/Footer';

export default () => (
  <Router>
    <main className="main">
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/signin" component={SigninPage} />
        <Route exact path="/signup" component={SignupPage} />
      </Switch>
    </main>
    <Footer />
  </Router>
);
