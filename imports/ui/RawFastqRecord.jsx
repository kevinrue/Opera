import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { RawFastqRecords } from '../api/raw-fastq-records.js';

class RawFastqRecord extends Component {

	constructor (props) {
		super(props);
	}

	render () {
		return(
			<div>
				<header><h1>Raw FASTQ</h1></header>
				<header><h2>Single record</h2></header>
				
				{ this.props.record ?
	          <div>
	            <table className='table raw-fastq-record-table'>
	            	<thead>
	            		<tr>
	            			<th>Key</th><th>Value</th>
	            		</tr>
	            	</thead>
	            	<tbody>
	            		<tr><td>Field</td><td>{this.props.record._id}</td></tr>
	            		<tr><td>Paired</td><td>{this.props.record.paired ? 'Yes' : 'No'}</td></tr>
	            		<tr><td>Filepath</td><td>{this.props.record.filepath}</td></tr>
	            	</tbody>
	            </table>
	          </div> : <p style={{textAlign:'center'}}>This record does not exist.</p>
	        }
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
	Meteor.subscribe('rawFastqRecords');

	return {
		currentUser: Meteor.user(),
		record: RawFastqRecords.findOne(id.params),
	};
}, RawFastqRecord);
