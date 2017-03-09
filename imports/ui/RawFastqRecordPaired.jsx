import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';

import { Button } from 'react-bootstrap';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import DatePicker from 'react-datepicker';
import 'moment/locale/en-gb';

import { RawFastqRecords } from '../api/raw-fastq-records.js';
import { Sequencers } from '../api/sequencers.js';

import Loading from './loading.jsx'

let classNames = require('classnames');

class RawFastqRecordPaired extends Component {

	constructor (props) {
		super(props);

		// console.log('propsId: ' + props.record._id);
		// console.log('this-propsId: ' + this.props.record._id);
		// console.log('type-propsId: ' + typeof(this.props.record._id));

		let startDate = (props.record.dateRun ? moment(props.record.dateRun, "YYYYMMDD") : null);

		this.state = {
			first: props.record.first, // value of field
			firstInitial: true, // do not show any glyphicon if initial
			firstValid: true, // for glyphicon & form validation
			firstCountInDatabase: null, // for glyphicon & asynchronous form validation

			second: props.record.second,
			secondInitial: true,
			secondValid: true,
			secondCountInDatabase: null,

			readLength: props.record.readLength,
			readLengthInitial: true,
			readLengthValid: this.isReadLengthValid(props.record.readLength),

			sequencer: props.record.sequencer,
			sequencerInitial: true,
			sequencerValid: props.record.sequencer !== null,

			dateRun: startDate,
			dateRunInitial: true,
			dateRunValid: this.isDateRunValid(props.record.dateRun),
		}
	}

	isFirstFastqPathValid (value) {
		// TODO: check that path does not exist in database yet
		// Current check:
		// - not empty
		// - no space
		return(
			value !== '' && value !== this.state.second
		);
	}

	updateFirstInDatabase (value) {
		// console.log('newValue: ' + value);
		this.setState({
			firstCountInDatabase: -1 // value during processing
		})
		// console.log('updateFirstInDatabase');
		Meteor.call('rawFastqs.countRecordsPairedWithPath', value, (err, res) => {
			if (err){
				alert(err);
			} else {
				// console.log('res: ' + res);
				this.setState({
						firstCountInDatabase: res
				})
			}
		});
	}

	updateFirst (event) {
		let newValue = event.target.value;
		let isInitial = (newValue === this.props.record.first)
		let isValid = this.isFirstFastqPathValid(newValue);
		// If the new value is not valid, don't bother with further checks
		if (isValid){
			// Set as invalid if present in database
			this.updateFirstInDatabase(newValue);
		}
		// console.log('new first: ' + newValue);
		// console.log('is valid: ' + isValid);
		this.setState({
			first: newValue,
			firstInitial: isInitial,
			firstValid: isValid,
		});
	}

	isSecondFastqPathValid (value) {
		// TODO: check that path does not exist in database yet
		// Current check:
		// - not empty
		// - no space
		return(
			value !== '' && (!value.includes(' ')) && value !== this.state.first
		);
	}

	updateSecondInDatabase (value) {
		// console.log('newValue: ' + value);
		this.setState({
			secondCountInDatabase: -1 // value during processing
		})
		let count = Meteor.call('rawFastqs.countRecordsPairedWithPath', value, (err, res) => {
			if (err){
				alert(err);
			} else {
				// console.log('res: ' + res);
				this.setState({
						secondCountInDatabase: res
				})
			}
		});
		return(
			count > 0
		);
	}

	updateSecond (event) {
		let newValue = event.target.value;
		let isInitial = (newValue === this.props.record.second)
		let isValid = this.isSecondFastqPathValid(newValue);
		// If the new value is not valid, don't bother with further checks
		if (isValid){
			this.updateSecondInDatabase(newValue);
		}
		// console.log('new second: ' + newValue);
		// console.log('is valid: ' + isValid);
		this.setState({
			second: newValue,
			secondInitial: isInitial,
			secondValid: isValid,
		});
	}

	// TODO: duplicated with RawFastqRecordSingle
	isReadLengthValid(value) {
		// Current check:
		// - not empty
		// - greater than 0
		// console.log('new length: ' + String(value));
		// console.log('new length: ' + typeof(value));
		return(
			value !== '' && value > 0
		);
	}

	// TODO: duplicated with RawFastqRecordSingle
	isReadLengthValid (newValue) {
		return (newValue != undefined);
	}

	updateReadLengthState (newValue) {
		// console.log('initial: ' + typeof(this.props.record.readLength));
		// console.log('initial: ' + String(this.props.record.readLength));
		// console.log('current: ' + typeof(newValue));
		// console.log('current: ' + String(newValue));
		let isInitial = (newValue === String(this.props.record.readLength));
		// console.log('isInitial: ' + isInitial);
		let isValid = this.isReadLengthValid(newValue);
		// if (newValue > 0 || newValue === ''){
		this.setState({
			readLength: newValue,
			readLengthInitial: isInitial,
			readLengthValid: this.isReadLengthValid(newValue),
			});
		// }
	}

	updateReadLengthFromInput (event) {
		// TODO: offer shortcuts (buttons) for common values ()
		let newValue = event.target.value;
		this.updateReadLengthState(newValue);
	}

	updateReadLengthFromButton (event) {
		// TODO: offer shortcuts (buttons) for common values ()
		let newValue = event.target.attributes.getNamedItem('data-key').value;
		this.updateReadLengthState(newValue);
	}

	renderReadLengthsButtonGroup () {
		return(
			<ButtonGroup onClick={this.updateReadLengthFromButton.bind(this)}>
	      <Button bsStyle="primary" data-key='50'>50</Button>
	      <Button bsStyle="primary" data-key='75'>75</Button>
	      <Button bsStyle="primary" data-key='100'>100</Button>
	      <Button bsStyle="primary" data-key='150'>150</Button>
      </ButtonGroup>
		);
	}

	updateSequencer (newValue) {
		console.log('new sequencer: ' + String(newValue));
		console.log('initial sequencer: ' + String(this.props.record.sequencer));
		let isInitial = (newValue === this.props.record.sequencer);
		// console.log('initial: ' + this.props.record.sequencer);
		// console.log('isInitial: ' + isInitial);
		this.setState({
			sequencer: newValue,
			sequencerInitial: isInitial,
			sequencerValid: this.isReadLengthValid(newValue),
		});
	}

	// TODO: duplicated with RawFastqRecordSingle
	isDateRunValid (value) {
		// Current check:
		// - exactly 6 digits (that should cover us for a few millenia)
		// console.log('value: ' + value);
		// console.log('typeof: ' + typeof(value));
		return(
			value != null && /^\d{8}$/.test(value)
		);
	}

	updateDateRun (date) {
		// Note: date is passed as moment() object, with its own methods
		// console.log('locale: ' + moment.locale());
		// console.log('Date: ' + date.format('LL'));
		let newValue;
		let isInitial;
		if (date === null){
			newValue = date;
			isInitial = (newValue === this.props.record.dateRun);
			isValid = false;
		} else {
			newValue = date.format("YYYYMMDD"); // check the formatted date for validity
			isInitial = (newValue === this.props.record.dateRun);
			isValid = this.isDateRunValid(newValue);
		}
		// console.log('isInitial: ' + isInitial);
		// console.log('isValid: ' + isValid);
		this.setState({
			dateRun: date, // save the moment() in the state
			dateRunInitial: isInitial,
			dateRunValid: isValid,
		});
	}

	// TODO: duplicated with RawFastqRecordSingle
	formGlyphicon (id, isInitial, isValid, inDatabase = 0) { // can use function for database-independent input
		// console.log('inDB: ' + inDatabase);
		let glyphiconCheck = (
			isInitial ? '' : (
				!isValid ? 'glyphicon-remove' : ( // invalid 
					inDatabase === -1 ? 'glyphicon-hourglass' : ( // waiting for server
						inDatabase === 0 ? 'glyphicon-ok' : 'glyphicon-warning-sign'
					)
				)
			)
		);
		let glyphiconClass = classNames('glyphicon', glyphiconCheck);
		let tooltipText = (
			isInitial ? '' : (
				!isValid ? 'Invalid!' : ( // invalid 
					inDatabase === -1 ? 'Checking database...' : ( // waiting for server
						inDatabase === 0 ? 'All good!' : 'Matches an existing record in database'
					)
				)
			)
		);
		let tooltipType = (
			isInitial ? 'dark' : (
				!isValid ? 'error' : ( // invalid 
					inDatabase === -1 ? 'info' : ( // waiting for server
						inDatabase === 0 ? 'success' : 'warning'
					)
				)
			)
		);
		// console.log('tooltipText: ' + tooltipText);
		// console.log('tooltipType: ' + tooltipText);
		return(
			<div>
				<ReactTooltip id={id} type={tooltipType} effect="solid" place="left">
				  <span>{tooltipText}</span>
				</ReactTooltip>
				<span className={glyphiconClass} aria-hidden="true" data-tip data-for={id}></span>
			</div>
		);
	}

	isFormInitial () {
		return(
			this.state.firstInitial &&
			this.state.secondInitial &&
			this.state.readLengthInitial &&
			this.state.sequencerInitial &&
			this.state.dateRunInitial
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
			this.state.readLength !== '' &&
			this.state.sequencer !== undefined &&
			this.state.dateRun !== null
		)
	}

	isFormValid (){
		// console.log('firstValid: ' + this.state.firstValid);
		// console.log('secondValid: ' + this.state.secondValid);
		// console.log('readLengthValid: ' + this.state.readLengthValid);
		// console.log('sequencerValid: ' + this.state.sequencerValid);
		// console.log('dateRunValid: ' + this.state.dateRunValid);
		return(
			this.state.firstValid &&
			this.state.secondValid &&
			this.state.readLengthValid &&
			this.state.sequencerValid &&
			this.state.dateRunValid
		);
	}

	renderSubmitButton () {
		// console.log('initial: ' + this.isFormInitial());
		// console.log('pending: ' + this.isFormPending());
		// console.log('isFormComplete: ' + this.isFormComplete());
		// console.log('valid: ' + this.isFormValid());
		let buttonColour = (
			this.isFormInitial() ? 'primary' : (
				this.isFormPending() ? 'warning' : (
					!this.isFormComplete() ? 'warning' : (
						this.isFormValid() ? 'success' : 'danger'
					)
				)
			)
		);
		// console.log('buttonColour: ' + buttonColour);
		let disableButton = (
			this.isFormInitial() ||
			this.isFormPending() ||
			!this.isFormComplete() ||
			!this.isFormValid()
		);
		let buttonText = (
			this.isFormInitial() ? 'Submit' : (
				this.isFormPending() ? 'Please wait...' : (
					!this.isFormComplete() ? 'Incomplete' : (
						this.isFormValid() ? 'Submit!' : 'Error!'
					)
				)
			)
		);
		let buttonStyle = classNames(buttonColour);
		return(
			<Button type="submit" bsStyle={buttonColour} disabled={disableButton}>{buttonText}</Button>
    );
	}

	handleSubmit (event) {
		event.preventDefault();
		if (this.isFormValid()){
			
			if (this.props.record._id === undefined){
				console.log('submit new paired FASTQ record !');
				Meteor.call(
					'rawFastqs.insertPairedEnd',
					this.state.first,
					this.state.second,
					parseInt(this.state.readLength),
					this.state.sequencer,
					this.state.dateRun.format("YYYYMMDD"),
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
				console.log('update paired FASTQ record !');
				Meteor.call('rawFastqs.updatePairedEnd', {
				  recordId: this.props.record._id,
				  first: this.state.first,
				  second: this.state.second,
				  readLength: parseInt(this.state.readLength),
				  sequencer: this.state.sequencer,
				  dateRun: this.state.dateRun.format("YYYYMMDD"),
				}, (err, res) => {
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
			firstInitial: true,
			firstValid: false,
			firstCountInDatabase: null,

			second: '',
			secondInitial: true,
			secondValid: false,
			secondCountInDatabase: null,

			readLength: '',
			readLengthInitial: true,
			readLengthValid: false,

			sequencer: null,
			sequencerInitial: true,
			sequencerValid: false,

			dateRun: null,
			dateRunInitial: true,
			dateRunValid: false,
		})
	}

	render () {
		return(
			<form className="rawFastq-single" onSubmit={this.handleSubmit.bind(this)} >
				<table className='table raw-fastq-record-table'>
      	<thead>
      		<tr>
      			<th className='profile-field-col'>Field</th>
      			<th className='profile-field-value'>Value</th>
      			<th className='profile-field-check'>Check</th>
      		</tr>
      	</thead>
      	<tbody>
      		<tr>
      			<td>
      				<label htmlFor="firstPath">First mate</label>
      			</td>
      			<td>
      				<input
							className='input-file-path'
							id="firstPath"
		          type="text"
		          ref="inputFirstPath"
		          placeholder="Path to first FASTQ file"
		          value={this.state.first}
		          onChange={this.updateFirst.bind(this)}/>
		        </td>
		        <td>{this.formGlyphicon(
		        	'first-tip',
		        	this.state.firstInitial,
		        	this.state.firstValid,
		        	this.state.firstCountInDatabase
		        )}</td>
      		</tr>
      		<tr>
      			<td>
      				<label htmlFor="secondPath">Second mate</label>
      			</td>
      			<td>
      				<input
								className='input-file-path'
								id="secondPath"
			          type="text"
			          ref="inputSecondpath"
			          placeholder="Path to second FASTQ file"
			          value={this.state.second}
			          onChange={this.updateSecond.bind(this)}
			        />
		        </td>
		        <td>{this.formGlyphicon(
		        	'second-tip',
		        	this.state.secondInitial,
		        	this.state.secondValid,
		        	this.state.secondCountInDatabase
		        )}</td>
      		</tr>
      		<tr>
      			<td>
      				<label htmlFor="readLength">Read length</label>
      			</td>
      			<td>
      				<input
								id="readLength"
			          type="number"
			          min='1'
			          ref="inputReadLength"
			          placeholder="Read length"
			          value={this.state.readLength}
			          onChange={this.updateReadLengthFromInput.bind(this)}
			        />&nbsp;
			        {this.renderReadLengthsButtonGroup()}
		        </td>
		        <td>{this.formGlyphicon(
		        	'read-length-tip',
		        	this.state.readLengthInitial,
		        	this.state.readLengthValid
		        )}</td>
      		</tr>
      		<tr>
      			<td>
      				<label htmlFor="sequencer">Sequencer</label>
      			</td>
      			<td>
      				{ this.props.loading ? <Loading /> : <Select
								options={this.props.sequencers}
								ref='selectSequencer'
								simpleValue
								clearable={false}
								name="selected-sequencer"
								value={this.state.sequencer}
								onChange={this.updateSequencer.bind(this)}
								searchable={this.state.searchable}
							/> }
		        </td>
		        <td>{this.formGlyphicon(
		        	'sequencer-tip',
		        	this.state.sequencerInitial,
		        	this.state.sequencerValid)}</td>
      		</tr>
      		<tr>
      			<td>
      				<label htmlFor="sequencer">Date run</label>
      			</td>
      			<td>
      				<DatePicker
      					selected={this.state.dateRun}
								onChange={this.updateDateRun.bind(this)}
								locale="en-gb"
								placeholderText="Date of sequencing run" />
						 </td>
						 <td>{this.formGlyphicon(
						 	'date-run-tip',
						 	this.state.dateRunInitial,
						 	this.state.dateRunValid
						 )}</td>
      		</tr>
      	</tbody>
      </table>
      {this.renderSubmitButton()}
			</form>
		);
	}

}

RawFastqRecordPaired.propTypes = {
	record: PropTypes.object,
	sequencers: PropTypes.array,
};

RawFastqRecordPaired.defaultProps = {
	record: {
		_id: undefined,
		first: '',
		second: '',
		readLength: '',
		sequencer: undefined,
		dateRun: null,
	}
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer((  ) => {
	const subscription = Meteor.subscribe('sequencers');
	const loading = !subscription.ready();

	return {
		sequencers: Sequencers.find({}).fetch(),
		loading: loading,
	};
}, RawFastqRecordPaired);
