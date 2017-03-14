import React, { Component, PropTypes } from 'react';

import { Button, ButtonGroup } from 'react-bootstrap';
// Form validation
import { renderGlyphicon } from './generic.jsx';

// Assuming value is a Number (undefined if empty field)
// check arbitrary rules to prevent submission of invalid forms
export function isReadLengthValid (newValue) {
	return (
		!isNaN(newValue) &&
		newValue > 0
	);
}

// (primary) handleChange function for RawFastqRecord read length
export function handleChangeReadLength (field, newValue) {
	// console.log('initial: ' + typeof(this.props.record.readLength));
	// console.log('initial: ' + String(this.props.record.readLength));
	// console.log('current: ' + typeof(newValue));
	// console.log('field: ' + field);
	// console.log('current: ' + String(newValue));
	let isInitial;
	if (isNaN(this.props.record.readLength)){
		isInitial = isNaN(newValue)
	} else {
		isInitial = (newValue === this.props.record.readLength)
	}
	
	this.updateChangedInputs(field, isInitial, newValue);
	// console.log('isInitial: ' + isInitial);
	let isValid = isReadLengthValid(newValue);

	this.setState({
		[field]: newValue,
		[field + 'IsInitial']: isInitial,
		[field + 'IsValid']: isValid,
	});
}

export default class ReadLengthInput extends Component {

	constructor (props) {
		super(props);
		// console.log(props);
		this.handleChange = props.onChange.bind(this);
		this.handleChangeInput = this.handleChangeInput.bind(this);
		this.handleChangeButton = this.handleChangeButton.bind(this);
	}

	// (Input event) handleChange function for RawFastqRecord read length
	handleChangeInput (event) {
		// event.persist();
		// console.log(event);
		let field = this.props.id;
		// console.log(field);
		let newValue = parseInt(event.target.value);
		this.handleChange(field, newValue);
	}

	// (Button event) handleChange function for RawFastqRecord read length
	handleChangeButton (event) {
		// event.persist();
		// console.log(event);
		let field = this.props.id;
		// console.log(field);
		let newValue = parseInt(event.target.attributes.getNamedItem('data-key').value);
		this.handleChange(field, newValue);
	}

	renderReadLengthsButtonGroup () {
		return(
			<ButtonGroup onClick={this.handleChangeButton} style={{padding: '0px 2%'}}>
	      <Button id={this.props.id+'-50'} bsStyle="primary" data-key='50'>50</Button>
	      <Button id={this.props.id+'-75'} bsStyle="primary" data-key='75'>75</Button>
	      <Button id={this.props.id+'-100'} bsStyle="primary" data-key='100'>100</Button>
	      <Button id={this.props.id+'-150'} bsStyle="primary" data-key='150'>150</Button>
      </ButtonGroup>
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
						id={this.props.id}
	          type="number"
	          min='1'
	          ref={this.props.id}
	          placeholder={this.props.placeholder}
	          value={this.props.value ? this.props.value : ''}
	          onChange={this.handleChangeInput}
	        />
        	{this.renderReadLengthsButtonGroup()}
        </td>
        <td>{renderGlyphicon(
        	this.props.id+'-tip',
        	this.props.isInitial,
        	this.props.isValid
        )}</td>
  		</tr>
		);
	}

}

ReadLengthInput.propTypes = {
	// HTML input
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,

	// Current value
	value: PropTypes.number,

	// Glyphicon
	isInitial: PropTypes.bool.isRequired,
	isValid: PropTypes.bool.isRequired,

	// Update parent state
	onChange: PropTypes.func.isRequired,
};

ReadLengthInput.defaultProps = {
	placeholder: 'Read length',
	value: NaN,
};
