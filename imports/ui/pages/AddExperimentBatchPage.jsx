import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Textarea from 'react-textarea-autosize';

import { Experiments } from '/imports/api/experiments/experiments.js';

import { ButtonToolbar, Button } from 'react-bootstrap';

import Loading from '/imports/ui/Loading.jsx';

class AddExperimentBatchPage extends Component {

	constructor (props) {
		super(props);
		this.state = {
			inputTextValue: '',
			latestImportError: null,
		};
	}

	updateValue (event) {
		let textInput = event.target.value;
		// console.log(textInput);
		this.setState({
			inputTextValue: textInput
		});
	}

	handleSubmit (event) {
		// Among others: do not reload the page
    event.preventDefault();
    // Pass list of data lines to the insert method
    let dataLines = this.state.inputTextValue.split('\n');
		let newIdentifiers = Meteor.call(
			'experiments.insertBatch',
			dataLines,
			(err, res) => {
				if (!err){
					this.setState({
						latestImportError: null
					});
					console.log('handleSubmit res: ' + res);
				} else {
					this.setState({
						latestImportError: err
					});
				}
			}
		)
  }

  handleReset (event) {
		// Reset form
		this.setState({
			inputTextValue: '',
			latestImportError: null,
		});
  }

  renderExperimentCount () {
  	return(
  		<p>
  			There are
  			currently {this.props.countExperiments} experiments
  			in the database.
  		</p>
  	);
  }

  renderLatestImportError () {
  	// console.log(this.state.latestImportError);
  	return(
  		<p className={'msg-' + this.state.latestImportError.error}>
  			<code>Error: {this.state.latestImportError.reason}</code>
  		</p>
  	);
  }

	render () {
		return(
			
			<div id='page'>
				<header><h1>Add batch of experiments</h1></header>

				<p>A description of the expected input is detailed below the <code>textarea</code> input.</p>

				<header><h2>Form</h2></header>

				{this.props.loading ? <Loading /> : this.renderExperimentCount()}

				<form onSubmit={this.handleSubmit.bind(this)} onReset={this.handleReset.bind(this)}>
					<Textarea
					    minRows={3}
					    maxRows={10}
					    style={{
					    	whiteSpace: "nowrap", // do not soft-wrap lines, collapse consecutive ' ' into a single one; NOTE: does not work with TAB
					    	fontFamily: '"Courier New", Courier, monospace',
					    	maxHeight: 250,
					    	width: "95%",
					    	marginLeft:"1%",
					    	marginRight:"4%",
					    }}
					    placeholder="
					    	Paste TAB-delimited information here..."
					    value = {this.state.inputTextValue}
					    onChange={this.updateValue.bind(this)}
					/>
					<ButtonToolbar>
						<Button type="submit" bsStyle='success' disabled={this.state.inputTextValue === ''}>Submit</Button>
						<Button type="reset" bsStyle='warning' disabled={this.state.inputTextValue === ''}>Reset</Button>
					</ButtonToolbar>
				</form>

				{ this.state.latestImportError ? this.renderLatestImportError() : '' }

				<header><h2>Expected input by column</h2></header>

				<ol>
					<li>
						Public identifier. <strong>Unique</strong>.
						Later used to assign assign a batch of samples to the experiment.
					</li>
					<li>
						Title. <strong>Unique</strong>.
						A short description of the experiment.
					</li>
					<li>
						Organism. <strong>Controlled</strong>.
						Name of a supported organism. Refer to the database for valid choices.
					</li>
					<li>
						Contact. <strong>Controlled</strong>.
						Identifier of the user responsible for the experiment, samples, and files.
					</li>
					<li>
						Description. <strong>Free text</strong>.
						A more detailed description of the experiment.
					</li>
					<li>
						Notes. <strong>Free text</strong>.
						Information of special significance about the experiment.
					</li>
				</ol>
			</div>
		);
	}

}

AddExperimentBatchPage.propTypes = {
	currentUser: PropTypes.object,
	countExperiments: PropTypes.number,
	loading: PropTypes.bool,
};

AddExperimentBatchPage.defaultProps = {
	inputTextValue: '',
};

export default createContainer(() => {
	const user = Meteor.user();
	const subscription = Meteor.subscribe('experiments');
  const loading = (user === undefined || !subscription.ready());

	return {
		currentUser: user, // pass as props so that it is fixed for this page
    countExperiments: Experiments.find({}).count(),
    loading: loading,
	};
}, AddExperimentBatchPage);
