import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Textarea from 'react-textarea-autosize';

import { Samples } from '/imports/api/samples/samples.js';

import { renderSubmitButton } from '/imports/ui/forms/generics.jsx';

import Loading from '/imports/ui/Loading.jsx';

class AddSampleBatchPage extends Component {

	constructor (props) {
		super(props);
		this.state = {
			inputTextValue: '',
		};
	}

	updateValue (event) {
		let textInput = event.target.value;
		this.setState({
			inputTextValue: textInput
		});
	}

	handleSubmit (event) {
		// Among others: do not reload the page
    event.preventDefault();
    // drop empty lines
    let dataLines = this.state.inputTextValue.split('\n').filter(
    	(textLine) => (textLine.trim() != '')
    );
    dataLines.map(inputLine => {
			inputFields = inputLine.split('\t');
			if (inputFields.length != 11){
				console.log(
					'Aborted: Expected 11 fields, found: ' + inputFields.length + '(' + inputLine + ')'
				);
				return(undefined);
			}
			return (
				Meteor.call(
					'samples.insert',
					inputFields,
					(err, res) => {
						if (!err){
							console.log('new identifier: ' + res);
							// TODO: it seems the stub only returns undefined
							// while the callback never returns the new ID
							return(res);
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

  renderSampleCount () {
  	return(
  		<p>
  			There are
  			currently { this.props.countSamples } samples
  			in the database.
  		</p>
  	);
  }

	render () {
		// console.log(this.refs);
		return(
			<div id='page'>
				<header><h1>Add batch of samples</h1></header>

				A description of the expected input is detailed below the <code>textarea</code> input.

				<header><h2>Add raw FASTQ records</h2></header>

				{this.props.loading ? <Loading /> : this.renderSampleCount()}

				<form onSubmit={this.handleSubmit.bind(this)} >
					<Textarea
						ref='myTextArea'
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
						Later used to assign assign a batch of FASTQ files to the sample.
					</li>
					<li>
						Name. <strong>Unique within an experiment</strong>.
						A short identifier of the sample within the experiment.
					</li>
					<li>
						Cell type / Tissue. <strong>Controlled</strong>.
						Name of a supported cell type or tissue. Refer to the database for valid choices.
					</li>
					<li>
						Genetic intervention. <strong>Controlled</strong>.
						In-house identifier of a genetic alternation applied to the cell type / tissue
						(<em>e.g.</em>, VHLKO).
					</li>
					<li>
						Condition. <strong>Controlled</strong>.
						Experimental variable
						(<em>e.g.</em>, <code>Hypoxia</code>).
					</li>
					<li>
						Concentration. <strong>Controlled</strong>.
						Concentration of the experimental variable; if applicable
						(<em>e.g.</em>, <code>1</code>).
					</li>
					<li>
						Unit. <strong>Controlled</strong>.
						Unit of concentration of the experimental variable; if applicable
						(<em>e.g.</em>, <code>%</code>).
					</li>
					<li>
						Duration. <strong>Numeric</strong>.
						Duration of exposure to the experimental variable <em>in hours</em>; if applicable
						(<em>e.g.</em>, <code>2</code>).
					</li>
					<li>
						ChIP antibody. <strong>Controlled</strong>.
						Name of a supported antibody used for ChIP; if applicable. Refer to the database for valid choices
						(<em>e.g.</em>, <code>HIF-2a (PM9)</code>).
					</li>
					<li>
						Notes. <strong>Free text</strong>.
						Information of special significance about the experiment.
					</li>
					<li>
						Experiment ID. <strong>Controlled</strong>.
						Public identifier of the experiment to assign the sample to.
					</li>
				</ol>
			</div>
		);
	}

}

AddSampleBatchPage.propTypes = {
};

AddSampleBatchPage.defaultProps = {
};

export default createContainer(() => {
	const user = Meteor.user();
	const subscription = Meteor.subscribe('samples');
  const loading = (user === undefined || !subscription.ready());

	return {
		currentUser: user, // pass as props so that it is fixed for this page
    countSamples: Samples.find({}).count(),
    loading: loading,
	};
}, AddSampleBatchPage);
