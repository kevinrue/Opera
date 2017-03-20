import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';
import { ButtonToolbar, Button } from 'react-bootstrap';

// import { Experiments } from '/imports/api/experiments/experiments.js';

import AddExperimentForm from '../forms/AddExperimentForm.jsx';

import Loading from '/imports/ui/Loading.jsx';

class AddExperimentPage extends Component {

	constructor(props) {
		super(props);
	}

  goToListExperiments () {
    browserHistory.push('/experiments');
  }

	handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const experimentName = ReactDOM.findDOMNode(this.refs.newExperimentName).value.trim();
 
    Meteor.call('experiments.insert', experimentName);
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.newExperimentName).value = '';
  }

  renderMainPanel () {
    return(
      <div className='main-panel'>
        <header><h1>Add an experiment</h1></header>
        { this.props.loading ? <Loading /> : <AddExperimentForm /> }
        
      </div>
    );
  }

  renderAdminPanel () {
    return(
      <div className='admin-panel'>
        <h4>Admin panel</h4>
          <ButtonToolbar>
            <Button bsStyle="link" onClick={this.goToListExperiments.bind(this)}>Back to list</Button>
          </ButtonToolbar>
      </div>
    );
  }

	render() {
    return (
      <div id='page'>
        { this.renderMainPanel() }

        { this.renderAdminPanel() }

        <div id="clearingdiv"></div>
      </div>
    );
  }

}

AddExperimentPage.propTypes = {
};

AddExperimentPage.defaultProps = {
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer(() => {
  const user = Meteor.user();
  const loading = (user === undefined);
  
  return {
    currentUser: user, // pass as props so that it is fixed for this page
    loading: loading,
  };
}, AddExperimentPage);
