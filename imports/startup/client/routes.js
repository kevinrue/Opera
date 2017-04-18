import React from 'react';
import { render } from 'react-dom';

import AccountsUIWrapper from '/imports/ui/AccountsUIWrapper.jsx';
import { Link, Router, Route, IndexRoute, browserHistory} from 'react-router';
import { Button } from 'react-bootstrap';

// Components
import RawFastqRecord from '/imports/ui/components/RawFastqRecord.jsx';

// Pages
import WelcomePage from '/imports/ui/pages/WelcomePage.jsx';

import ExperimentsTablePage from '/imports/ui/pages/ExperimentsTablePage.jsx';
import AddExperimentBatchPage from '/imports/ui/pages/AddExperimentBatchPage.jsx';

import AddSampleBatchPage from '/imports/ui/pages/AddSampleBatchPage.jsx'

import AddRawFastqUnitBatchPage from '/imports/ui/pages/AddRawFastqUnitBatchPage.jsx'

import AddControlledVocabularyPage from '/imports/ui/pages/AddControlledVocabularyPage.jsx'
import AddExperimentTypePage from '/imports/ui/pages/AddExperimentTypePage.jsx'

import PlatformsTablePage from '/imports/ui/pages/PlatformsTablePage.jsx';

import ResetPage from '/imports/ui/pages/ResetPage.jsx';

// Specific
import Denied from '/imports/ui/Denied403.jsx';
import NotFound from '/imports/ui/NotFound404.jsx';

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
			    <li><Link to='/experiments'>Experiments</Link></li>
			    <li><Link to='/samples'>Samples</Link></li>
			    <li><Link to='/raw-fastq-units'>Raw FASTQ</Link></li>
			    <li><Link to='/reset'>Reset</Link></li>
	    	</ul>
	    	<ul className="nav navbar-nav navbar-right" id="navbar-signin">
		    	<li><AccountsUIWrapper /></li>
		    </ul>
	    </div>
		</div>
	</nav>
);

const Container = (props) => (
	<div>
	  <Nav />
	  {props.children}
	</div>
);

const renderRoutes = () => (
  <Router history={browserHistory}>
  	<Route path='/' component={Container}>
  		<IndexRoute component={WelcomePage} />
  		<Route path='/experiments' component={ExperimentsTablePage} />
  		<Route path='/experiments/addBatch' component={AddExperimentBatchPage} />
  		<Route path='/samples' component={AddSampleBatchPage} />
  		<Route path='/raw-fastq-units' component={AddRawFastqUnitBatchPage} />
  		<Route path='/reset' component={ResetPage} />
  		<Route path='/403' component={Denied} />
  		<Route path='*' component={NotFound} />
  	</Route>
  	<Route path='*' component={NotFound} />
  </Router>
);

Meteor.startup(() => {
	// console.log('Client started up')
	render(renderRoutes(), document.getElementById('render-target'));
});
