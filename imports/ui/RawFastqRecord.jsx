import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { RawFastqRecords } from '../api/raw-fastq-records/raw-fastq-records.js';

import RawFastqRecordSingle from './RawFastqRecordSingle.jsx';
import RawFastqRecordPaired from './RawFastqRecordPaired.jsx';

import Loading from './loading.jsx'

class RawFastqRecord extends Component {

	constructor (props) {
		super(props);
	}

	renderRecord (){
		return(
			this.props.record ?
				<table className='table raw-fastq-record-table'>
      	<thead>
      		<tr>
      			<th>Field</th><th>Value</th>
      		</tr>
      	</thead>
      	<tbody>
      		<tr><td>Identifier</td><td>{this.props.record._id}</td></tr>
      		<tr><td>Paired</td><td>{this.props.record.paired ? 'Yes' : 'No'}</td></tr>
      		{ this.props.record.paired ?
      			<tr><td>First<br/>Second</td><td>{this.props.record.first}<br/>{this.props.record.second}</td></tr>:
      			<tr><td>Filepath</td><td>{this.props.record.filepath}</td></tr>
      		}
      	</tbody>
      </table> :
      <p className='record-not-found'>This address does not match any raw FASTQ record.</p>
		)
	}

	renderForm() {
		return(
			this.props.record.paired ?
				<RawFastqRecordPaired record={this.props.record} /> :
				<RawFastqRecordSingle record={this.props.record} />
		);
	}

	render () {
		return(
			<div>
				<header><h1>Raw FASTQ</h1></header>
				<header><h2>Single record</h2></header>

				{ this.props.loading ? <Loading /> : this.renderForm() }				

			</div>
		);
	}

}

RawFastqRecord.propTypes = {
	record: PropTypes.object,
};

RawFastqRecord.defaultProps = {

};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer(( id ) => {
	const subscription = Meteor.subscribe('rawFastqRecords');
	const loading = !subscription.ready();
	const record = RawFastqRecords.findOne(id.params);

	return {
		currentUser: Meteor.user(),
		record: record,
		loading: loading,
	};
}, RawFastqRecord);
