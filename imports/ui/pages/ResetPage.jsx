import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';
import { Button } from 'react-bootstrap';

import { Experiments } from '/imports/api/experiments/experiments.js';
import { Samples } from '/imports/api/samples/samples.js';
import { RawFastqUnits } from '/imports/api/raw-fastq-units/raw-fastq-units.js';

import Loading from '/imports/ui/Loading.jsx';

// Welcome component - represents the whole app
class ResetPage extends Component {

  constructor (props) {
    super(props);
    this.state = {
    };

    this.clearExperiments.bind(this);
  }

  // Clear methods

  clearExperiments () {
    Meteor.call(
      'experiments.clear',
      (err, res) => {
        if (!err){
          console.log('Experiments collection cleared');
        }
      })
  }

  clearSamples () {
    Meteor.call(
      'samples.clear',
      (err, res) => {
        if (!err){
          console.log('Samples collection cleared');
        }
      })
  }

  clearRawFastqUnits () {
    Meteor.call(
      'rawFastqUnits.clear',
      (err, res) => {
        if (!err){
          console.log('RawFastqUnits collection cleared');
        }
      })
  }

  // Render action buttons

  renderExperimentRow () {
    return(
      <p><Button
        bsStyle="danger"
        onClick={this.clearExperiments}>Experiments ({this.props.countExperiments})
      </Button></p>
    );
  }

  renderSampleRow () {
    return(
      <p><Button
        bsStyle="danger"
        onClick={this.clearSamples}>Samples ({this.props.countSamples})
      </Button></p> 
    );
  }

  renderRawFastqUnitsRow () {
    return(
      <p><Button
        bsStyle="danger"
        onClick={this.clearRawFastqUnits}>Raw FASTQ units ({this.props.countRawFastqUnits})
      </Button></p> 
    );
  }

  // Render panels

  renderMainPanel () {
    let username = (this.props.currentUser ? this.props.currentUser.username : "stranger");

    return(
      <div className='main-panel'>
        <h1>Collections</h1>
        <p>The buttons below will clear the corresponding collections in the database:</p>
        {this.props.loadingExperiments ? <Loading /> : this.renderExperimentRow()}
        {this.props.loadingSamples ? <Loading /> : this.renderSampleRow()}
        {this.props.loadingRawFastqUnits ? <Loading /> : this.renderRawFastqUnitsRow()}
      </div>
    );
  }

  renderAdminPanel () {
    return(
      <div className='admin-panel'>

      </div>
    );
  }
 
  render() {
    // console.log(this.props.currentUser);
    return (
      <div id='page'>

          { this.props.currentUser !== null ? this.renderMainPanel() : <p style={{color:'red'}}>Access denied</p> }

          { this.renderAdminPanel() }

          <div id="clearingdiv"></div>

      </div>
    );
  }
}

ResetPage.propTypes = {
  currentUser: PropTypes.object,

  loadingExperiments: PropTypes.bool,
  loadingSamples: PropTypes.bool,
  loadingRawFastqUnits: PropTypes.bool,

  countExperiments: PropTypes.number,
  countSamplescount: PropTypes.number,
  countRawFastqUnits: PropTypes.number,
};
 
export default createContainer(() => {
  const currentUser = Meteor.user();

  const sExperiment = Meteor.subscribe('experiments');
  const sSamples = Meteor.subscribe('samples');
  const sRawFastqUnits = Meteor.subscribe('rawFastqUnits');
  const loading = (currentUser === undefined);

  return {
    currentUser: currentUser,
    loading: loading,

    loadingExperiments: !sExperiment.ready(),
    loadingSamples: !sSamples.ready(),
    loadingRawFastqUnits: !sRawFastqUnits.ready(),

    countExperiments: Experiments.find({}).count(),
    countSamples: Samples.find({}).count(),
    countRawFastqUnits: RawFastqUnits.find({}).count(),
  };
}, ResetPage);
