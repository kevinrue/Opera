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
import FilepathTextInput, { handleChangeFilepath, isFilepathValid, autocompleteFilepaths, autofillSecond } from './FilepathTextInput.jsx';
import ReadLengthInput, { handleChangeReadLength, isReadLengthValid } from './ReadLengthInput.jsx';
import SequencerDropdownInput, { handleChangeSequencer, isSequencerValid } from './SequencerDropdownInput.jsx';
import DateInput, { handleChangeDateRun, isDateRunValid } from './DateInput.jsx';

import Loading from '/imports/ui/loading.jsx'

export default class RawFastqRecordPaired extends Component {

	constructor (props) {
		super(props);

		// Database stores dateRun in native Date() format
		let startDate = (props.record.dateRun ? moment(props.record.dateRun) : null);

		this.state = {
			file1: props.record.file1, // value of field
			file1IsInitial: true, // do not show any glyphicon if initial
			file1IsValid: isFilepathValid(props.record.file1), // for glyphicon & form validation
			file1CountInDatabase: 0, // for glyphicon & asynchronous form validation, not checked if value is initial

			file2: props.record.file2,
			file2IsInitial: true,
			file2IsValid: isFilepathValid(props.record.file2),
			file2CountInDatabase: 0,

			readLength: props.record.readLength,
			readLengthIsInitial: true,
			readLengthIsValid: isReadLengthValid(props.record.readLength),

			sequencerId: props.record.sequencerId,
			sequencerIdIsInitial: true,
			sequencerIdIsValid: isSequencerValid(props.record.sequencerId),

			dateRun: startDate, // moment
			dateRunDate: props.record.dateRun,
			dateRunIsInitial: true,
			dateRunIsValid: isDateRunValid(startDate),

			changedInputs: {},
		}

		this.updateChangedInputs = updateChangedInputs.bind(this);
		this.handleChangeFilepath = handleChangeFilepath.bind(this);
		this.handleChangeReadLength = handleChangeReadLength.bind(this);
		this.handleChangeSequencer = handleChangeSequencer.bind(this);
		this.handleChangeDateRun = handleChangeDateRun.bind(this);

		this.handleAutocompleteButton = autocompleteFilepaths.bind(this);
		this.handleAutofillButton = autofillSecond.bind(this);
	}

	isFormInitial () {
		// console.log('#attributes: ' + Object.keys(this.state.changedInputs).length);
		return(
			Object.keys(this.state.changedInputs).length === 0
		);
	}

	isFormPending () {
		return(
			this.state.file1CountInDatabase === -1 ||
			this.state.file2Initial === -1
		);
	}

	isFormComplete () {
		return(
			this.state.file1 !== '' &&
			this.state.file2 !== '' &&
			!isNaN(this.state.readLength) &&
			this.state.sequencerId !== undefined &&
			this.state.dateRunDate !== undefined
		)
	}

	isFormValid (){
		// console.log('file1Valid: ' + this.state.file1Valid);
		// console.log('file2Valid: ' + this.state.file2Valid);
		// console.log('readLengthValid: ' + this.state.readLengthValid);
		// console.log('sequencerIdIsValid: ' + this.state.sequencerIdIsValid);
		// console.log('dateRunValid: ' + this.state.dateRunValid);
		return(
			this.state.file1IsValid &&
			this.state.file2IsValid &&
			this.state.readLengthIsValid &&
			this.state.sequencerIdIsValid &&
			this.state.dateRunIsValid
		);
	}

	isInDatabase () {
		return(
			this.state.file1CountInDatabase > 0 ||
			this.state.file2CountInDatabase > 0
		);
	}

	handleSubmit (event) {
		event.preventDefault();
		if (this.isFormValid()){
			
			if (this.props.record._id === undefined){
				// console.log('submit new paired FASTQ record !');
				Meteor.call(
					'rawFastqs.insertPairedEnd',
					this.state.file1,
					this.state.file2,
					parseInt(this.state.readLength),
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
				// console.log('update paired FASTQ record !');
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

	resetForm () {
		this.setState({
			file1: '',
			file1IsInitial: true,
			file1IsValid: false,
			file1CountInDatabase: 0,

			file2: '',
			file2IsInitial: true,
			file2IsValid: false,
			file2CountInDatabase: 0,

			readLength: NaN,
			readLengthIsInitial: true,
			readLengthIsValid: false,

			sequencerId: undefined,
			sequencerIdIsInitial: true,
			sequencerIdIsValid: false,

			dateRun: undefined,
			dateRunDate: undefined,
			dateRunIsInitial: true,
			dateRunIsValid: false,

			changedInputs: {},
		})
	}

	render () {
		// console.log(this.state);

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
							id='file1'
							label='First mate'
							placeholder='Path to FASTQ file of file1 mate'

							value={this.state.file1}

							isInitial={this.state.file1IsInitial}
							isValid={this.state.file1IsValid}
							countInDatabase={this.state.file1CountInDatabase}

							onChange={this.handleChangeFilepath}
						/>
						<FilepathTextInput
							id='file2'
							label='Second mate'
							placeholder='Path to FASTQ file of file2 mate'

							value={this.state.file2}

							isInitial={this.state.file2IsInitial}
							isValid={this.state.file2IsValid}
							countInDatabase={this.state.file2CountInDatabase}

							onChange={this.handleChangeFilepath}

							displayDropdown={(this.state.file1 !== '' && this.state.file2 === '')}
							pairedFirst='file1'
							onAutocomplete={this.handleAutocompleteButton}
							onAutofill={this.handleAutofillButton}
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

RawFastqRecordPaired.propTypes = {
	record: PropTypes.object,
};

RawFastqRecordPaired.defaultProps = {
	record: {
		_id: undefined,
		file1: '',
		file2: '',
		readLength: NaN,
		sequencerId: undefined,
		dateRun: undefined,
	}
};
