import React from 'react';
import { Router, Route, Link, IndexRoute, browserHistory} from 'react-router';

// route components
import App from '../../ui/App.jsx';
import AccountsUIWrapper from '../../ui/AccountsUIWrapper.jsx';
import ExperimentsTable from '../../ui/ExperimentsTable.jsx';
import AddExperimentForm from '../../ui/AddExperimentForm.jsx';
import RemoveExperimentForm from '../../ui/RemoveExperimentForm.jsx';

const NotFound = () => (
  <h1>404.. This page is not found!</h1>)

const Nav = () => (
  <div className='NavBar'>
    <Link to='/'>Home</Link>&nbsp;
    <Link to='/experiments'>Experiments</Link>&nbsp;
    <AccountsUIWrapper style='float: right;'/>
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
  		<Route path='/experiments' component={ExperimentsTable} />
  		<Route path='/experiments/add' component={AddExperimentForm} />
  		<Route path='/experiments/remove' component={RemoveExperimentForm} />
  	</Route>
  	<Route path='*' component={NotFound} />
  </Router>
);
