import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data'; // 

import { browserHistory } from 'react-router';

import { ButtonToolbar, Button } from 'react-bootstrap';

import { Experiments } from '../api/experiments.js';

let DataGrid = require('react-datagrid')

class ExperimentsTable extends Component {

	getDataGridColumns() {
    return [
      { name: '_id', width: '5%' },
      { name: 'name', width: '85%' }, // Note: the first letter of the 'name' field is automatically capitalised
      { name: 'Nsamples', title: 'Samples', width: '10%' }
    ]
  }

	renderExperiments() {
		return (
		  <DataGrid
		    idProperty='id'
		    dataSource={this.props.experiments}
		    columns={this.getDataGridColumns()}
		    style={{
		      height: 200,
		       width:'90%',
		       marginLeft:'5%',
		       marginRight:'5%'
		     }}
		     withColumnMenu={false}

		  />
		);
  }

  goToAddExperiment() {;
    browserHistory.push('/experiments/add');
  }

  goToRemoveExperiment() {;
    browserHistory.push('/experiments/remove');
  }

	render() {
    return (
    	<div>
	    	<header>
	          <h1>Experiment List</h1>
        </header>

        <p>
          This component renders a <code>DataGrid</code> defined in
            the <a href="https://www.npmjs.com/package/react-datagrid">
            <code>react-datagrid</code>
          </a> module.
        </p>
        <p>
          The grid is set to occupy 200 pixels in height, and
          the central 90% of the browser window's width with
          5% margin of either side.
        </p>
        {this.renderExperiments()}
        { this.props.currentUser ?
          <div>
            <header><h1>Admin panel</h1></header>
            <ButtonToolbar>
              <Button bsStyle="link" onClick={this.goToAddExperiment.bind(this)}>Add experiment</Button>
              <Button bsStyle="link" onClick={this.goToRemoveExperiment.bind(this)}>Remove experiment</Button>
            </ButtonToolbar>
          </div> : ''
        }
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