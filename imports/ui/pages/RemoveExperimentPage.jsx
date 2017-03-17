import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Select from 'react-select';
import { Button } from 'react-bootstrap';

import { Experiments } from '/imports/api/experiments/experiments.js';

class RemoveExperimentPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			disable: false,
			searchable: this.props.searchable,
			selectedExperimentId: '',
			clearable: true,
		};
		// React components using ES6 classes no longer autobind this to non React methods
		// See 'onChange' prop of the Select component below
		//this.updateValue = this.updateValue.bind(this);
	}

	updateValue (newValue) {
		// console.log('Experiment id changed to ' + newValue);
		this.setState({
			selectedExperimentId: newValue
		});
	}

	handleSubmit(event) {
		// Among others: do not reload the page
	    event.preventDefault();

	    // console.log('Remove experiment with ID: ' + this.state.selectedExperimentId);
	    // console.log(Experiments.findOne({ _id: this.state.selectedExperimentId }));
	 
	 	Meteor.call('experiments.remove', this.state.selectedExperimentId);
	 
	    // Clear form
	    this.setState({selectedExperimentId: ''});
  	}

	render () {

		let options = this.props.experiments.map((experiment) => (
			{label: experiment.name, value: experiment._id}
		));

		return (
			<div id='page'>
				<header><h1>Experiments</h1></header>
				<p>There are currently {this.props.experiments.length} experiments in the database.</p>
				<header><h2>{this.props.label}</h2></header>
				<p>
          Below is a dropdown menu that lists all existing experiments;
          it is accompanied by a button that causes the selected experiment to be deleted.
          The dropdown widget is searchable: users may type in the widget,
          and the list of options will be dynamically restricted to present
          only experiments with a name that matches the typed text.
        </p>
        <form className="delete-experiment" onSubmit={this.handleSubmit.bind(this)} >
					<Select
						options={options}
						ref='deleteExperiment'
						simpleValue
						clearable={this.state.clearable}
						name="selected-experiment"
						disabled={this.state.disabled}
						value={this.state.selectedExperimentId}
						onChange={this.updateValue.bind(this)}
						searchable={this.state.searchable}
					/>
					<br/>
					<Button type="submit" bsStyle="danger">Danger</Button>
				</form>
			</div>
		);
	}
};

RemoveExperimentPage.propTypes = {
	label: React.PropTypes.string,
	searchable: React.PropTypes.bool,
	experiments: PropTypes.array.isRequired,
};

RemoveExperimentPage.defaultProps = {
	label: 'Delete an experiment',
	searchable: true
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer(() => {
	Meteor.subscribe('experiments');

  return {
    experiments: Experiments.find({}).fetch()
  };
}, RemoveExperimentPage);