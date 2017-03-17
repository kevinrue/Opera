import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { Platforms } from '/imports/api/platforms.js';
// Relative paths assume that /pages sits beside /forms
import AddPlatformForm from '../forms/AddPlatformForm.jsx';

import Loading from '/imports/ui/Loading.jsx'

class PlatformsTablePage extends Component {

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
				<AddPlatformForm
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
    	<div id='page'>
        { this.renderMainPanel() }

        { this.props.currentUser ? this.renderAdminPanel() : '' }

        <div id="clearingdiv"></div>
    	</div>
    );
  }

}

PlatformsTablePage.propTypes = {
	platforms: PropTypes.array,
};

PlatformsTablePage.defaultProps = {
};

export default createContainer(() => {
	const subscription = Meteor.subscribe('platforms');
	const loading = !subscription.ready();

	return {
		currentUser: Meteor.user(),
		platforms: Platforms.find({}).fetch(),
		loading: loading,
	};
}, PlatformsTablePage);
