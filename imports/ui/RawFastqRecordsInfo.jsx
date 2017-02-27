import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { RawFastqRecords } from '../api/raw-fastq-records.js';

class RawFastqRecordsInfo extends Component {

	constructor (props) {
		super(props);
	}

	render () {
		return(
			<div>
				<header><h2>Overview</h2></header>
				<p>
					<strong>Note:</strong> Although misleading, this component
					demonstrates how the publication/subscription system implemented by MeteorJS
					refuses to publish information to unauthenticated users.
				</p>
				<p>There are {this.props.rawFastqAllCount} records in the database.</p>
				<ul>
					<li>Paired-end records: {this.props.rawFastqPairedCount}.</li>
					<li>Single-end records: {this.props.rawFastqSingleCount}.</li>
				</ul>
			</div>
		);
	}

}

RawFastqRecordsInfo.propTypes = {
	rawFastqAllCount: PropTypes.number.isRequired,
	rawFastqPairedCount: PropTypes.number.isRequired,
	rawFastqSingleCount: PropTypes.number.isRequired,
};

RawFastqRecordsInfo.defaultProps = {
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer(() => {
	Meteor.subscribe('rawFastqRecords');

	return {
		rawFastqAllCount: RawFastqRecords.find({}).count(),
		rawFastqPairedCount: RawFastqRecords.find({paired : true}).count(),
		rawFastqSingleCount: RawFastqRecords.find({paired : false}).count()
	};
}, RawFastqRecordsInfo);
