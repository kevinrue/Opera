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
import RawFastqFileInput, { handleChangeFastqPath, isFastqPathValid, autocompleteFilepaths, autofillSecond } from './RawFastqFileInput.jsx';
import ReadLengthInput, { handleChangeReadLength, isReadLengthValid } from './ReadLengthInput.jsx';
import PlatformDropdownInput, { handleChangePlatform, isPlatformValid } from './PlatformDropdownInput.jsx';
import DateInput, { handleChangeDateRun, isDateRunValid } from './DateInput.jsx';
import SimpleTextInput, { handleChangeTextInput, isRunValid, isLaneValid } from './SimpleTextInput.jsx';

import Loading from '/imports/ui/loading.jsx'

export default class RawFastqRecordPaired extends Component {

	constructor (props) {
		super(props);

		// Database stores dateRun in native Date() format
		let startDate = (props.record.dateRun ? moment(props.record.dateRun) : null);

		this.state = {
			file1: props.record.file1, // value of field
			file1IsInitial: true, // do not show any glyphicon if initial
			file1IsValid: isFastqPathValid(props.record.file1), // for glyphicon & form validation
			file1CountInDatabase: 0, // for glyphicon & asynchronous form validation, not checked if value is initial

			file2: props.record.file2,
			file2IsInitial: true,
			file2IsValid: isFastqPathValid(props.record.file2),
			file2CountInDatabase: 0,

			readLength: props.record.readLength,
			readLengthIsInitial: true,
			readLengthIsValid: isReadLengthValid(props.record.readLength),

			platformId: props.record.platformId,
			platformIdIsInitial: true,
			platformIdIsValid: isPlatformValid(props.record.platformId),

			dateRun: startDate, // moment
			dateRunDate: props.record.dateRun,
			dateRunIsInitial: true,
			dateRunIsValid: isDateRunValid(startDate),

			run: props.record.run,
			runIsInitial: true,
			runIsValid: isRunValid(props.record.run),

			lane: props.record.lane,			
			laneIsInitial: true,
			laneIsValid: isLaneValid(startDate),

			changedInputs: {},
		}

		this.updateChangedInputs = updateChangedInputs.bind(this);

		this.handleChangeFastqPath = handleChangeFastqPath.bind(this);
		this.handleChangeReadLength = handleChangeReadLength.bind(this);
		this.handleChangePlatform = handleChangePlatform.bind(this);
		this.handleChangeDateRun = handleChangeDateRun.bind(this);
		this.handleChangeTextInput = handleChangeTextInput.bind(this);

		this.handleAutocompleteButton = autocompleteFilepaths.bind(this);
		this.handleAutofillButton = autofillSecond.bind(this);

		this.isLaneValid = isLaneValid.bind(this);
		this.isRunValid = isRunValid.bind(this);
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
			this.state.platformId !== undefined &&
			this.state.dateRunDate !== undefined &&
			this.state.run !== '' &&
			this.state.lane !== ''
		)
	}

	isFormValid (){
		// console.log('file1Valid: ' + this.state.file1Valid);
		// console.log('file2Valid: ' + this.state.file2Valid);
		// console.log('readLengthValid: ' + this.state.readLengthValid);
		// console.log('platformIdIsValid: ' + this.state.platformIdIsValid);
		// console.log('dateRunValid: ' + this.state.dateRunValid);
		return(
			this.state.file1IsValid &&
			this.state.file2IsValid &&
			this.state.readLengthIsValid &&
			this.state.platformIdIsValid &&
			this.state.dateRunIsValid &&
			this.state.runIsValid &&
			this.state.laneIsValid
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
					this.state.platformId,
					this.state.dateRunDate,
					this.state.run,
					this.state.lane,
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

			platformId: undefined,
			platformIdIsInitial: true,
			platformIdIsValid: false,

			dateRun: undefined,
			dateRunDate: undefined,
			dateRunIsInitial: true,
			dateRunIsValid: false,

			run: '',
			runIsInitial: true,
			runIsValid: false,

			lane: '',
			laneIsInitial: true,
			laneIsValid: false,

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
						<RawFastqFileInput
							id='file1'
							label='First mate'
							placeholder='Path to FASTQ file of file1 mate'

							value={this.state.file1}

							isInitial={this.state.file1IsInitial}
							isValid={this.state.file1IsValid}
							countInDatabase={this.state.file1CountInDatabase}

							onChange={this.handleChangeFastqPath}
						/>
						<RawFastqFileInput
							id='file2'
							label='Second mate'
							placeholder='Path to FASTQ file of file2 mate'

							value={this.state.file2}

							isInitial={this.state.file2IsInitial}
							isValid={this.state.file2IsValid}
							countInDatabase={this.state.file2CountInDatabase}

							onChange={this.handleChangeFastqPath}

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
						<PlatformDropdownInput
							id='platformId'
							label='Platform'

							value={this.state.platformId}

							isInitial={this.state.platformIdIsInitial}
							isValid={this.state.platformIdIsValid}

							onChange={this.handleChangePlatform}
						/>
						<DateInput
							id='dateRun'
							label='Date run'

							value={this.state.dateRun}

							isInitial={this.state.dateRunIsInitial}
							isValid={this.state.dateRunIsValid}

							onChange={this.handleChangeDateRun}
						/>
						<SimpleTextInput
							id='run'
							label='Run'
							placeholder='Sequencing run'

							value={this.state.run}

							isInitial={this.state.runIsInitial}
							isValid={this.state.runIsValid}

							onChange={this.handleChangeTextInput}
							check={this.isRunValid}
						/>
						<SimpleTextInput
							id='lane'
							label='Lane'
							placeholder='Lane identifier'

							value={this.state.lane}

							isInitial={this.state.laneIsInitial}
							isValid={this.state.laneIsValid}

							onChange={this.handleChangeTextInput}
							check={this.isLaneValid}
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
		platformId: undefined,
		dateRun: undefined,
		run: '',
		lane: '',
	}
};
