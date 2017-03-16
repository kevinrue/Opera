import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import { DropdownButton, MenuItem } from 'react-bootstrap';

import { renderGlyphicon } from './generics.jsx';

import { RawFastqRecords } from '/imports/api/raw-fastq-records/raw-fastq-records.js';

// Assuming value is a String
// check arbitrary rules to prevent submission of invalid forms
export function isFastqPathValid (value) {
	// Current check:
	// - not empty
	return(
		value !== ''
	);
}

export function	handleChangeFastqPath (field, newValue, pairedField = undefined) {
	// console.log('newValue: ' + newValue);
	// console.log('props: ' + this.props.record);
	let isInitial = (newValue === this.props.record[field])
	// Update the Object (dictionary) that tracks non-initial fields in the parent form
	this.updateChangedInputs(field, isInitial, newValue);
	// Second field is not valid if identical to first
	let pairedValue = this.state[pairedField];
	// console.log('pairedValue: ' + pairedValue);
	let isValid = (
		isFastqPathValid(newValue) &&
		 (newValue !== pairedValue));
	// console.log('is valid: ' + isValid);
	// Update state of the parent form
	this.setState({
		[field]: newValue,
		[field + 'IsInitial']: isInitial,
		[field + 'IsValid']: isValid,
	});
	// If the new value is not valid, don't bother the database with further checks
	if (isValid){
		if (isInitial) {
			this.setState({
				[field + 'CountInDatabase']: 0, // if initial, count in database is ignored anyway
			});
		} else {
			this.setState({
				[field + 'CountInDatabase']: -1 // value during processing
			})
			Meteor.call('rawFastqs.countRecordsWithPath', newValue, (err, res) => {
				if (err){
					// TODO: possibly update this.state to specific values
					alert(err);
				} else {
					// console.log('res: ' + res);
					this.setState({
							[field + 'CountInDatabase']: res
					})
				}
			});
		}
	}
}

// suffixesString must only contain a single '+' character to split it in two
export function autocompleteFilepaths (field1, field2, suffixesString) {
	// console.log('suffixesString: ' + suffixesString);
	let suffixesList = suffixesString.split('+');
	// console.log('suffixesList: ' + suffixesList);
	let newFirst = this.state[field1] + suffixesList[0];
	let newSecond = this.state[field1] + suffixesList[1];
	// console.log('newFirst: ' + newFirst);
	// console.log('newSecond: ' + newSecond);
	this.handleChangeFastqPath(field1, newFirst);
	this.handleChangeFastqPath(field2, newSecond);
}

// suffixesString must only contain a single '/' character to split it in two
export function autofillSecond (field1, field2, suffixesString) {
	// console.log('suffixesString: ' + suffixesString);
	let suffixesList = suffixesString.split('/');
	// console.log('suffixesList: ' + suffixesList);
	let file1 = this.state[field1];
	if (!file1.includes(suffixesList[0])){
		alert('Pattern not found in first mate: ' + suffixesList[0]);
	} else {
		let newSecond = file1.replace(suffixesList[0], suffixesList[1]);
		this.handleChangeFastqPath(field2, newSecond);
	}
}

export default class RawFastqFileInput extends Component {

	constructor (props) {
		super(props);
		// console.log(props);
		this.handleChange = props.onChange.bind(this);
		this.handleChangeInput = this.handleChangeInput.bind(this);

		this.handleAutocomplete = props.onAutocomplete.bind(this);
		this.handleAutocompleteDropdown = this.handleAutocompleteDropdown.bind(this);
		this.handleAutofill = props.onAutofill.bind(this);
		this.handleAutofillDropdown = this.handleAutofillDropdown.bind(this);
	}

	// (Input event) handleChange function for RawFastqRecord read length
	handleChangeInput (event) {
		// event.persist();
		// console.log(event);
		let field = this.props.id;
		// console.log(field);
		let newValue = event.target.value;
		this.handleChange(field, newValue, this.props.pairedFirst);
	}

	handleAutocompleteDropdown (suffixesString) {
		this.handleAutocomplete(this.props.pairedFirst, this.props.id, suffixesString)
	}

	handleAutofillDropdown (suffixesString) {
		this.handleAutofill(this.props.pairedFirst, this.props.id, suffixesString)
	}

	renderFilepathDropdown () {
		return(
			<DropdownButton bsStyle='primary' title='Quick-fill' id='filepathDropdown' style={{'marginLeft':'10%'}}>
				<MenuItem header>Apply</MenuItem>
	      <MenuItem
	      	eventKey="_1.fastq.gz+_2.fastq.gz"
	      	onSelect={this.handleAutocompleteDropdown}>
	      	_1/_2.fastq.gz
	      </MenuItem>
	      <MenuItem divider />
	      <MenuItem header>Replace</MenuItem>
	      <MenuItem
	      	eventKey="_1.fastq.gz/_2.fastq.gz"
	      	onSelect={this.handleAutofillDropdown}>
	      	_1/_2.fastq.gz
	      </MenuItem>
	    </DropdownButton>
		);
	}

	render () {
		return(
			<tr>
  			<td>
  				<label htmlFor={this.props.id}>{this.props.label}</label>
  			</td>
  			<td>
  				<input
						className={this.props.displayDropdown ? 'input-second-path-short' : 'input-file-path'}
						id={this.props.id}
	          type="text"
	          ref={this.props.id}
	          placeholder={this.props.placeholder}
	          value={this.props.value}
	          onChange={this.handleChangeInput}
          />
          { this.props.displayDropdown ? this.renderFilepathDropdown() : '' }
        </td>
        <td>{renderGlyphicon(
        	this.props.id+'-tip',
        	this.props.isInitial,
        	this.props.isValid,
        	this.props.countInDatabase
        	)}
        </td>
  		</tr>
		);
	}

}

RawFastqFileInput.propTypes = {
	// HTML input
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,

	// Current value
	value: PropTypes.string.isRequired,

	// Glyphicon
	isInitial: PropTypes.bool.isRequired,
	isValid: PropTypes.bool.isRequired,
	countInDatabase: PropTypes.number.isRequired,

	// Update parent state
	onChange: PropTypes.func.isRequired,
	pairedFirst: PropTypes.string,
	onAutocompleteButton: PropTypes.func,
	onAutofillButton: PropTypes.func,

	// Additional class name
	displayDropdown: PropTypes.bool,
};

RawFastqFileInput.defaultProps = {
	placeholder: 'Path to file',
	displayDropdown: false,

	onAutocomplete: autocompleteFilepaths,
	onAutofill: autofillSecond,	
};
