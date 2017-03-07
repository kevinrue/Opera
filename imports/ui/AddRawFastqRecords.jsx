import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Textarea from 'react-textarea-autosize';

import { RawFastqRecords } from '../api/raw-fastq-records.js';

class AddRawFastqRecords extends Component {

	constructor (props) {
		super(props);
		this.state = {
			inputTextRawFastq: ''
		};
	}

	updateValue (event) {
		let textInput = event.target.value;
		this.setState({
			inputTextRawFastq: textInput
		});
		//console.log("textInput: <" + textInput + ">");
		// Keep only lines that are not empty after trimming
		let textLines = textInput.split(
			"\n").filter(
				(textLine) => (textLine.trim() != '')
		);
		console.log("Non empty lines: " + textLines.length);
		// Input lines cannot have:
		// more than 1 TAB symbol
		// TODO: check that none of the new paths exist in the database already
		console.log("Valid input? " + textLines.every(
			(textLine) => (
				textLine.trim().split(',').length < 3
			)
		));
		//console.log("<" + textLines[0] + ">");
	}

	handleSubmit (event) {
		// Among others: do not reload the page
	    event.preventDefault();
	    // Split by newline
	    let textInput = this.state.inputTextRawFastq;
	    // Trim a possible trailing blank line at either end of each line
	    let trimmedLines = textInput.split(
			"\n").filter(
				(textLine) => (textLine.trim() != '')
		);
		// TODO: check that all file names end in 'fastq.gz'
		// str.endsWith(searchString[, position])
		//let paired = trimmedLines.map(inputLine => inputLine.split('\t').length > 1);
		//console.log(paired);
		let insertedRecords = trimmedLines.map(inputLine => {
			fList = inputLine.split(',')
			nFiles = fList.length;
			//console.log(nfiles);
			if (nFiles == 1) {
				return (Meteor.call('rawFastqs.insertSingleEnd', inputLine));
			}
			else {
				return (Meteor.call('rawFastqs.insertPairedEnd', fList[0], fList[1]));
			}
		});
		console.log(insertedRecords);
  	}

	render () {
		return(
			<div>
				<header><h1>Raw FASTQ</h1></header>
				<header><h2>Add raw FASTQ records</h2></header>
				<form onSubmit={this.handleSubmit.bind(this)} >
					<Textarea
					    minRows={3}
					    maxRows={10}
					    style={{
					    	whiteSpace: "nowrap", // do not soft-wrap lines
					    	fontFamily: '"Courier New", Courier, monospace',
					    	maxHeight: 250,
					    	width: "80%",
					    	marginLeft:"5%",
					    	marginRight:"5%",
					    }}
					    placeholder="Paste comma (,)-delimited file paths here..."
					    value = {this.state.inputTextRawFastq}
					    onChange={this.updateValue.bind(this)}
					/><br/>
					<button type="submit" className="btn btn-danger">Add</button>
				</form>
			</div>
		);
	}

}

AddRawFastqRecords.propTypes = {
	inputTextRawFastq: PropTypes.string,
};

AddRawFastqRecords.defaultProps = {
	inputTextRawFastq: '',
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer(() => {
	Meteor.subscribe('rawFastqRecords');

	return {
		rawFastqAllCount: RawFastqRecords.find({}).count(),
	};
}, AddRawFastqRecords);
