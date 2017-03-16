import React from 'react';
import { render } from 'react-dom';

import { Router, Route, Link, IndexRoute, browserHistory} from 'react-router';
import { Button } from 'react-bootstrap';

// route components
import App from '/imports/ui/App.jsx';

import AccountsUIWrapper from '/imports/ui/AccountsUIWrapper.jsx';

import ExperimentsTablePage from '/imports/ui/pages/ExperimentsTablePage.jsx';
import AddExperimentPage from '/imports/ui/pages/AddExperimentPage.jsx';
import RemoveExperimentPage from '/imports/ui/pages/RemoveExperimentPage.jsx';

import RawFastqTablePage from '/imports/ui/pages/RawFastqTablePage.jsx';
import RawFastqRecord from '/imports/ui/forms/RawFastqRecord.jsx';
import AddRawFastqRecordPage from '/imports/ui/pages/AddRawFastqRecordPage.jsx';
import AddRawFastqBatchPage from '/imports/ui/pages/AddRawFastqBatchPage.jsx';

import PlatformsTablePage from '/imports/ui/pages/PlatformsTablePage.jsx';

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
			    <li><Link to='/platforms'>Platforms</Link></li>
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
  		<Route path='/experiments' component={ExperimentsTablePage} />
  		<Route path='/experiments/add' component={AddExperimentPage} />
  		<Route path='/experiments/remove' component={RemoveExperimentPage} />
  		<Route path='/rawFastq' component={RawFastqTablePage} />
  		<Route path='/rawFastq/addOne' component={AddRawFastqRecordPage} />
  		<Route path='/rawFastq/addBatch' component={AddRawFastqBatchPage} />
  		<Route path='/rawFastq/:_id' component={RawFastqRecord} />
  		<Route path='/platforms' component={PlatformsTablePage} />
  	</Route>
  	<Route path='*' component={NotFound} />
  </Router>
);

Meteor.startup(() => {
	// console.log('Client started up')
	render(renderRoutes(), document.getElementById('render-target'));
});
