import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Experiments } from '/imports/api/experiments.js';

class AddExperimentPage extends Component {

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
				<header><h1>Experiments</h1></header>
				<p>There are currently {this.props.experiments.length} experiments in the database.</p>
				<header><h2>Add an experiment</h2></header>
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

AddExperimentPage.propTypes = {
	experiments: PropTypes.array.isRequired,
};

AddExperimentPage.defaultProps = {
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer(() => {
	Meteor.subscribe('experiments');
	
  return {
    experiments: Experiments.find({}).fetch()
  };
}, AddExperimentPage);
