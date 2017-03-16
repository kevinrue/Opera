import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import Loading from './loading.jsx'

import { Platforms } from '../api/platforms.js';

import AddSequencerForm from './AddSequencerForm.jsx';

class PlatformsTable extends Component {

	constructor (props) {
		super(props);
	}

	renderTable () {
		// console.log('renderTable');
		return(
			<BootstrapTable data={this.props.platforms} striped={true} hover={true} keyField='_id' pagination={true}>
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
		// console.log(this.props.platforms);
		// console.log(typeof(this.props.platforms));
		// console.log(Array.isArray(this.props.platforms));
		// Pass name of platforms (_id not necessary)
		let arrayNames = this.props.platforms.map((platform) => (platform.name));
		// console.log('arrayNames: ' + arrayNames);
  // 	console.log('nameTypes: ' + typeof(arrayNames));
		return(
			<div>
				<header><h2>Add</h2></header>
				<AddSequencerForm
					platforms={arrayNames}
				/>
			</div>
		);
	}

	renderMainPanel() {
    return(
      <div className='main-panel'>
        <header><h1>Platforms</h1></header>
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

PlatformsTable.propTypes = {
	platforms: PropTypes.array,
};

PlatformsTable.defaultProps = {
};

export default createContainer(() => {
	const subscription = Meteor.subscribe('platforms');
	const loading = !subscription.ready();

	return {
		currentUser: Meteor.user(),
		platforms: Platforms.find({}).fetch(),
		loading: loading,
	};
}, PlatformsTable);
