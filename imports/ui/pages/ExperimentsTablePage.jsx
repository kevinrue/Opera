import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data'; // 

import { browserHistory } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { ButtonToolbar, Button } from 'react-bootstrap';

import { Experiments } from '/imports/api/experiments/experiments.js';

import Loading from '/imports/ui/Loading.jsx';

class ExperimentsTablePage extends Component {

  goToAddBatchExperiment() {
    browserHistory.push('/experiments/addBatch');
  }

	renderExperiments() {
		return (
      <BootstrapTable data={this.props.experiments} striped={true} hover={true} keyField='_id' pagination>
        <TableHeaderColumn dataField="title" dataAlign="center" width="33%">Title</TableHeaderColumn>
        <TableHeaderColumn dataField="type" dataAlign="center" width="10%">Type</TableHeaderColumn>
        <TableHeaderColumn dataField="organism" dataAlign="center" width="10%">Organism</TableHeaderColumn>
        <TableHeaderColumn dataField="contact" dataAlign="center" width="10%">Contact</TableHeaderColumn>
        <TableHeaderColumn dataField="description" dataAlign="center" width="33%">Description</TableHeaderColumn>
        <TableHeaderColumn dataField="notes" dataAlign="center" width="33%">Notes</TableHeaderColumn>
      </BootstrapTable>
		);
  }

  renderExperimentCount () {
    return(
      <p>
        There are
        currently {this.props.experiments.length} experiments
        in the database.
      </p>
    );
  }

  renderMainPanel() {
    return(
      <div className='main-panel'>
        <header><h1>Overview</h1></header>
        { this.props.loading ? <Loading /> : this.renderExperimentCount() }
        <header><h1>Table</h1></header>
        { this.props.loading ? <Loading /> : this.renderExperiments() }
      </div>
    );
  }

  renderAdminPanel() {
    return(
      <div className='admin-panel'>
        <h4>Admin panel</h4>
          <ButtonToolbar>
            <Button bsStyle="link" onClick={this.goToAddBatchExperiment.bind(this)}>Add batch</Button>
          </ButtonToolbar>
      </div>
    );
  }

	render() {
    return (
    	<div id='page'>
        { this.renderMainPanel() }

        { this.props.currentUser ? this.renderAdminPanel() : '' }

        <div id="clearingdiv"></div>
    	</div>
    );
  }
	
}

ExperimentsTablePage.propTypes = {
  currentUser: PropTypes.object, // null if user is not logged in
	experiments: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

ExperimentsTablePage.defaultProps = {
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer(() => {
  const user = Meteor.user();
	const subscription = Meteor.subscribe('experiments');
  const loading = (user === undefined || !subscription.ready());

  return ({
    currentUser: user, // pass as props so that it is fixed for this page
    experiments: Experiments.find({}).fetch(),
    loading: loading,
  });
}, ExperimentsTablePage);