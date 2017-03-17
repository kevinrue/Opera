import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import ReactTooltip from 'react-tooltip';
import { renderGlyphicon } from './generics.jsx';

// Custom validation functions

export function isExperimentTitleValid (value) {
	// console.log('value: ' + value);
	// console.log('length: ' + value.length);
	// Current check:
	// - not empty
	// Less than 200 characters long
	return(
		(value !== '') && (value.length <= 200)
	);
}


export function	handleChangeExperimentTitleInput (field, newValue) {
	// console.log('newValue: ' + newValue);
	// console.log('props: ' + this.props.record);
	// console.log('check: ' + check);
	let isInitial = (newValue === this.props.record[field])
	// Update the Object (dictionary) that tracks non-initial fields in the parent form
	this.updateChangedInputs(field, isInitial, newValue);
	let isValid = isExperimentTitleValid(newValue);
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
			Meteor.call('experiments.countRecordsWithTitle', newValue, (err, res) => {
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

export default class ExperimentTitleInput extends Component {

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
				<ReactTooltip id='expName-tip' type='info' effect="solid" place="left">
				  <span>200 characters max.</span>
				</ReactTooltip>
				<label
					data-tip data-for='expName-tip'
					htmlFor={this.props.id}>{this.props.label}
				</label>
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

ExperimentTitleInput.propTypes = {
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
	countInDatabase: PropTypes.number.isRequired,

	// Update parent state
	onChange: PropTypes.func.isRequired,
};

ExperimentTitleInput.defaultProps = {
	placeholder: 'Placeholder text',
	className: 'input-file-path',
};
