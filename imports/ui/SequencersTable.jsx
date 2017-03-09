import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import Loading from './loading.jsx'

import { Sequencers } from '../api/sequencers.js';

class SequencersTable extends Component {

	constructor (props) {
		super(props);
		// this.state = {
		// 	paired: true
		// };
	}

	renderTable () {
		return(
			<BootstrapTable data={this.props.sequencers} striped={true} hover={true} keyField='_id'>
        <TableHeaderColumn
        	dataField="label"
        	dataAlign="center"
        	width="60%"
        	dataSort={true}>
        	Label
        </TableHeaderColumn>
        <TableHeaderColumn
	        dataField="value"
	        dataAlign="center"
	        width="40%">
          Database value
        </TableHeaderColumn>
      </BootstrapTable>
    );
	}

	renderMainPanel() {
    return(
      <div className='main-panel'>
        <header><h1>Sequencers</h1></header>
        { this.props.loading ? <Loading /> : this.renderTable() }
      </div>
    );
  }

	renderAdminPanel() {
    return(
      <div className='admin-panel'>
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

SequencersTable.propTypes = {
};

SequencersTable.defaultProps = {
};

export default createContainer(() => {
	const subscription = Meteor.subscribe('sequencers');
	const loading = !subscription.ready();

	return {
	sequencers: Sequencers.find({}).fetch(),
	loading: loading,
	};
}, SequencersTable);
