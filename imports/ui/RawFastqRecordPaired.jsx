import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';

import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import DatePicker from 'react-datepicker';
import 'moment/locale/en-gb';

import { RawFastqRecords } from '../api/raw-fastq-records/raw-fastq-records.js';
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

			changedInputs: {},
		}
	}

	// TODO: duplicated with RawFastqRecordSingle
	updateChangedInputs (inputName, isInitial, newValue = undefined) {
		let changedInputs = this.state.changedInputs;
		if (isInitial) {
			delete changedInputs[inputName];
			this.setState({
				changedInputs: changedInputs,
			});
		} else {
			changedInputs[inputName] = newValue;
			this.setState({
				changedInputs: changedInputs,
			});
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
		Meteor.call('rawFastqs.countRecordsWithPath', value, (err, res) => {
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

	updateFirst (newValue) {
		let isInitial = (newValue === this.props.record.first)
		this.updateChangedInputs('first', isInitial, newValue);
		let isValid = this.isFirstFastqPathValid(newValue);
		// console.log('new first: ' + newValue);
		// console.log('is valid: ' + isValid);
		this.setState({
			first: newValue,
			firstInitial: isInitial,
			firstValid: isValid,
		});
		if (isValid){
			if (isInitial) {
				this.setState({
					filepathCountInDatabase: null,
				});
			} else {
				this.updateFirstInDatabase(newValue);
			}
		}
	}

	// method receives event and passes String
	handleChangeFirst (event) {
		let newValue = event.target.value;
		this.updateFirst(newValue);
	}

	// suffixesString must only contain a single '+' character to split it in two
	autocompleteFilepaths (suffixesString) {
		let suffixesList = suffixesString.split('+');
		// console.log('suffixesList: ' + suffixesList);
		let newFirst = this.state.first + suffixesList[0];
		let newSecond = this.state.first + suffixesList[1];
		// console.log('newFirst: ' + newFirst);
		this.updateFirst(newFirst);
		this.updateSecond(newSecond);
	}

	// suffixesString must only contain a single '/' character to split it in two
	autofillSecond (suffixesString) {
		let suffixesList = suffixesString.split('/');
		// console.log('suffixesList: ' + suffixesList);
		let newSecond = this.state.first.replace(suffixesList[0], suffixesList[1]);
		this.updateSecond(newSecond);
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
		let count = Meteor.call('rawFastqs.countRecordsWithPath', value, (err, res) => {
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

	updateSecond (newValue) {
		let isInitial = (newValue === this.props.record.second)
		this.updateChangedInputs('second', isInitial, newValue);
		let isValid = this.isSecondFastqPathValid(newValue);
		// console.log('new second: ' + newValue);
		// console.log('is valid: ' + isValid);
		this.setState({
			second: newValue,
			secondInitial: isInitial,
			secondValid: isValid,
		});
		if (isValid){
			if (isInitial) {
				this.setState({
					filepathCountInDatabase: null,
				});
			} else {
				this.updateSecondInDatabase(newValue);
			}
		}
	}

	// method receives event and passes String
	handleChangeSecond (event) {
		let newValue = event.target.value;
		this.updateSecond(newValue);
	}

	// TODO: duplicated with RawFastqRecordSingle
	isReadLengthValid (value) {
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
		// console.log('newValue: ' + String(newValue));
		return (
			newValue != undefined &&
			newValue != ''
		);
	}

	updateReadLengthState (newValue) {
		// console.log('initial: ' + typeof(this.props.record.readLength));
		// console.log('initial: ' + String(this.props.record.readLength));
		// console.log('current: ' + typeof(newValue));
		// console.log('current: ' + String(newValue));
		let isInitial = (newValue === String(this.props.record.readLength));
		this.updateChangedInputs('readLength', isInitial, newValue);
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

	handleReadLengthChangeInput (event) {
		// TODO: offer shortcuts (buttons) for common values ()
		let newValue = event.target.value;
		this.updateReadLengthState(newValue);
	}

	handleReadLengthChangeButton (event) {
		// TODO: offer shortcuts (buttons) for common values ()
		let newValue = event.target.attributes.getNamedItem('data-key').value;
		this.updateReadLengthState(newValue);
	}

	handleChangeSequencer (newValue) {
		// console.log('new sequencer: ' + String(newValue));
		// console.log('initial sequencer: ' + String(this.props.record.sequencer));
		let isInitial = (newValue === this.props.record.sequencer);
		this.updateChangedInputs('sequencer', isInitial, newValue);
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

	handleChangeDateRun (date) {
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
		this.updateChangedInputs('dateRun', isInitial, newValue);
		// console.log('isInitial: ' + isInitial);
		// console.log('isValid: ' + isValid);
		this.setState({
			dateRun: date, // save the moment() in the state
			dateRunInitial: isInitial,
			dateRunValid: isValid,
		});
	}

	// TODO: duplicated with RawFastqRecordSingle
	formGlyphicon (id, isInitial, isValid, countInDatabase = 0) { // can use function for database-independent input
		// console.log('inDB: ' + inDatabase);
		let glyphiconCheck = (
			isInitial ? '' : (
				!isValid ? 'glyphicon-remove' : ( // invalid 
					countInDatabase === -1 ? 'glyphicon-hourglass' : ( // waiting for server
						countInDatabase === 0 ? 'glyphicon-ok' : 'glyphicon-warning-sign'
					)
				)
			)
		);
		let glyphiconClass = classNames('glyphicon', glyphiconCheck);
		let tooltipText = (
			isInitial ? '' : (
				!isValid ? 'Invalid!' : ( // invalid 
					countInDatabase === -1 ? 'Checking database...' : ( // waiting for server
						countInDatabase === 0 ? 'All good!' : 'Matches an existing record in database'
					)
				)
			)
		);
		let tooltipType = (
			isInitial ? 'dark' : (
				!isValid ? 'error' : ( // invalid 
					countInDatabase === -1 ? 'info' : ( // waiting for server
						countInDatabase === 0 ? 'success' : 'warning'
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
		// console.log('#attributes: ' + Object.keys(this.state.changedInputs).length);
		return(
			Object.keys(this.state.changedInputs).length === 0
		);
		// return(
		// 	this.state.firstInitial &&
		// 	this.state.secondInitial &&
		// 	this.state.readLengthInitial &&
		// 	this.state.sequencerInitial &&
		// 	this.state.dateRunInitial
		// );
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

	renderFirstInput () {
		return(
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
	          onChange={this.handleChangeFirst.bind(this)}
          />
        </td>
        <td>{this.formGlyphicon(
        	'first-tip',
        	this.state.firstInitial,
        	this.state.firstValid,
        	this.state.firstCountInDatabase
        )}</td>
  		</tr>
  	);
	}

	// Note: eventKeys rules:
	// '+' separated suffixes for autocomplete ('append')
	// '/' separated suffixes for autofill ('substitute by')
	// Those two characters should never be present in the FASTQ pairing suffix
	renderFilepathDropdown () {
		return(
			<DropdownButton bsStyle='primary' title='Quick-fill' id='filepathDropdown' style={{'marginLeft':'1%'}}>
				<MenuItem header>Apply</MenuItem>
	      <MenuItem
	      	eventKey="_1.fastq.gz+_2.fastq.gz"
	      	onSelect={this.autocompleteFilepaths.bind(this)}>
	      	_1/_2.fastq.gz
	      </MenuItem>
	      <MenuItem divider />
	      <MenuItem header>Replace</MenuItem>
	      <MenuItem
	      	eventKey="_1.fastq.gz/_2.fastq.gz"
	      	onSelect={this.autofillSecond.bind(this)}>
	      	_1/_2.fastq.gz
	      </MenuItem>
	    </DropdownButton>
		);
	}

	renderSecondInput () {
		let displayDropdown = (this.state.first && !this.state.second);

		return(
			<tr>
  			<td>
  				<label htmlFor="secondPath">Second mate</label>
  			</td>
  			<td>
  				<input
						className={displayDropdown ? 'input-second-path-short' : 'input-file-path'}
						id="secondPath"
	          type="text"
	          ref="inputSecondpath"
	          placeholder="Path to second FASTQ file"
	          value={this.state.second}
	          onChange={this.handleChangeSecond.bind(this)}
	        />
          {
          	displayDropdown ? this.renderFilepathDropdown() : ''
          }
        </td>
        <td>{this.formGlyphicon(
        	'second-tip',
        	this.state.secondInitial,
        	this.state.secondValid,
        	this.state.secondCountInDatabase
        )}</td>
  		</tr>
		);
	}

	renderReadLengthInput () {
		return(
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
	          onChange={this.handleReadLengthChangeInput.bind(this)}
	        />&nbsp;
	        {this.renderReadLengthsButtonGroup()}
        </td>
        <td>{this.formGlyphicon(
        	'read-length-tip',
        	this.state.readLengthInitial,
        	this.state.readLengthValid
        )}</td>
  		</tr>
		);
	}

	renderReadLengthsButtonGroup () {
		return(
			<ButtonGroup onClick={this.handleReadLengthChangeButton.bind(this)}>
	      <Button bsStyle="primary" data-key='50'>50</Button>
	      <Button bsStyle="primary" data-key='75'>75</Button>
	      <Button bsStyle="primary" data-key='100'>100</Button>
	      <Button bsStyle="primary" data-key='150'>150</Button>
      </ButtonGroup>
		);
	}

	renderSequencerInput () {
		let options = this.props.sequencers.map((sequencer) => (
			{label: sequencer.name, value: sequencer._id}
		));

		return(
			<tr>
  			<td>
  				<label htmlFor="sequencer">Sequencer</label>
  			</td>
  			<td>
  				{ this.props.loading ? <Loading /> : <Select
						options={options}
						ref='selectSequencer'
						simpleValue
						clearable={false}
						name="selected-sequencer"
						value={this.state.sequencer}
						onChange={this.handleChangeSequencer.bind(this)}
						searchable={this.state.searchable}
					/> }
        </td>
        <td>{this.formGlyphicon(
        	'sequencer-tip',
        	this.state.sequencerInitial,
        	this.state.sequencerValid)}</td>
  		</tr>
		);
	}

	renderDateRunInput () {
		return(
			<tr>
  			<td>
  				<label htmlFor="sequencer">Date run</label>
  			</td>
  			<td>
  				<DatePicker
  					selected={this.state.dateRun}
  					dateFormat="DD/MM/YYYY"
						onChange={this.handleChangeDateRun.bind(this)}
						locale="en-gb"
						placeholderText="Date of sequencing run" />
				 </td>
				 <td>{this.formGlyphicon(
				 	'date-run-tip',
				 	this.state.dateRunInitial,
				 	this.state.dateRunValid
				 )}</td>
  		</tr>
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
				// console.log('submit new paired FASTQ record !');
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

			sequencer: undefined,
			sequencerInitial: true,
			sequencerValid: false,

			dateRun: null,
			dateRunInitial: true,
			dateRunValid: false,

			changedInputs: {},
		})
	}

	render () {
		return(
			<form className="rawFastq-single" onSubmit={this.handleSubmit.bind(this)} >
				<table className='table raw-fastq-record-table'>
      	<thead>
      		<tr>
      			<th className='fastq-table-field'>Field</th>
      			<th className='fastq-table-value'>Value</th>
      			<th className='fastq-table-check'>Check</th>
      		</tr>
      	</thead>
      	<tbody>
      		{this.renderFirstInput()}
      		{this.renderSecondInput()}
      		{this.renderReadLengthInput()}
      		{this.renderSequencerInput()}
      		{this.renderDateRunInput()}
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
