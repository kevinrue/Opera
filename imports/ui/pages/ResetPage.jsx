import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';
import { Button } from 'react-bootstrap';

import { Experiments } from '/imports/api/experiments/experiments.js';

import Loading from '/imports/ui/Loading.jsx';

// Welcome component - represents the whole app
class ResetPage extends Component {

  constructor (props) {
    super(props);
    this.state = {
    };

    this.clearExperiments.bind(this);
  }

  clearExperiments () {
    Meteor.call(
      'experiments.clear',
      (err, res) => {
        if (!err){
          console.log('Experimetns collection cleared');
        }
      })
  }

  goToAddPlatform () {
    browserHistory.push('/platforms');
  }

  renderExperimentRow () {
    return(
      <Button
        bsStyle="danger"
        onClick={this.clearExperiments}>Experiments ({this.props.countExperiments})
      </Button>
    );
  }

  renderMainPanel () {
    let username = (this.props.currentUser ? this.props.currentUser.username : "stranger");

    return(
      <div className='main-panel'>
        <h1>Collections</h1>
        <p>The buttons below will clear the corresponding collections in the database:</p>
        {this.props.loadingExperiments ? <Loading /> : this.renderExperimentRow()}
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
};
 
export default createContainer(() => {
  const currentUser = Meteor.user();
  const sExperiment = Meteor.subscribe('experiments');
  const loading = (currentUser === undefined || !sExperiment.ready());

  return {
    currentUser: currentUser,
    countExperiments: Experiments.find({}).count(),
    loadingExperiments: loading,
  };
}, ResetPage);
