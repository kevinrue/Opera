import React from 'react';
import { Router, Route, Link, IndexRoute, browserHistory} from 'react-router';

// route components
import App from '../../ui/App.jsx';
// import ListPageContainer from '../../ui/containers/ListPageContainer.js';
// import AuthPageSignIn from '../../ui/pages/AuthPageSignIn.js';
// import AuthPageJoin from '../../ui/pages/AuthPageJoin.js';
// import NotFoundPage from '../../ui/pages/NotFoundPage.js';

const NotFound = () => (
  <h1>404.. This page is not found!</h1>)

const NotExist = () => (
  <h1>This is the "NotExist" page!</h1>)

const Nav = () => (
  <div>
    <Link to='/'>Home</Link>&nbsp;
    <Link to='/404'>404</Link>
  </div>
)

const Container = (props) => <div>
  <Nav />
  {props.children}
</div>

export const renderRoutes = () => (
  <Router history={browserHistory}>
  	<Route path='/' component={Container}>
  		<IndexRoute component={App} />
  		<Route path='404' component={NotFound} />
  		<Route path='*' component={NotFound} />
  	</Route>    
  </Router>
);