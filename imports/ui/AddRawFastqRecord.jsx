import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { RadioGroup, Radio } from 'react-radio-group';

import RawFastqRecordPaired from './RawFastqRecordPaired.jsx';
import RawFastqRecordSingle from './RawFastqRecordSingle.jsx';

class AddRawFastqRecord extends Component {

	constructor (props) {
		super(props);
		this.state = {
			paired: true
		};
	}

	updatePaired (newValue) {
		this.setState({	paired: newValue });
		// console.log('paired: ' + newValue);
	}

  renderPairedRadio () {
  	// TODO: Twitter boootstrap appearance when react-bootstrap support is available
  	return(
  		<RadioGroup
        name="paired"
        selectedValue={ this.state.paired }
        onChange={ this.updatePaired.bind(this) }>
        <label><Radio value={false} />Single-end</label>&nbsp;
        <label><Radio value={true} />Paired-end</label>
      </RadioGroup>
		);
  }

	render () {
		return(
			<div>
				<header><h1>Raw FASTQ</h1></header>
				<header><h2>Add a single raw FASTQ record</h2></header>

				{ this.renderPairedRadio() }

				{ this.state.paired ? <RawFastqRecordPaired /> : <RawFastqRecordSingle /> }
				
			</div>
		);
	}

}

AddRawFastqRecord.propTypes = {
};

AddRawFastqRecord.defaultProps = {
};

export default createContainer(() => {

	return {
	};
}, AddRawFastqRecord);
