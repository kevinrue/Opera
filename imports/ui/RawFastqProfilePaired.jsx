import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Button } from 'react-bootstrap';

import { RawFastqRecords } from '../api/raw-fastq-records.js';

let classNames = require('classnames');

class RawFastqRecordPaired extends Component {

	constructor (props) {
		super(props);
		this.state = {
			first: props.record.first,
			second: props.record.second,
		}
	}

	updateFirst (event) {
		// console.log('new value: ' + event.target.value);
		this.setState({
			first: event.target.value
		});
	}

	updateSecond (event) {
		// console.log('new value: ' + event.target.value);
		this.setState({
			second: event.target.value
		});
	}

	handleSubmit (event) {
		event.preventDefault();
		console.log('rawFastqProfilePairedSubmit !');
	}

	render () {
		// console.log(this.props);

		let firstClass = classNames({
			'filepath-input': true,
      'text-edited': this.state.first !== this.props.record.first
    });
    let secondClass = classNames({
			'filepath-input': true,
      'text-edited': this.state.second !== this.props.record.second
    });

		return(
			<form className="rawFastq-single" onSubmit={this.handleSubmit.bind(this)} >
				<table className='table raw-fastq-record-table'>
      	<thead>
      		<tr>
      			<th className='profile-field-col'>Field</th>
      			<th className='profile-field-value'>Value</th>
      		</tr>
      	</thead>
      	<tbody>
      		<tr>
      			<td>
      				<label htmlFor="firstPath">First mate</label>
      			</td>
      			<td>
      				<input
							className={firstClass}
							id="firstPath"
		          type="text"
		          ref="inputFirst"
		          placeholder="Path to first FASTQ file"
		          value={this.state.first}
		          onChange={this.updateFirst.bind(this)}/>
		        </td>
      		</tr>
      		<tr>
      			<td>
      				<label htmlFor="secondPath">Second mate</label>
      			</td>
      			<td>
      				<input
								className={secondClass}
								id="secondPath"
			          type="text"
			          ref="inputSecond"
			          placeholder="Path to second FASTQ file"
			          value={this.state.second}
			          onChange={this.updateSecond.bind(this)}
			        />
		        </td>
      		</tr>
      	</tbody>
      </table>
       <Button type="submit" bsStyle="danger">Danger</Button>
			</form>
		);
	}

}

RawFastqRecordPaired.propTypes = {
	record: PropTypes.object.isRequired,
};

RawFastqRecordPaired.defaultProps = {
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer((  ) => {
	return {
	};
}, RawFastqRecordPaired);
