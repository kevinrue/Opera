// Meteor
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
// Third-party modules
import Select from 'react-select';
// Database subscriptions
import { Sequencers } from '/imports/api/sequencers.js';
// Form validation
import { renderGlyphicon } from './generic.jsx';

import Loading from '/imports/ui/loading.jsx';

export function isSequencerValid (newValue) {
	// console.log(newValue);
	// Current check:
	return(
		newValue !== undefined
	);
}

export function	handleChangeSequencer (field, newValue) {
	// console.log(this.props); // this is the parent form
	// console.log('newValue: ' + String(newValue)); // either String(value) or Object{label, value}
	let isInitial = (newValue === this.props.record.sequencerId);
	this.updateChangedInputs(field, isInitial, newValue);
	let isValid = isSequencerValid(newValue);

	this.setState({
		[field]: newValue,
		[field + 'IsInitial']: isInitial,
		[field + 'IsValid']: isValid,
	});
}

class SequencerDropdownInput extends Component {

	constructor (props) {
		super(props);

		this.handleChange = props.onChange.bind(this);
		this.handleChangeSelect = this.handleChangeSelect.bind(this);
	}

	// (Select event) handleChange function for RawFastqRecord sequencer dropdown
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
		let options = this.props.sequencers.map((sequencer) => (
			{label: sequencer.name, value: sequencer._id}
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

SequencerDropdownInput.propTypes = {
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

SequencerDropdownInput.defaultProps = {
	placeholder: 'Read length',
	value: undefined,
};

export default createContainer((  ) => {
	const subscription = Meteor.subscribe('sequencers');
	const loading = !subscription.ready();

	return {
		sequencers: Sequencers.find({}).fetch(),
		loading: loading,
	};
}, SequencerDropdownInput);
