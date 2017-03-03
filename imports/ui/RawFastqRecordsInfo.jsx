import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';

import { ButtonToolbar, Button } from 'react-bootstrap';

import { RawFastqRecords } from '../api/raw-fastq-records.js';

import Loading from './loading.jsx'
let DataGrid = require('react-datagrid')

class RawFastqRecordsInfo extends Component {

	constructor (props) {
		super(props);
	}

	goToAddRawFastq() {
    browserHistory.push('/rawFastq/add');
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

  renderSampleLinks() {
  	return(
  		<div>
  			<p>
					Sample <em>single-end</em> record: { this.props.rawFastqSampleSingleRecord ?
						<a href={"/rawFastq/" + this.props.rawFastqSampleSingleRecord._id}>single</a> : 'Loading...'
					}
				</p>

				<p>
					Sample <em>paired-end</em> record: { this.props.rawFastqSamplePairedRecord ?
						<a href={"/rawFastq/" + this.props.rawFastqSamplePairedRecord._id}>paired</a> : 'Loading...'
					}
				</p>
  		</div>
  	);
  }

  renderAdminPanel() {
  	return(
  		<div>
	      <header><h2>Admin panel</h2></header>
	      <ButtonToolbar>
	        <Button bsStyle="link" onClick={this.goToAddRawFastq.bind(this)}>Add raw FASTQ</Button>
	      </ButtonToolbar>
	    </div>
    );
  }

  getDataGridColumns() {
  	return [
      { name: '_id' },
    ]
  }

  renderRecordTable() {
  	console.log(this.props.rawFastqAllIdentifiers[0]);

  	return(
  		<DataGrid
		    idProperty='id'
		    dataSource={this.props.rawFastqAllIdentifiers}
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

  renderPage() {
  	return(
  		<div>
  			<header><h2>Overview</h2></header>

				{ this.props.loading ? <Loading /> : this.renderOverview() }

				<header><h2>Sample</h2></header>

				{ this.props.loading ? <Loading /> : this.renderSampleLinks() }

				<header><h2>Table of raw FASTQ records</h2></header>

				{ this.props.loading ? <Loading /> : this.renderRecordTable() }

				{ this.props.currentUser ? this.renderAdminPanel() : '' }

			</div>
  	);
  }

	render() {
		return(
			<div>
				<header><h1>Raw FASTQ</h1></header>

				{ this.renderPage() }

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
		rawFastqAllIdentifiers: RawFastqRecords.find({paired: true}, {_id: 1}).fetch(),
	};
}, RawFastqRecordsInfo);
