import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data'; // 

import { browserHistory } from 'react-router';

import { ButtonToolbar, Button } from 'react-bootstrap';

import { Experiments } from '../api/experiments.js';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class ExperimentsTable extends Component {

	renderExperiments() {
		return (
      <BootstrapTable data={this.props.experiments} striped={true} hover={true} keyField='_id'>
        <TableHeaderColumn dataField="name" dataAlign="center" width="20%">Name</TableHeaderColumn>
        <TableHeaderColumn dataField="Nsamples" dataAlign="center" width="80%"
          filter={ { type: 'NumberFilter', delay: 1000, numberComparators: [ '=', '>', '<=' ]  } }>
          Number of samples
        </TableHeaderColumn>
      </BootstrapTable>
		);
  }

  goToAddExperiment() {
    browserHistory.push('/experiments/add');
  }

  goToRemoveExperiment() {
    browserHistory.push('/experiments/remove');
  }

  renderMainPanel() {
    return(
      <div className='main-panel'>
        <header><h1>Experiment List</h1></header>
        {this.renderExperiments()}
      </div>
    );
  }

  renderAdminPanel() {
    return(
      <div className='admin-panel'>
        <h3>Admin panel</h3>
          <ButtonToolbar>
            <Button bsStyle="link" onClick={this.goToAddExperiment.bind(this)}>Add experiment</Button><br/>
            <Button bsStyle="link" onClick={this.goToRemoveExperiment.bind(this)}>Remove experiment</Button>
          </ButtonToolbar>
      </div>
    );
  }

	render() {
    return (
    	<div>
        { this.renderMainPanel() }

        { this.props.currentUser ? this.renderAdminPanel() : '' }

        <div id="clearingdiv"></div>
    	</div>
    );
    }
	
}

ExperimentsTable.propTypes = {
	experiments: PropTypes.array.isRequired,
};

ExperimentsTable.defaultProps = {
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer(() => {
	Meteor.subscribe('experiments');

  return {
    currentUser: Meteor.user(),
    experiments: Experiments.find({}).fetch()
  };
}, ExperimentsTable);