import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

import ExperimentsTable from './ExperimentsTable.jsx';

import { Experiments } from '../api/experiments.js';
import ExperimentsDropdown from './ExperimentsDropdown.jsx';

import { RawFastqRecords } from '../api/raw-fastq-records.js';

import RawFastqRecordList from './RawFastqRecords.jsx';

// App component - represents the whole app
class App extends Component {
 
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const experimentName = ReactDOM.findDOMNode(this.refs.newExperimentName).value.trim();
 
    Meteor.call('experiments.insert', experimentName);
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.newExperimentName).value = '';
  }
 
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
            <header>
              <h2 className="section-heading">Add an experiment</h2>
            </header>
            <form className="new-experiment" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="newExperimentName"
                placeholder="Type to add new experiments"
              />
            </form>
            <ExperimentsDropdown label="Delete an experiment" searchable />
          </div> : ''
        }

        <RawFastqRecordList />

      </div>
    );
  }
}

App.propTypes = {
  experiments: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};
 
export default createContainer(() => {
  Meteor.subscribe('experiments');
  Meteor.subscribe('rawFastqRecords');

  return {
    experiments: Experiments.find({}).fetch(),
    currentUser: Meteor.user(),
  };
}, App);
