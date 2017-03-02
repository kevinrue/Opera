import React from 'react';

import { Router, Route, Link, IndexRoute, browserHistory} from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';

// route components
import App from '../../ui/App.jsx';

import AccountsUIWrapper from '../../ui/AccountsUIWrapper.jsx';

import ExperimentsTable from '../../ui/ExperimentsTable.jsx';
import AddExperimentForm from '../../ui/AddExperimentForm.jsx';
import RemoveExperimentForm from '../../ui/RemoveExperimentForm.jsx';

import RawFastqRecordsInfo from '../../ui/RawFastqRecordsInfo.jsx';
import AddRawFastqRecords from '../../ui/AddRawFastqRecords.jsx';

const NotFound = () => (
  <h1>404.. This page is not found!</h1>)

const Nav = () => (
	<div className='NavContainer'>
		<div className='NavActive'>
		  <div className='NavBar'>
		  	<div className='NavBarLeft'>
		  		<LinkContainer to='/'><Button>Home</Button></LinkContainer>
			    <LinkContainer to='/rawFastq'><Button>Raw FASTQ</Button></LinkContainer>
			    <LinkContainer to='/experiments'><Button>Experiments</Button></LinkContainer>
		  	</div>
		  	<div className='NavBarRight'>
		  		<AccountsUIWrapper style='float: right;'/>
		  	</div>
		  </div>
	  </div>
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
  		<Route path='/rawFastq' component={RawFastqRecordsInfo} />
  		<Route path='/rawFastq/add' component={AddRawFastqRecords} />
  	</Route>
  	<Route path='*' component={NotFound} />
  </Router>
);
