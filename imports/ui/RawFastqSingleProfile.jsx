import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Button } from 'react-bootstrap';

import { RawFastqRecords } from '../api/raw-fastq-records.js';

class RawFastqRecordSingle extends Component {

	constructor (props) {
		super(props);
		console.log(props);
		this.state = {
			record: props.record,
		}
	}

	handleSubmit (){
		event.preventDefault();
	}

	render () {
		return(
			<div>
				<header><h1>Raw FASTQ</h1></header>
				<header><h2>Single record</h2></header>

				<form className="rawFastq-single" onSubmit={this.handleSubmit.bind(this)} >
						<input
              type="text"
              ref="filepath"
              placeholder="Path to FASTQ file"
              value={this.state.record}
            />
            <br/>
            <Button type="submit" bsStyle="danger">Danger</Button>
				</form>
			</div>
		);
	}

}

RawFastqRecordSingle.propTypes = {
	record: PropTypes.object,
};

RawFastqRecordSingle.defaultProps = {

};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer(( id ) => {
	Meteor.subscribe('rawFastqRecords');

	return {
		currentUser: Meteor.user(),
		record: RawFastqRecords.findOne(id.params),
	};
}, RawFastqRecordSingle);
