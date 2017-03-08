import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';

import { ButtonToolbar, Button } from 'react-bootstrap';

import { RawFastqRecords } from '../api/raw-fastq-records.js';

import Loading from './loading.jsx'

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class RawFastqRecordsInfo extends Component {

	constructor (props) {
		super(props);
	}

  goToAddRawFastqOne() {
    browserHistory.push('/rawFastq/addOne');
  }

	goToAddRawFastqBatch() {
    browserHistory.push('/rawFastq/addBatch');
  }

  renderOverview(){
  	return(
  		<div>
				<p>There are {this.props.rawFastqAllCount} records in the database.</p>

				<ul>
					<li>Paired-end records: {this.props.rawFastqPairedCount}.</li>
					<li>Single-end records: {this.props.rawFastqSingleCount}.</li>
				</ul>
			</div>
  	);
  }

  recordLinkFormat(cell, row) {
    const link = <a href={"/rawFastq/" + cell}>{cell}</a>;
    return link;
	}

  renderRecordTable() {
  	return(
  		<BootstrapTable data={this.props.rawFastqAll} striped={true} hover={true} pagination={true}>
	      <TableHeaderColumn dataField="_id" dataFormat={ this.recordLinkFormat } isKey={true} dataAlign="center" width="20%">
	      ID</TableHeaderColumn>
	      <TableHeaderColumn dataField="paired" dataAlign="center" width="80%"
	      	filter={ { type: 'SelectFilter', options: {true, false} } }>
	      	Paired</TableHeaderColumn>
		  </BootstrapTable>
		 );
  }

  renderMainPanel() {
  	return(
  		<div className='main-panel'>
  			<header><h1>Raw FASTQ</h1></header>
  			
  			<header><h2>Overview</h2></header>

				{ this.props.loading ? <Loading /> : this.renderOverview() }

				<header><h2>Complete list</h2></header>

				{ this.props.loading ? <Loading /> : this.renderRecordTable() }

			</div>
  	);
  }

  renderAdminPanel() {
  	return(
  		<div className='admin-panel'>
  			<h3>Admin panel</h3>
	      	<Button bsStyle="link" onClick={this.goToAddRawFastqOne.bind(this)}>Add single</Button><br/>
	        <Button bsStyle="link" onClick={this.goToAddRawFastqBatch.bind(this)}>Add batch</Button>
	    </div>
    );
  }

	render() {
		return(
			<div>

				{ this.renderMainPanel() }

				{ this.props.currentUser ? this.renderAdminPanel() : '' }

				<div id="clearingdiv"></div>

			</div>
		);
	}

}

RawFastqRecordsInfo.propTypes = {
	rawFastqAllCount: PropTypes.number,
	rawFastqPairedCount: PropTypes.number,
	rawFastqSingleCount: PropTypes.number,
	rawFastqSampleSingleRecord: PropTypes.object,
	rawFastqSamplePairedRecord: PropTypes.object,
};

RawFastqRecordsInfo.defaultProps = {
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer(() => {
	const subscription = Meteor.subscribe('rawFastqRecords');
	const loading = !subscription.ready();

	return {
		currentUser: Meteor.user(),
		loading: loading,
		rawFastqAllCount: RawFastqRecords.find({}).count(),
		rawFastqPairedCount: RawFastqRecords.find({paired : true}).count(),
		rawFastqSingleCount: RawFastqRecords.find({paired : false}).count(),
		rawFastqSampleSingleRecord: RawFastqRecords.findOne({paired : false}),
		rawFastqSamplePairedRecord: RawFastqRecords.findOne({paired : true}),
		rawFastqAll: RawFastqRecords.find({}, {_id: 1, paired: 1}).fetch(),
	};
}, RawFastqRecordsInfo);
