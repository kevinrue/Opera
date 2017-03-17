import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';

import { ButtonToolbar, Button } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'moment/locale/en-gb';

import { RawFastqRecords } from '/imports/api/raw-fastq-records/raw-fastq-records.js';
import { Platforms } from '/imports/api/platforms.js';

import Loading from '/imports/ui/Loading.jsx';

class RawFastqTablePage extends Component {

	constructor (props) {
		super(props);
	}

  goToAddRawFastqOne() {
    browserHistory.push('/rawFastq/addOne');
  }

	goToAddRawFastqBatch() {
    browserHistory.push('/rawFastq/addBatch');
  }

  renderOverview(){
  	return(
  		<div>
				<p>There are {this.props.rawFastqAllCount} records in the database.</p>

				<ul>
					<li>Paired-end records: {this.props.rawFastqPairedCount}.</li>
					<li>Single-end records: {this.props.rawFastqSingleCount}.</li>
				</ul>
			</div>
  	);
  }

  recordLinkFormatter(cell, row) {
    const link = <a href={"/rawFastq/" + cell}>{cell}</a>;
    return link;
	}

	dateFormatter (cell, row) {
	  return(
	  	moment(cell).format('YYYY-MM-DD')
	  );
	}

	platformFormatter (cell, row, collection) {
		// console.log('cell: ' + cell);
		// console.log('collection: ' + collection);
	  return(
	  	collection[cell] 
	  );
	}

  renderRecordTable() {
  	// console.log(this.props.platforms);
  	let platformsEnum = _.object(_.map(this.props.platforms, (platform) => {return([platform._id, platform.name])}));
  	// console.log(platformsEnum);

  	return(
  		<BootstrapTable data={this.props.rawFastqAll} striped={true} hover={true} pagination={true}>
	      <TableHeaderColumn
	      	dataField="_id" dataFormat={ this.recordLinkFormatter } isKey={true} dataAlign="center" width="10%">
	      	ID
	      </TableHeaderColumn>
	      <TableHeaderColumn
	      	dataField="paired" dataAlign="center" width="15%" dataSort={true}
	      	filter={ { type: 'SelectFilter', options: {true, false} } }>
	      	Paired
	      </TableHeaderColumn>
	      <TableHeaderColumn
	      	dataField="readLength" dataAlign="center" width="15%" dataSort={true}
	      	filter={ { 
            type: 'NumberFilter', 
            delay: 1000, 
            numberComparators: [ '=', '>=', '<='] 
          } }>
	      	Read length
	      </TableHeaderColumn>
	      <TableHeaderColumn
	      	dataField="platformId" dataAlign="center" width="20%" dataSort={true}
	      	dataFormat={ this.platformFormatter } formatExtraData={ platformsEnum }
	      	filter={ { type: 'SelectFilter', options: platformsEnum } }>
	      	Platform
	      </TableHeaderColumn>
	      <TableHeaderColumn
	      	dataField="dateRun" dataAlign="center" width="40%" dataSort={true} dataFormat={ this.dateFormatter }
	      	filter={ { type: 'DateFilter' } }>
	      	Date run
	      </TableHeaderColumn>
		  </BootstrapTable>
		 );
  }

  renderMainPanel() {
  	return(
  		<div className='main-panel'>
  			<header><h1>Raw FASTQ</h1></header>
  			
  			<header><h2>Overview</h2></header>

				{ this.props.loading ? <Loading /> : this.renderOverview() }

				<header><h2>Complete list</h2></header>

				{ this.props.loading ? <Loading /> : this.renderRecordTable() }

			</div>
  	);
  }

  renderAdminPanel() {
  	return(
  		<div className='admin-panel'>
  			<h4>Admin panel</h4>
	      	<Button bsStyle="link" onClick={this.goToAddRawFastqOne.bind(this)}>Add single</Button><br/>
	        <Button bsStyle="link" onClick={this.goToAddRawFastqBatch.bind(this)}>Add batch</Button>
	    </div>
    );
  }

	render() {
		return(
			<div id='page'>

				{ this.renderMainPanel() }

				{ this.props.currentUser ? this.renderAdminPanel() : '' }

				<div id="clearingdiv"></div>

			</div>
		);
	}

}

RawFastqTablePage.propTypes = {
	rawFastqAllCount: PropTypes.number,
	rawFastqPairedCount: PropTypes.number,
	rawFastqSingleCount: PropTypes.number,
	rawFastqSampleSingleRecord: PropTypes.object,
	rawFastqSamplePairedRecord: PropTypes.object,
	platformsDistinctNames: PropTypes.array,
};

RawFastqTablePage.defaultProps = {
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer(() => {
	const subscription1 = Meteor.subscribe('rawFastqRecords');
	const subscription2 = Meteor.subscribe('platforms');
	const loading = (!subscription1.ready() || !subscription2.ready());

	return {
		currentUser: Meteor.user(),
		loading: loading,
		rawFastqAllCount: RawFastqRecords.find().count(),
		rawFastqPairedCount: RawFastqRecords.find({paired : true}).count(),
		rawFastqSingleCount: RawFastqRecords.find({paired : false}).count(),
		rawFastqSampleSingleRecord: RawFastqRecords.findOne({paired : false}),
		rawFastqSamplePairedRecord: RawFastqRecords.findOne({paired : true}),
		rawFastqAll: RawFastqRecords.find({}).fetch(),
		platforms: Platforms.find().fetch(),
	};
}, RawFastqTablePage);
