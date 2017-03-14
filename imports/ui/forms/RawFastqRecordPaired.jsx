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
			first: props.record.first, // value of field
			firstIsInitial: true, // do not show any glyphicon if initial
			firstIsValid: isFilepathValid(props.record.first), // for glyphicon & form validation
			firstCountInDatabase: 0, // for glyphicon & asynchronous form validation, not checked if value is initial

			second: props.record.second,
			secondIsInitial: true,
			secondIsValid: isFilepathValid(props.record.second),
			secondCountInDatabase: 0,

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
			this.state.firstCountInDatabase === -1 ||
			this.state.secondInitial === -1
		);
	}

	isFormComplete () {
		return(
			this.state.first !== '' &&
			this.state.second !== '' &&
			!isNaN(this.state.readLength) &&
			this.state.sequencerId !== undefined &&
			this.state.dateRunDate !== undefined
		)
	}

	isFormValid (){
		// console.log('firstValid: ' + this.state.firstValid);
		// console.log('secondValid: ' + this.state.secondValid);
		// console.log('readLengthValid: ' + this.state.readLengthValid);
		// console.log('sequencerIdIsValid: ' + this.state.sequencerIdIsValid);
		// console.log('dateRunValid: ' + this.state.dateRunValid);
		return(
			this.state.firstIsValid &&
			this.state.secondIsValid &&
			this.state.readLengthIsValid &&
			this.state.sequencerIdIsValid &&
			this.state.dateRunIsValid
		);
	}

	isInDatabase () {
		return(
			this.state.firstCountInDatabase > 0 ||
			this.state.secondCountInDatabase > 0
		);
	}

	handleSubmit (event) {
		event.preventDefault();
		if (this.isFormValid()){
			
			if (this.props.record._id === undefined){
				// console.log('submit new paired FASTQ record !');
				Meteor.call(
					'rawFastqs.insertPairedEnd',
					this.state.first,
					this.state.second,
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
			first: '',
			firstIsInitial: true,
			firstIsValid: false,
			firstCountInDatabase: 0,

			second: '',
			secondIsInitial: true,
			secondIsValid: false,
			secondCountInDatabase: 0,

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
							id='first'
							label='First mate'
							placeholder='Path to FASTQ file of first mate'

							value={this.state.first}

							isInitial={this.state.firstIsInitial}
							isValid={this.state.firstIsValid}
							countInDatabase={this.state.firstCountInDatabase}

							onChange={this.handleChangeFilepath}
						/>
						<FilepathTextInput
							id='second'
							label='Second mate'
							placeholder='Path to FASTQ file of second mate'

							value={this.state.second}

							isInitial={this.state.secondIsInitial}
							isValid={this.state.secondIsValid}
							countInDatabase={this.state.secondCountInDatabase}

							onChange={this.handleChangeFilepath}

							displayDropdown={(this.state.first !== '' && this.state.second === '')}
							pairedFirst='first'
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
		first: '',
		second: '',
		readLength: NaN,
		sequencerId: undefined,
		dateRun: undefined,
	}
};
