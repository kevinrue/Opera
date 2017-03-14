import React, { Component, PropTypes } from 'react';

import DatePicker from 'react-datepicker';
import 'moment/locale/en-gb';

import { renderGlyphicon } from './generic.jsx';
import { momentToDate } from '/imports/ui/utils/datetime.jsx';

export function isDateRunValid (moment) {
	// Current check:
	return(
		moment !== undefined
	);
}

export function handleChangeDateRun (field, moment) {
	// console.log(moment);
	// console.log(this.props.value);
	let isInitial;
	let isValid;
	let momentDate = undefined;
	// when addinn a new record
	if (moment === null){ // DatePicker sends null if empty
		moment = undefined
		isInitial = (this.props.record.dateRun === undefined);
		isValid = false;
	} else {
		isInitial = (
			(this.props.record.dateRun === undefined) ? // props.value is undefined when adding a new record
				false : (
					moment.date() === this.props.record.dateRun.getDate() &&
					moment.month() === this.props.record.dateRun.getMonth() &&
					moment.year() === this.props.record.dateRun.getFullYear()
			)
		);
		// console.log('isInitial: ' + isInitial);
		isValid = isDateRunValid(moment);
		momentDate = momentToDate(moment);
	}
	this.updateChangedInputs(field, isInitial, momentDate);
	// console.log('isInitial: ' + isInitial);
	// console.log('isValid: ' + isValid);
	this.setState({
		[field]: moment, // save the moment() in the state
		[field + 'Date']: momentDate, // save Date() in database
		[field + 'IsInitial']: isInitial,
		[field + 'IsValid']: isValid,
	});
}

export default class DateInput extends Component {

	constructor (props) {
		super(props);

		this.handleChange = props.onChange.bind(this);
		this.handleChangeDatePicker = this.handleChangeDatePicker.bind(this);
	}

	// (DatePicker event) handleChange function for RawFastqRecord date run
	handleChangeDatePicker (newValue) {
		// console.log('newValue: ' + newValue);
		let field = this.props.id;
		// console.log('field: ' + field);
		this.handleChange(field, newValue);
	}

	render () {
		// console.log(this.props);

		return(
			<tr>
  			<td>
  				<label htmlFor={this.props.id}>{this.props.label}</label>
  			</td>
  			<td>
  				<DatePicker
  					selected={this.props.value}
						onChange={this.handleChangeDatePicker}
						locale="en-gb" // TODO: support more locales
						placeholderText={this.props.placeholder}
						maxDate={moment()}
						dateFormat="DD/MM/YYYY"
					/>
				</td>
				<td>
					{renderGlyphicon(
						this.props.id+'-tip',
						this.props.isInitial,
						this.props.isValid
					)}
				</td>
  		</tr>
		);
	}

}

DateInput.propTypes = {
	// HTML input
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,

	// Current value
	value: PropTypes.object,

	// Glyphicon
	isInitial: PropTypes.bool.isRequired,
	isValid: PropTypes.bool.isRequired,

	// Update parent state
	onChange: PropTypes.func.isRequired,
};

DateInput.defaultProps = {
	value: undefined,
	placeholder: 'Date of sequencing run',
};
