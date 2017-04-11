import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Textarea from 'react-textarea-autosize';

import { Experiments } from '/imports/api/experiments/experiments.js';

import { renderSubmitButton } from '/imports/ui/forms/generics.jsx';

import Loading from '/imports/ui/Loading.jsx';

class AddExperimentBatchPage extends Component {

	constructor (props) {
		super(props);
		this.state = {
			inputTextValue: '',
		};
	}

	updateValue (event) {
		let textInput = event.target.value;
		this.setState({
			inputLines: textInput
		});
	}

	handleSubmit (event) {
		// Among others: do not reload the page
    event.preventDefault();
    // drop empty lines
    let dataLines = this.state.inputLines.split('\n').filter(
    	(textLine) => (textLine.trim() != '')
    );
    dataLines.map(inputLine => {
			inputFields = inputLine.split('\t');
			if (inputFields.length != 7){
				console.log(
					'Aborted: Expected 7 fields, found: ' + inputFields.length + ' (' + inputLine + ')'
				);
				return(undefined);
			}
			newId = inputFields[0];
			newTitle = inputFields[1];
			newType = inputFields[2];
			newOrganism = inputFields[3];
			newContact = inputFields[4];
			newDescription = inputFields[5];
			newNotes = inputFields[6];
			return (
				Meteor.call(
					'experiments.insert',
					newId,
					newTitle,
					newType,
					newOrganism,
					newContact,
					newDescription,
					newNotes,
					(err, res) => {
						if (!err){
							console.log('new identifier: ' + res);
							// Return the identifier if successully added
							// return(res);
						}
					}
				)
			);
		});
		// Reset form
		this.setState({
			inputTextValue: '',
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

	render () {
		return(
			<div id='page'>
				<header><h1>Add batch of experiments</h1></header>

				<p>A description of the expected input is detailed below the <code>textarea</code> input.</p>

				<header><h2>Add raw FASTQ records</h2></header>

				{this.props.loading ? <Loading /> : this.renderExperimentCount()}

				<form onSubmit={this.handleSubmit.bind(this)} >
					<Textarea
					    minRows={3}
					    maxRows={10}
					    style={{
					    	whiteSpace: "nowrap", // do not soft-wrap lines, collapse consecutive ' ' into a single one
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
					{
	      	renderSubmitButton(
	      		false,
	      		true,
	      		true,
	      		false,
	      		false)
	      	}
				</form>

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
	inputTextValue: PropTypes.string,
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
