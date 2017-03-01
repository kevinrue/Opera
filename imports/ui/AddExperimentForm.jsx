import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Experiments } from '../api/experiments.js';

class AddExperimentForm extends Component {

	constructor(props) {
		super(props);
	}

	handleSubmit(event) {
	    event.preventDefault();
	 
	    // Find the text field via the React ref
	    const experimentName = ReactDOM.findDOMNode(this.refs.newExperimentName).value.trim();
	 
	    Meteor.call('experiments.insert', experimentName);
	 
	    // Clear form
	    ReactDOM.findDOMNode(this.refs.newExperimentName).value = '';
  }

	render () {

		let options = this.props.experiments.map((experiment) => (
			{label: experiment.name, value: experiment._id}
		));

		return (
			<div>
				<header><h2 className="section-heading">Add an experiment</h2></header>
	            <form className="new-experiment" onSubmit={this.handleSubmit.bind(this)} >
	              <input
	                type="text"
	                ref="newExperimentName"
	                placeholder="Type to add new experiments"
	              />
	            </form>
			</div>
		);
	}
};

AddExperimentForm.propTypes = {
	experiments: PropTypes.array.isRequired,
};

AddExperimentForm.defaultProps = {
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer(() => {
  return {
    experiments: Experiments.find({}).fetch()
  };
}, AddExperimentForm);
