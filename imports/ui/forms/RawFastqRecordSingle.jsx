// Meteor / React
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
// Third-party modules
import 'moment/locale/en-gb';
// Form validation
import { updateChangedInputs, renderSubmitButton } from './generic.jsx';
// Input half-dumb components (display & client-side validation)
import FilepathTextInput, { handleChangeFilepath, isFilepathValid } from './FilepathTextInput.jsx';
import ReadLengthInput, { handleChangeReadLength, isReadLengthValid } from './ReadLengthInput.jsx';
import SequencerDropdownInput, { handleChangeSequencer, isSequencerValid } from './SequencerDropdownInput.jsx';
import DateInput, { handleChangeDateRun, isDateRunValid } from './DateInput.jsx';

import Loading from '/imports/ui/loading.jsx';

export default class RawFastqRecordSingle extends Component {

	constructor (props) {
		super(props);

		// Database stores dateRun in native Date() format
		let startDate = (props.record.dateRun ? moment(props.record.dateRun) : null);

		this.state = {
			filepath: props.record.filepath, // value of field
			filepathIsInitial: true, // do not show any glyphicon if initial // TODO: remove: if filepath is present in keys(changedInputs) is proof enough
			filepathIsValid: isFilepathValid(props.record.filepath), // for glyphicon & form validation
			filepathCountInDatabase: 0, // for glyphicon & asynchronous form validation, not checked if value is initial

			readLength: props.record.readLength,
			readLengthIsInitial: true,
			readLengthIsValid: isReadLengthValid(props.record.readLength),

			sequencerId: props.record.sequencerId,
			sequencerIdIsInitial: true,
			sequencerIdIsValid: isSequencerValid(props.record.sequencerId),

			dateRun: startDate, // moment()
			dateRunDate: props.record.dateRun, // Date()
			dateRunIsInitial: true,
			dateRunIsValid: isDateRunValid(startDate),

			changedInputs: {},
		}

		this.updateChangedInputs = updateChangedInputs.bind(this);
		this.handleChangeFilepath = handleChangeFilepath.bind(this);
		this.handleChangeReadLength = handleChangeReadLength.bind(this);
		this.handleChangeSequencer = handleChangeSequencer.bind(this);
		this.handleChangeDateRun = handleChangeDateRun.bind(this);
	}

	handleSubmit (event) {
		event.preventDefault();
		if (this.isFormValid()){

			if (this.props.record._id === undefined){
				// console.log('submit new single FASTQ record !');
				Meteor.call(
					'rawFastqs.insertSingleEnd',
					this.state.filepath,
					this.state.readLength,
					this.state.sequencerId,
					this.state.dateRunDate,
					(err, res) => {
						if (err){
							alert(err);
						} else {
							alert('New record added successfully!');
							this.resetForm();
						}
					}
				);
			} else {
				// console.log('update single FASTQ record!');
				// console.log('updateFields: ' + this.state.changedInputs);
				Meteor.call(
					'rawFastqs.updateRecord',
					this.props.record._id,
					this.state.changedInputs,
					(err, res) => {
				  if (err) {
				    alert(err);
				  } else {
				    alert('Record updated successfully!');
				    browserHistory.push('/rawFastq');
				  }
				});
			}

		}
	}

	isFormInitial () {
		// console.log(this.state.changedInputs);
		return(
			Object.keys(this.state.changedInputs).length === 0
		);
	}

	isFormPending () {
		return(
			this.state.filepathCountInDatabase === -1
		);
	}

	isFormComplete () {
		return(
			this.state.filepath !== '' &&
			!isNaN(this.state.readLength) &&
			this.state.sequencerId !== undefined &&
			this.state.dateRunDate !== undefined
		)
	}

	isFormValid (){
		// console.log('filepathIsValid: ' + this.state.filepathIsValid);
		// console.log('readLengthIsValid: ' + this.state.readLengthIsValid);
		// console.log('sequencerIsValid: ' + this.state.sequencerIdIsValid);
		// console.log('dateRunIsValid: ' + this.state.dateRunIsValid);
		return(
			this.state.filepathIsValid &&
			this.state.readLengthIsValid &&
			this.state.sequencerIdIsValid &&
			this.state.dateRunIsValid
		);
	}

	isInDatabase () {
		return(
			this.state.filepathCountInDatabase > 0
		);
	}

	resetForm () {
		this.setState({
			filepath: '',
			filepathIsInitial: true,
			filepathIsValid: false,
			filepathCountInDatabase: 0,

			readLength: NaN,
			readLengthIsInitial: true,
			readLengthIsValid: false,

			sequencerId: null,
			sequencerIdIsInitial: true,
			sequencerIdIsValid: false,

			dateRun: null,
			dateRunDate: null,
			dateRunIsInitial: true,
			dateRunIsValid: false,

			changedInputs: {},
		})
	}

	render () {
		// console.log(this.state);
		// console.log('render: ' + this.state.filepath);
		return(
			<form onSubmit={this.handleSubmit.bind(this)} >
				<table className='table raw-fastq-record-table'>
	      	<thead>
	      		<tr>
	      			<th className='fastq-table-field'>Field</th>
	      			<th className='fastq-table-value'>Value</th>
	      			<th className='fastq-table-check'>Check</th>
	      		</tr>
	      	</thead>
	      	<tbody>
						<FilepathTextInput
							id='filepath'
							label='File path'
							placeholder='Path to FASTQ file'

							value={this.state.filepath}

							isInitial={this.state.filepathIsInitial}
							isValid={this.state.filepathIsValid}
							countInDatabase={this.state.filepathCountInDatabase}

							onChange={this.handleChangeFilepath}
						/>
						<ReadLengthInput
							id='readLength'
							label='Read length'

							value={this.state.readLength}

							isInitial={this.state.readLengthIsInitial}
							isValid={this.state.readLengthIsValid}

							onChange={this.handleChangeReadLength}
						/>
						<SequencerDropdownInput
							id='sequencerId'
							label='Sequencer'

							value={this.state.sequencerId}

							isInitial={this.state.sequencerIdIsInitial}
							isValid={this.state.sequencerIdIsValid}

							onChange={this.handleChangeSequencer}
						/>
						<DateInput
							id='dateRun'
							label='Date run'

							value={this.state.dateRun}

							isInitial={this.state.dateRunIsInitial}
							isValid={this.state.dateRunIsValid}

							onChange={this.handleChangeDateRun}
						/>
					</tbody>
	      </table>
	      {renderSubmitButton(this.isFormInitial(), this.isFormComplete(), this.isFormValid(), this.isFormPending(), this.isInDatabase())}
			</form>
		);
	}

}

RawFastqRecordSingle.propTypes = {
	record: PropTypes.object,
};

RawFastqRecordSingle.defaultProps = {
	record: {
		_id: undefined,
		filepath: '',
		readLength: NaN,
		sequencerId: undefined,
		dateRun: undefined,
	}
};
