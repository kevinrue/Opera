import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Button } from 'react-bootstrap';

import { RawFastqRecords } from '../api/raw-fastq-records.js';

let classNames = require('classnames');

class RawFastqRecordSingle extends Component {

	constructor (props) {
		super(props);
		this.state = {
			filepath: props.record.filepath,
		}
	}

	updateFilepath (event) {
		// console.log('new value: ' + event.target.value);
		this.setState({
			filepath: event.target.value
		});
	}

	handleSubmit (event){
		event.preventDefault();
	}

	render () {
		// console.log(this.props);

		let filepathClass = classNames({
			'input-file-path': true,
      'input-edited': this.state.filepath !== this.props.record.filepath
    });

		return(
			<form className="rawFastq-profile-form" onSubmit={this.handleSubmit.bind(this)} >
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
      				<label htmlFor="inputFilepath">Filepath</label>
      			</td>
      			<td>
      				<input
								className={filepathClass}
								id="fpath"
			          type="text"
			          ref="inputFilepath"
			          placeholder="Path to FASTQ file"
			          value={this.state.filepath}
			          onChange={this.updateFilepath.bind(this)}
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

RawFastqRecordSingle.propTypes = {
	record: PropTypes.object.isRequired,
};

RawFastqRecordSingle.defaultProps = {
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer((  ) => {
	return {
	};
}, RawFastqRecordSingle);
