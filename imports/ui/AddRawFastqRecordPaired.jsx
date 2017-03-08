import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import RawFastqRecordPaired from './RawFastqRecordPaired.jsx';

class AddRawFastqRecordPaired extends Component {

	constructor (props) {
		super(props);
		this.state = {
		};
	}

  renderForm () {
  	return(
  		<RawFastqRecordPaired /> 
		);
  }

	handleSubmit (event) {
	// Among others: do not reload the page
    event.preventDefault();
	}

	render () {
		return(
			<div>

				{this.renderForm()}
				
			</div>
		);
	}

}

AddRawFastqRecordPaired.propTypes = {
};

AddRawFastqRecordPaired.defaultProps = {
};

export default createContainer(() => {

	return {
	};
}, AddRawFastqRecordPaired);
