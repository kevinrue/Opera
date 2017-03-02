import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';

import { ButtonToolbar, Button } from 'react-bootstrap';

import { RawFastqRecords } from '../api/raw-fastq-records.js';

class RawFastqRecordsInfo extends Component {

	constructor (props) {
		super(props);
	}

	goToAddRawFastq() {
    browserHistory.push('/rawFastq/add');
  }

	render () {
		return(
			<div>
				<header><h1>Raw FASTQ</h1></header>

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

				<header><h2>Sample</h2></header>

					{ this.props.rawFastqSampleSingleRecord ?
						<p>
							This <a href={"/rawFastq/" + this.props.rawFastqSampleSingleRecord._id}>link</a> leads
							to a sample raw FASTQ <em>single-end</em> record.
						</p> : <p>Loading...</p>
					}

				{ this.props.currentUser ?
	          <div>
	            <header><h2>Admin panel</h2></header>
	            <ButtonToolbar>
	              <Button bsStyle="link" onClick={this.goToAddRawFastq.bind(this)}>Add raw FASTQ</Button>
	            </ButtonToolbar>
	          </div> : ''
	        }

			</div>
		);
	}

}

RawFastqRecordsInfo.propTypes = {
	rawFastqAllCount: PropTypes.number.isRequired,
	rawFastqPairedCount: PropTypes.number.isRequired,
	rawFastqSingleCount: PropTypes.number.isRequired,
	rawFastqSampleSingleRecord: PropTypes.object.isRequired,
};

RawFastqRecordsInfo.defaultProps = {
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer(() => {
	Meteor.subscribe('rawFastqRecords');
	Meteor.subscribe('experiments');

	return {
		currentUser: Meteor.user(),
		rawFastqAllCount: RawFastqRecords.find({}).count(),
		rawFastqPairedCount: RawFastqRecords.find({paired : true}).count(),
		rawFastqSingleCount: RawFastqRecords.find({paired : false}).count(),
		rawFastqSampleSingleRecord: RawFastqRecords.findOne({paired : false}),
	};
}, RawFastqRecordsInfo);
