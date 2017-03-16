import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import { renderGlyphicon } from './generic.jsx';

// Assuming value is a String
// check arbitrary rules to prevent submission of invalid forms
export function isLaneValid (value) {
	// Current check:
	// - not empty
	return(
		value !== ''
	);
}

export function	handleChangeTextInput (field, newValue) {
	// console.log('newValue: ' + newValue);
	// console.log('props: ' + this.props.record);
	let isInitial = (newValue === this.props.record[field])
	// Update the Object (dictionary) that tracks non-initial fields in the parent form
	this.updateChangedInputs(field, isInitial, newValue);
	let isValid = isLaneValid(newValue);
	// console.log('is valid: ' + isValid);
	// Update state of the parent form
	this.setState({
		[field]: newValue,
		[field + 'IsInitial']: isInitial,
		[field + 'IsValid']: isValid,
	});
}

export default class SimpleTextInput extends Component {

constructor (props) {
	super(props);
	// console.log(props);
	this.handleChange = props.onChange.bind(this);
	this.handleChangeInput = this.handleChangeInput.bind(this);
}

// (Input event) handleChange function for RawFastqRecord read length
handleChangeInput (event) {
	// event.persist();
	// console.log(event);
	let field = this.props.id;
	// console.log(field);
	let newValue = event.target.value;
	this.handleChange(field, newValue);
}

render () {
	return(
		<tr>
			<td>
				<label htmlFor={this.props.id}>{this.props.label}</label>
			</td>
			<td>
				<input
					className={this.props.className}
					id={this.props.id}
          type="text"
          ref={this.props.id}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.handleChangeInput}
        />
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

SimpleTextInput.propTypes = {
// HTML input
id: PropTypes.string.isRequired,
label: PropTypes.string.isRequired,
placeholder: PropTypes.string,
className: PropTypes.string,

// Current value
value: PropTypes.string.isRequired,

// Glyphicon
isInitial: PropTypes.bool.isRequired,
isValid: PropTypes.bool.isRequired,

// Update parent state
onChange: PropTypes.func.isRequired,
};

SimpleTextInput.defaultProps = {
placeholder: 'Placeholder text',
className: 'input-file-path',
};
