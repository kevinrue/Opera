import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import ReactTooltip from 'react-tooltip';
import { Button } from 'react-bootstrap';

// Form validation
import { updateChangedInputs, renderSubmitButton } from './generics.jsx';
// Input half-dumb components (display & client-side validation)
import ExperimentTitleInput, { handleChangeExperimentTitleInput } from './inputs/ExperimentTitleInput.jsx';

import { Platforms } from '/imports/api/experiments/experiments.js';

import Loading from '/imports/ui/Loading.jsx';

let classNames = require('classnames');

class AddExperimentForm extends Component {

	constructor (props) {
		// console.log(props);
		super(props);
		this.state = {
			experimentTitle: '',
			experimentTitleIsInitial: true, // do not show any glyphicon if initial
			experimentTitleIsValid: false, // for glyphicon & form validation
			experimentTitleCountInDatabase: 0, // for glyphicon & asynchronous form validation

			changedInputs: {},
		};

		this.updateChangedInputs = updateChangedInputs.bind(this);

		this.handleChangeExperimentTitleInput = handleChangeExperimentTitleInput.bind(this);
	}

	handleChange (event) {
		// Note: do not trim here (otherwise names cannot contain space characters)
		let newValue = event.target.value;
		// console.log('newValue: ' + newValue);
		let isInitial = (newValue === this.props.experiment);
		let isValid = (newValue !== '');

		this.setState({
			experimentTitle: newValue,
			experimentInitial: isInitial,
			experimentIsValid: isValid,
			experimentTitleCountInDatabase: this.positionInDatabase(newValue) + 1 // dummy value = 0 if not in database
		});
	}

	handleSubmit(event) {
    event.preventDefault();
 
    Meteor.call(
    	'experiments.insert',
    	this.state.experimentTitle,
    	(err, res) => {
				if (err){
					alert(err);
				} else {
					alert('New experiment added successfully!');
					this.resetForm();
				}
			}
    );
  }

  isFormInitial () {
  	return(
  		this.state.experimentTitleIsInitial
  	);
  }

  isFormValid () {
  	return(
  		true
  	);
  }

  resetForm () {
		this.setState({
			experimentTitle: '',
			experimentTitleIsInitial: true,
			experimentTitleIsValid: false,
			experimentTitleCountInDatabase: 0,

			changedInputs: {},
		})
	}

	render () {
		console.log(this.state);
		// TODO: error if title of new experiment already exists

		return (
      <form className="new-experiment" onSubmit={this.handleSubmit.bind(this)} >
	      <table className='table new-experiment-table'>
		      <thead>
	      		<tr>
	      			<th className='new-experiment-field'>Field</th>
	      			<th className='new-experiment-value'>Value</th>
	      			<th className='new-experiment-check'>Check</th>
	      		</tr>
	      	</thead>
	      	<tbody>
		      	
		      	<ExperimentTitleInput
							id='experimentTitle'
							label='Title'
							placeholder='Experiment title'

							value={this.state.experimentTitle}

							isInitial={this.state.experimentTitleIsInitial}
							isValid={this.state.experimentTitleIsValid}
							countInDatabase={this.state.experimentTitleCountInDatabase}

							onChange={this.handleChangeExperimentTitleInput}
						/>
	      	</tbody>
	      </table>
      </form>
		);
	}

}

AddExperimentForm.propTypes = {
	record: PropTypes.object,
};

AddExperimentForm.defaultProps = {
	record: {
		_id: undefined,
		title: '',
	}
};

export default createContainer(() => {

	return {
	};
}, AddExperimentForm);
