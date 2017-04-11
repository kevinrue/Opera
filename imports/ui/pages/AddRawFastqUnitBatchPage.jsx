import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Textarea from 'react-textarea-autosize';

import { RawFastqUnits } from '/imports/api/raw-fastq-units/raw-fastq-units.js';

import { renderSubmitButton } from '/imports/ui/forms/generics.jsx';

import Loading from '/imports/ui/Loading.jsx';

class AddRawFastqUnitBatchPage extends Component {

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
			if (inputFields.length != 10){
				console.log(
					'Aborted: Expected 10 fields, found: ' + inputFields.length + ' (' + inputLine + ')'
				);
				return(undefined);
			}
			return (
				Meteor.call(
					'rawFastqUnits.insert',
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

  renderRawFastqUnitCount () {
  	return(
  		<p>
  			There are
  			currently { this.props.countRawFastqUnits } raw FASTQ units
  			in the database.
  		</p>
  	);
  }

	render () {
		// console.log(this.refs);
		return(
			<div id='page'>
				<header><h1>Add batch of raw FASTQ units</h1></header>

				<p>A description of the expected input is detailed below the <code>textarea</code> input.</p>

				<header><h2>Form</h2></header>

				{this.props.loading ? <Loading /> : this.renderRawFastqUnitCount()}

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
						First mate. <strong>Required; Free text</strong>.
						Path to the FASTQ file that contains the first (or only) sequenced end of RNA framgents.
					</li>
					<li>
						Second mate. <strong>Free text</strong>.
						Path to the FASTQ file that contains the second sequenced end of paired-end RNA framgents.
					</li>
					<li>
						Paired. <strong>Y/N</strong>.
						Declares whether a pair of files should be expected (<code>Y</code>) or not (<code>N</code>).
					</li>
					<li>
						Read length. <strong>Numeric</strong>.
						Length of sequenced reads.
					</li>
					<li>
						Sequencer. <strong>Controlled</strong>.
						Type of sequencer that produced the reads (<em>e.g.</em>, <code>HiSeq2000</code>).
					</li>
					<li>
						Date run. <strong>DD/</strong>.
						Concentration of the experimental variable; if applicable
						(<em>e.g.</em>, <code>1</code>).
					</li>
					<li>
						Project number / sequencing run. <strong>Free text</strong>.
						Typically, the WTCHG project number that defines the sequencing run which produced the file(s).
						<em>Useful for quality control and batch correction across multiple runs.</em>
					</li>
					<li>
						Lane. <strong>Free text</strong>.
						Name of the lane on which libraries were sequenced.
						<em>Useful for quality control and batch correction across multiple lanes.</em>
					</li>
					<li>
						Notes. <strong>Free text</strong>.
						Information of special significance about the experiment.
					</li>
					<li>
						Sample ID. <strong>Controlled</strong>.
						Public identifier of the sample to assign this raw FASTQ unit to.
					</li>
				</ol>
			</div>
		);
	}

}

AddRawFastqUnitBatchPage.propTypes = {
	currentUser: PropTypes.object,
	countRawFastqUnits: PropTypes.number,
	loading: PropTypes.bool,
};

AddRawFastqUnitBatchPage.defaultProps = {
};

export default createContainer(() => {
	const user = Meteor.user();
	const subscription = Meteor.subscribe('rawFastqUnits');
  const loading = (user === undefined || !subscription.ready());

	return {
		currentUser: user, // pass as props so that it is fixed for this page
    countRawFastqUnits: RawFastqUnits.find({}).count(),
    loading: loading,
	};
}, AddRawFastqUnitBatchPage);
