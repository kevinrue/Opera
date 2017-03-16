import React, { Component, PropTypes } from 'react';

import { Button } from 'react-bootstrap';
let classNames = require('classnames');

export function renderSubmitButton(isInitial, isComplete, isValid, isPending = false, isInDatabase = false) {
		// console.log('isInitial: ' + isInitial);
		// console.log('isComplete: ' + isComplete);
		// console.log('isValid: ' + isValid);
		// console.log('isPending: ' + isPending);
		// console.log('isInDatabase: ' + isInDatabase);
		let buttonColour = (
			isInitial ? 'primary' : (
				isPending ? 'warning' : (
					!isComplete ? 'warning' : (
						!isValid ? 'danger' : (
							isInDatabase ? 'danger' : 'success'
						)
					)
				)
			)
		);
		let disableButton = (
			isInitial ||
			isPending ||
			!isComplete ||
			!isValid ||
			isInDatabase
		);
		let buttonText = (
			isInitial ? 'Submit' : (
				isPending ? 'Please wait...' : (
					!isComplete ? 'Incomplete' : (
						!isValid ? 'Error!' : (
							isInDatabase ? 'Error!' : 'Submit!'
						)
					)
				)
			)
		);
		let buttonStyle = classNames(buttonColour, disableButton);
		return(
			<Button type="submit" bsStyle={buttonColour} disabled={disableButton}>{buttonText}</Button>
    );
}

export function updateChangedInputs (inputName, isInitial, newValue = undefined) {
	// console.log(inputName);
	// console.log(isInitial);
	// console.log(newValue);
	let changedInputs = this.state.changedInputs;
	if (isInitial) {
		delete changedInputs[inputName];
		this.setState({
			changedInputs: changedInputs,
		});
	} else {
		changedInputs[inputName] = newValue;
		this.setState({
			changedInputs: changedInputs,
		});
	}
}
