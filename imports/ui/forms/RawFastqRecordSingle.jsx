// Meteor / React
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
// Third-party modules
import 'moment/locale/en-gb';
// Form validation
import { updateChangedInputs, renderSubmitButton } from './generics.jsx';
// Input half-dumb components (display & client-side validation)
import RawFastqFileInput, { handleChangeFastqPath, isFastqPathValid } from './inputs/RawFastqFileInput.jsx';
import ReadLengthInput, { handleChangeReadLength, isReadLengthValid } from './inputs/ReadLengthInput.jsx';
import PlatformDropdownInput, { handleChangePlatform, isPlatformValid } from './inputs/PlatformDropdownInput.jsx';
import DateInput, { handleChangeDateRun, isDateRunValid } from './inputs/DateInput.jsx';
import SimpleTextInput, { handleChangeTextInput, isLaneValid, isRunValid } from './inputs/SimpleTextInput.jsx';

import Loading from '/imports/ui/loading.jsx';

export default class RawFastqRecordSingle extends Component {

	constructor (props) {
		super(props);

		// Database stores dateRun in native Date() format
		let startDate = (props.record.dateRun ? moment(props.record.dateRun) : null);

		this.state = {
			file: props.record.file, // value of field
			fileIsInitial: true, // do not show any glyphicon if initial // TODO: remove: if file is present in keys(changedInputs) is proof enough
			fileIsValid: isFastqPathValid(props.record.file), // for glyphicon & form validation
			fileCountInDatabase: 0, // for glyphicon & asynchronous form validation, not checked if value is initial

			readLength: props.record.readLength,
			readLengthIsInitial: true,
			readLengthIsValid: isReadLengthValid(props.record.readLength),

			platformId: props.record.platformId,
			platformIdIsInitial: true,
			platformIdIsValid: isPlatformValid(props.record.platformId),

			dateRun: startDate, // moment()
			dateRunDate: props.record.dateRun, // Date()
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

		this.isLaneValid = isLaneValid.bind(this);
		this.isRunValid = isRunValid.bind(this);
	}

	isFormInitial () {
		// console.log(this.state.changedInputs);
		return(
			Object.keys(this.state.changedInputs).length === 0
		);
	}

	isFormPending () {
		return(
			this.state.fileCountInDatabase === -1
		);
	}

	isFormComplete () {
		return(
			this.state.file !== '' &&
			!isNaN(this.state.readLength) &&
			this.state.platformId !== undefined &&
			this.state.dateRunDate !== undefined &&
			this.state.run !== '' &&
			this.state.lane !== ''
		)
	}

	isFormValid (){
		// console.log('fileIsValid: ' + this.state.fileIsValid);
		// console.log('readLengthIsValid: ' + this.state.readLengthIsValid);
		// console.log('platformIsValid: ' + this.state.platformIdIsValid);
		// console.log('dateRunIsValid: ' + this.state.dateRunIsValid);
		return(
			this.state.fileIsValid &&
			this.state.readLengthIsValid &&
			this.state.platformIdIsValid &&
			this.state.dateRunIsValid &&
			this.state.runIsValid &&
			this.state.laneIsValid			
		);
	}

	isInDatabase () {
		return(
			this.state.fileCountInDatabase > 0
		);
	}

	handleSubmit (event) {
		event.preventDefault();
		if (this.isFormValid()){

			if (this.props.record._id === undefined){
				// console.log('submit new single FASTQ record !');
				Meteor.call(
					'rawFastqs.insertSingleEnd',
					this.state.file,
					this.state.readLength,
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

	

	resetForm () {
		this.setState({
			file: '',
			fileIsInitial: true,
			fileIsValid: false,
			fileCountInDatabase: 0,

			readLength: NaN,
			readLengthIsInitial: true,
			readLengthIsValid: false,

			platformId: null,
			platformIdIsInitial: true,
			platformIdIsValid: false,

			dateRun: null,
			dateRunDate: null,
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
		// console.log('render: ' + this.state.file);
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
							id='file'
							label='File path'
							placeholder='Path to FASTQ file'

							value={this.state.file}

							isInitial={this.state.fileIsInitial}
							isValid={this.state.fileIsValid}
							countInDatabase={this.state.fileCountInDatabase}

							onChange={this.handleChangeFastqPath}
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
	      {
	      	renderSubmitButton(
	      		this.isFormInitial(),
	      		this.isFormComplete(),
	      		this.isFormValid(),
	      		this.isFormPending(),
	      		this.isInDatabase())
	      }
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
		file: '',
		readLength: NaN,
		platformId: undefined,
		dateRun: undefined,
		run: '',
		lane: '',
	}
};
