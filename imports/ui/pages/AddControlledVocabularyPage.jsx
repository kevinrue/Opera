import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';
import { ButtonToolbar, Button } from 'react-bootstrap';

import Loading from '/imports/ui/Loading.jsx';

class AddControlledVocabularyPage extends Component {

	constructor(props) {
		super(props);

	}

  goToAddExperimentType () {
    browserHistory.push('/controlled-vocabulary/experiment-type/add');
  }

  renderMainPanel () {
    return(
      <div className='main-panel'>
        <em>No content yet in main panel.</em>
      </div>
    );
  }
// <Button bsStyle="link" onClick={this.goToListExperiments.bind(this)}>Back to list</Button>
  renderAdminPanel () {
    return(
      <div className='admin-panel'>
        <h4>Admin panel</h4>
        <h5>Experiment</h5>
        <Button bsStyle="link" onClick={this.goToAddExperimentType.bind(this)}>Type</Button>
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

AddControlledVocabularyPage.propTypes = {
};

AddControlledVocabularyPage.defaultProps = {
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
}, AddControlledVocabularyPage);
