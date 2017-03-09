import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Loading from './loading.jsx'

import { Sequencers } from '../api/sequencers.js';

class SequencersTable extends Component {

	constructor (props) {
		super(props);
		// this.state = {
		// 	paired: true
		// };
	}

	renderTable () {
		return(
			<table className='table sequencers-table'>
      	<thead>
      		<tr>
      			<th className='sequencer-field-label'>Label</th>
      			<th className='ssequencer-field-value'>Value in database</th>
      		</tr>
      	</thead>
      	<tbody>
      		{this.props.sequencers.map((sequencer) => (
      			<tr key={sequencer._id}>
      				<td>{sequencer.label}</td>
      				<td>{sequencer.value}</td>
      			</tr>
      		))}
      	</tbody>
      </table>
    );
	}


	render () {
		return(
			<div>
				<header><h1>Sequencers</h1></header>

				{ this.props.loading ? <Loading /> : this.renderTable() }
				
			</div>
		);
	}

}

SequencersTable.propTypes = {
};

SequencersTable.defaultProps = {
};

export default createContainer(() => {
	const subscription = Meteor.subscribe('sequencers');
	const loading = !subscription.ready();

	return {
	sequencers: Sequencers.find({}).fetch(),
	loading: loading,
	};
}, SequencersTable);
