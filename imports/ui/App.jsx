import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

import ExperimentsTable from './ExperimentsTable.jsx';

import AddExperimentForm from './AddExperimentForm.jsx';
import RemoveExperimentForm from './RemoveExperimentForm.jsx';

import { RawFastqRecords } from '../api/raw-fastq-records.js';

import RawFastqRecordList from './RawFastqRecords.jsx';

// App component - represents the whole app
class App extends Component {
 
  render() {
    return (
      <div className="container">
        <AccountsUIWrapper />

        <p style={{textAlign:'center'}}>Hello {
          this.props.currentUser ? this.props.currentUser.username : "stranger"
        }!</p>

        <ExperimentsTable />

        { this.props.currentUser ?
          <div>
            <header>
              <h1>Admin panel</h1>
            </header>
            <AddExperimentForm />
            <RemoveExperimentForm label="Delete an experiment" searchable />
          </div> : ''
        }

        <RawFastqRecordList />

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
