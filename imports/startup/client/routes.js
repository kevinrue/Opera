import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// route components
import App from '../../ui/App.jsx';
// import ListPageContainer from '../../ui/containers/ListPageContainer.js';
// import AuthPageSignIn from '../../ui/pages/AuthPageSignIn.js';
// import AuthPageJoin from '../../ui/pages/AuthPageJoin.js';
// import NotFoundPage from '../../ui/pages/NotFoundPage.js';

const NotFound = () => (
  <h1>404.. This page is not found!</h1>)

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route exact path="/" component={App} />
    <Route path='*' component={NotFound} />
  </Router>
);