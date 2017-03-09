import React from 'react';
import { render } from 'react-dom';

import { Router, Route, Link, IndexRoute, browserHistory} from 'react-router';
import { Button } from 'react-bootstrap';

// route components
import App from '../../ui/App.jsx';

import AccountsUIWrapper from '../../ui/AccountsUIWrapper.jsx';

import ExperimentsTable from '../../ui/ExperimentsTable.jsx';
import AddExperimentForm from '../../ui/AddExperimentForm.jsx';
import RemoveExperimentForm from '../../ui/RemoveExperimentForm.jsx';

import RawFastqRecordsInfo from '../../ui/RawFastqRecordsInfo.jsx';
import AddRawFastqRecord from '../../ui/AddRawFastqRecord.jsx';
import AddRawFastqRecords from '../../ui/AddRawFastqRecords.jsx';
import RawFastqRecord from '../../ui/RawFastqRecord.jsx';

const NotFound = () => (
  <h1>404.. This page is not found!</h1>)

const Nav = () => (
	<nav className="navbar navbar-inverse">
		<div className="container-fluid">
			<div className="navbar-header">
				<Button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-navbar" aria-expanded="false">
	        <span className="sr-only">Toggle navigation</span>
	        <span className="icon-bar"></span>
	        <span className="icon-bar"></span>
	        <span className="icon-bar"></span>
	      </Button>
	      <a className="navbar-brand" href="/"><code>SB</code></a>
	    </div>
	    <div className="collapse navbar-collapse" id="bs-navbar">
	      <ul className="nav navbar-nav">
			    <li><Link to='/rawFastq'>Raw FASTQ</Link></li>
			    <li><Link to='/experiments'>Experiments</Link></li>
	    	</ul>
	    	<ul className="nav navbar-nav navbar-right" id="navbar-signin">
		    	<li><AccountsUIWrapper /></li>
		    </ul>
	    </div>
		</div>
	</nav>
)

const Container = (props) => <div>
  <Nav />
  <div id='page'>
  {props.children}
  </div>
</div>

const renderRoutes = () => (
  <Router history={browserHistory}>
  	<Route path='/' component={Container}>
  		<IndexRoute component={App} />
  		<Route path='/experiments' component={ExperimentsTable} />
  		<Route path='/experiments/add' component={AddExperimentForm} />
  		<Route path='/experiments/remove' component={RemoveExperimentForm} />
  		<Route path='/rawFastq' component={RawFastqRecordsInfo} />
  		<Route path='/rawFastq/addOne' component={AddRawFastqRecord} />
  		<Route path='/rawFastq/addBatch' component={AddRawFastqRecords} />
  		<Route path='/rawFastq/:_id' component={RawFastqRecord} />
  	</Route>
  	<Route path='*' component={NotFound} />
  </Router>
);

Meteor.startup(() => {
	// console.log('Client started up')
	render(renderRoutes(), document.getElementById('render-target'));
});
