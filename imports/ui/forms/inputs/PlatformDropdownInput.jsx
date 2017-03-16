// Meteor
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
// Third-party modules
import Select from 'react-select';
// Database subscriptions
import { Platforms } from '/imports/api/platforms.js';
// Form validation
import { renderGlyphicon } from './generics.jsx';

import Loading from '/imports/ui/loading.jsx';

export function isPlatformValid (newValue) {
	// console.log(newValue);
	// Current check:
	return(
		newValue !== undefined
	);
}

export function	handleChangePlatform (field, newValue) {
	// console.log(this.props); // this is the parent form
	// console.log('newValue: ' + String(newValue)); // either String(value) or Object{label, value}
	let isInitial = (newValue === this.props.record.plaformId);
	this.updateChangedInputs(field, isInitial, newValue);
	let isValid = isPlatformValid(newValue);

	this.setState({
		[field]: newValue,
		[field + 'IsInitial']: isInitial,
		[field + 'IsValid']: isValid,
	});
}

class PlatformDropdownInput extends Component {

	constructor (props) {
		super(props);

		this.handleChange = props.onChange.bind(this);
		this.handleChangeSelect = this.handleChangeSelect.bind(this);
	}

	// (Select event) handleChange function for RawFastqRecord plaform dropdown
	handleChangeSelect (newValue) {
		// event.persist();
		// console.log(event);
		let field = this.props.id;
		console.log(field);
		this.handleChange(field, newValue);
	}

	render () {
		// console.log(this.props.value);
		// console.log(typeof(this.props.value));
		let options = this.props.platforms.map((plaform) => (
			{label: plaform.name, value: plaform._id}
		));
		// console.log(options);
		return(
			<tr>
  			<td>
  				<label htmlFor={this.props.id}>{this.props.label}</label>
  			</td>
  			<td>
  				{ this.props.loading ? <Loading /> : <Select
  					id={this.props.id}
						options={options}
						simpleValue
						clearable={false}
						name={this.props.id}
						value={this.props.value}
						onChange={this.handleChangeSelect}
						searchable={true}
					/> }
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

PlatformDropdownInput.propTypes = {
	// HTML input
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,

	// Current value
	value: PropTypes.string,

	// Glyphicon
	isInitial: PropTypes.bool.isRequired,
	isValid: PropTypes.bool.isRequired,

	// Update parent state
	onChange: PropTypes.func.isRequired,
};

PlatformDropdownInput.defaultProps = {
	placeholder: 'Read length',
	value: undefined,
};

export default createContainer((  ) => {
	const subscription = Meteor.subscribe('platforms');
	const loading = !subscription.ready();

	return {
		platforms: Platforms.find({}).fetch(),
		loading: loading,
	};
}, PlatformDropdownInput);
