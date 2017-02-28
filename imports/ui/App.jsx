import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import ExperimentsTable from './ExperimentsTable.jsx';
import AddExperimentForm from './AddExperimentForm.jsx';
import RemoveExperimentForm from './RemoveExperimentForm.jsx';

import RawFastqRecordsInfo from './RawFastqRecordsInfo.jsx';
import AddRawFastqRecords from './AddRawFastqRecords.jsx';

// App component - represents the whole app
class App extends Component {
 
  render() {
    return (
      <div className="container">

        <p style={{textAlign:'center'}}>Hello {
          this.props.currentUser ? this.props.currentUser.username : "stranger"
        }!</p>

        <ExperimentsTable />

        { this.props.currentUser ?
          <div>
            <header><h1>Admin panel</h1></header>
            <AddExperimentForm />
            <RemoveExperimentForm label="Delete an experiment" searchable />
          </div> : ''
        }

        <header><h1>Raw fastq records</h1></header>
        <RawFastqRecordsInfo />
        <AddRawFastqRecords />

      </div>
    );
  }
}

App.propTypes = {
  currentUser: PropTypes.object,
};
 
export default createContainer(() => {

  return {
    currentUser: Meteor.user(),
  };
}, App);
