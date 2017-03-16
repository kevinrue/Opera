import React, { Component, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';

let classNames = require('classnames');

// Return a Glyphicon with ReactTooltip according to:
// isInitial, isValid, countInDatabase
export function renderGlyphicon (id, isInitial, isValid, countInDatabase = 0) { // can use function for database-independent input
	// console.log('id: ' + id);
	// console.log('isInitial: ' + isInitial);
	// console.log('isValid: ' + isValid);
	// console.log('countInDatabase: ' + countInDatabase);
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
			<ReactTooltip id={id} type={tooltipType} effect="solid" place="left">
			  <span>{tooltipText}</span>
			</ReactTooltip>
			<span className={glyphiconClass} aria-hidden="true" data-tip data-for={id}></span>
		</div>
	);
}
