import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import ReactTooltip from 'react-tooltip';
import { Button } from 'react-bootstrap';

import { Platforms } from '/imports/api/platforms.js';

import Loading from '/imports/ui/Loading.jsx';

let classNames = require('classnames');

class AddPlatformForm extends Component {

	constructor (props) {
		// console.log(props);
		super(props);
		this.state = {
			platform: '',
			platformInitial: true, // do not show any glyphicon if initial
			platformValid: false, // for glyphicon & form validation
			platformCountInDatabase: null, // for glyphicon & asynchronous form validation
		};
	}

	handleChange (event) {
		// Note: do not trim here (otherwise names cannot contain space characters)
		let newValue = event.target.value;
		// console.log('newValue: ' + newValue);
		let isInitial = (newValue === this.props.platform);
		let isValid = (newValue !== '');

		this.setState({
			platform: newValue,
			platformInitial: isInitial,
			platformValid: isValid,
			platformCountInDatabase: this.positionInDatabase(newValue) + 1 // dummy value = 0 if not in database
		});
	}

	handleSubmit(event) {
    event.preventDefault();
 
    Meteor.call(
    	'platforms.insert',
    	this.state.platform,
    	(err, res) => {
    		if (err){
    			alert(err);
    		} else {
    			alert('New platform successfully added !');
    		}
    	}
    );
 
    // Clear form
    this.setState({
			platform: '',
			platformInitial: true,
			platformValid: false,
		});
  }

  isFormInitial () {
  	return(
  		this.state.platformInitial
  	);
  }

  // Returns '-1' if not in database
  positionInDatabase (name) {
  	// console.log('name: ' + name);
  	// console.log('props: ' + this.props.platforms);
  	// console.log('propType: ' + typeof(this.props.platforms));
  	// console.log('position: ' + this.props.platforms.indexOf(name));
  	return(
  		this.props.platforms.indexOf(name)
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
  	isInitial = this.state.platformInitial;
  	isValid = this.state.platformValid;
  	countInDatabase = this.state.platformCountInDatabase;
		// console.log('initial: ' + isInitial);
		// console.log('valid: ' + isValid);
		// console.log('countInDB: ' + countInDatabase);
		let buttonColour = (
			isInitial ? 'primary' : (
					!isValid ? 'danger' : (
						this.state.platformCountInDatabase ? 'warning' : 'success'
					)
			)
		);
		// console.log('buttonColour: ' + buttonColour);
		let disableButton = (
			isInitial || !this.state.platformValid || (this.state.platformCountInDatabase > 0)
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
				data-tip data-for={'submit-platform'}>
				{buttonText}
			</Button>
    );
	}

	render() {
    return (
    	<form className="new-platform" onSubmit={this.handleSubmit.bind(this)} >
    	<table className='table platforms-table'>
      	<tbody>
      		<tr>
      		<td className='platforms-add-name'>
      			<input
	      			className='input-file-path'
			        type="text"
			        ref="newPlatform"
			        placeholder="Type to add new platform"
			        value={this.state.platform}
			        onChange={this.handleChange.bind(this)}
			      />
      		</td>
      		<td className='platforms-add-check'>
      			{ this.renderGlyphicon(
	      				'platform-glyphicon',
	      				this.state.platformInitial,
	      				this.isFormValid(),
	      				this.state.platformCountInDatabase,
      			) }
      		</td>
      		<td className='platforms-add-button'>
      			{ this.renderSubmitButton() }
      		</td>
      		</tr>
      	</tbody>
      </table>
	    </form>
    );
  }

}

AddPlatformForm.propTypes = {
	platforms: PropTypes.array.isRequired,
};

AddPlatformForm.defaultProps = {
};

export default createContainer(() => {

	return {
	};
}, AddPlatformForm);
