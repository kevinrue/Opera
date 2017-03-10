import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import ReactTooltip from 'react-tooltip';
import { Button } from 'react-bootstrap';

import { Sequencers } from '../api/sequencers.js';

import Loading from './loading.jsx'

let classNames = require('classnames');

class AddSequencerForm extends Component {

	constructor (props) {
		// console.log(props);
		super(props);
		this.state = {
			sequencer: '',
			sequencerInitial: true, // do not show any glyphicon if initial
			sequencerValid: false, // for glyphicon & form validation
			sequencerCountInDatabase: null, // for glyphicon & asynchronous form validation
		};
	}

	handleChange (event) {
		// Note: do not trim here (otherwise names cannot contain space characters)
		let newValue = event.target.value;
		// console.log('newValue: ' + newValue);
		let isInitial = (newValue === this.props.sequencer);
		let isValid = (newValue !== '');

		this.setState({
			sequencer: newValue,
			sequencerInitial: isInitial,
			sequencerValid: isValid,
			sequencerCountInDatabase: this.positionInDatabase(newValue) + 1 // dummy value = 0 if not in database
		});
	}

	handleSubmit(event) {
    event.preventDefault();
 
    Meteor.call(
    	'sequencers.insert',
    	this.state.sequencer,
    	(err, res) => {
    		if (err){
    			alert(err);
    		} else {
    			alert('New sequencer successfully added !');
    		}
    	}
    );
 
    // Clear form
    this.setState({
			sequencer: '',
		});
  }

  isFormInitial () {
  	return(
  		this.state.sequencerInitial
  	);
  }

  // Returns '-1' if not in database
  positionInDatabase (name) {
  	// console.log('name: ' + name);
  	// console.log('props: ' + this.props.sequencers);
  	// console.log('propType: ' + typeof(this.props.sequencers));
  	// console.log('position: ' + this.props.sequencers.indexOf(name));
  	return(
  		this.props.sequencers.indexOf(name)
  	);
  }

  isFormValid () {
  	return(
  		true
  	);
  }

  // Note: duplicated with RawFastqRecordSingle
	renderGlyphicon (id, isInitial, isValid, countInDatabase = 0) { // can use function for database-independent input
		// console.log('inDB: ' + countInDatabase);
		let glyphiconCheck = (
			isInitial ? '' : (
				!isValid ? 'glyphicon-remove' : ( // invalid 
					countInDatabase === -1 ? 'glyphicon-hourglass' : ( // waiting for server
						countInDatabase === 0 ? 'glyphicon-ok' : 'glyphicon-warning-sign'
					)
				)
			)
		);
		let glyphiconClass = classNames('glyphicon', glyphiconCheck);
		let tooltipText = (
			isInitial ? '' : (
				!isValid ? 'Invalid!' : ( // invalid 
					countInDatabase === -1 ? 'Checking database...' : ( // waiting for server
						countInDatabase === 0 ? 'All good!' : 'Matches an existing record in database'
					)
				)
			)
		);
		let tooltipType = (
			isInitial ? 'dark' : (
				!isValid ? 'error' : ( // invalid 
					countInDatabase === -1 ? 'info' : ( // waiting for server
						countInDatabase === 0 ? 'success' : 'warning'
					)
				)
			)
		);
		// console.log('tooltipText: ' + tooltipText);
		// console.log('tooltipType: ' + tooltipText);
		return(
			<div>
				<ReactTooltip id={id} type={tooltipType} effect="solid" place="top">
				  <span>{tooltipText}</span>
				</ReactTooltip>
				<span className={glyphiconClass} aria-hidden="true" data-tip data-for={id}></span>
			</div>
		);
	}

  renderSubmitButton () {
  	isInitial = this.state.sequencerInitial;
  	isValid = this.state.sequencerValid;
  	countInDatabase = this.state.sequencerCountInDatabase;
		// console.log('initial: ' + isInitial);
		// console.log('valid: ' + isValid);
		// console.log('countInDB: ' + countInDatabase);
		let buttonColour = (
			isInitial ? 'primary' : (
					!isValid ? 'danger' : (
						this.state.sequencerCountInDatabase ? 'warning' : 'success'
					)
			)
		);
		// console.log('buttonColour: ' + buttonColour);
		let disableButton = (
			isInitial || !this.state.sequencerValid || (this.state.sequencerCountInDatabase > 0)
		);
		let buttonText = (
			isInitial ? 'Submit' : (
				!isValid ? 'Invalid!' : 'Submit!'
			)
		);
		let buttonStyle = classNames(buttonColour);

		return(
			<Button
				type="submit" bsStyle={buttonColour} disabled={disableButton}
				data-tip data-for={'submit-sequencer'}>
				{buttonText}
			</Button>
    );
	}

	render() {
    return (
    	<form className="new-sequencer" onSubmit={this.handleSubmit.bind(this)} >
    	<table className='table sequencers-table'>
      	<tbody>
      		<tr>
      		<td className='sequencers-add-name'>
      			<input
	      			className='input-file-path'
			        type="text"
			        ref="newSequencer"
			        placeholder="Type to add new sequencer"
			        value={this.state.sequencer}
			        onChange={this.handleChange.bind(this)}
			      />
      		</td>
      		<td className='sequencers-add-check'>
      			{ this.renderGlyphicon(
	      				'sequencer-glyphicon',
	      				this.state.sequencerInitial,
	      				this.isFormValid(),
	      				this.state.sequencerCountInDatabase,
      			) }
      		</td>
      		<td className='sequencers-add-button'>
      			{ this.renderSubmitButton() }
      		</td>
      		</tr>
      	</tbody>
      </table>
	    </form>
    );
  }

}

AddSequencerForm.propTypes = {
	sequencers: PropTypes.array.isRequired,
};

AddSequencerForm.defaultProps = {
	sequencer: '',
};

export default createContainer(() => {

	return {
	};
}, AddSequencerForm);
