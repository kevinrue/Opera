import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import Loading from './loading.jsx'

import { Sequencers } from '../api/sequencers.js';

import AddSequencerForm from './AddSequencerForm.jsx';

class SequencersTable extends Component {

	constructor (props) {
		super(props);
	}

	renderTable () {
		// console.log('renderTable');
		return(
			<BootstrapTable data={this.props.sequencers} striped={true} hover={true} keyField='_id' pagination={true}>
        <TableHeaderColumn
        	dataField="name"
        	dataAlign="left"
        	dataSort={true}>
        	Name
        </TableHeaderColumn>
      </BootstrapTable>
    );
	}

	renderAddForm () {
		// console.log(this.props);
		// console.log(this.props.sequencers);
		// console.log(typeof(this.props.sequencers));
		// console.log(Array.isArray(this.props.sequencers));
		// Pass name of sequencers (_id not necessary)
		let arrayNames = this.props.sequencers.map((sequencer) => (sequencer.name));
		// console.log('arrayNames: ' + arrayNames);
  // 	console.log('nameTypes: ' + typeof(arrayNames));
		return(
			<div>
				<header><h2>Add</h2></header>
				<AddSequencerForm
					sequencers={arrayNames}
				/>
			</div>
		);
	}

	renderMainPanel() {
    return(
      <div className='main-panel'>
        <header><h1>Sequencers</h1></header>
        <header><h2>Table</h2></header>
        { this.renderTable() }
        { this.props.loading ? <Loading /> : this.renderAddForm() }
      </div>
    );
  }

	renderAdminPanel() {
		// console.log('renderAdminPanel');
    return(
      <div className='admin-panel'>
      </div>
    );
  }

	render() {
		// console.log(this.props.currentUser);
    return (
    	<div>
        { this.renderMainPanel() }

        { this.props.currentUser ? this.renderAdminPanel() : '' }

        <div id="clearingdiv"></div>
    	</div>
    );
  }

}

SequencersTable.propTypes = {
	sequencers: PropTypes.array,
};

SequencersTable.defaultProps = {
};

export default createContainer(() => {
	const subscription = Meteor.subscribe('sequencers');
	const loading = !subscription.ready();

	return {
		currentUser: Meteor.user(),
		sequencers: Sequencers.find({}).fetch(),
		loading: loading,
	};
}, SequencersTable);
