import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';
import { ButtonToolbar, Button } from 'react-bootstrap';

import { ExperimentTypes } from '/imports/api/experiment-types/experiment-types.js';

import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';

import Loading from '/imports/ui/Loading.jsx';

class AddExperimentTypePage extends Component {

	constructor(props) {
		super(props);
    this.state = {
      selectedValue: '',
    }
	}

  goHome () {
    browserHistory.push('/');
  }

  handleChange(newChoice) {
    console.log(newChoice);
    this.setState({
      selectedValue: newChoice.value
    })
  }

	handleSubmit(event) {
    event.preventDefault();
 
    const newValue = this.state.selectedValue;
 
    Meteor.call('experimentTypes.insert', newValue, (err, res) => {
      if (err){
        alert(err);
      } else {
        alert('New experiment type added: ' + newValue)
      }
    });

  }

  renderForm () {
    return(
      <form onSubmit={this.handleSubmit.bind(this)}>
        <Creatable
          name="form-field-name"
          value={this.state.selectedValue}
          options={this.props.experimentTypes}
          onChange={this.handleChange.bind(this)}
          clearable={true}
          searchable={true}
          multi={false}
        />
        <Button type="submit" bsStyle='success' disabled={this.state.selectedValue === ''}>Submit</Button>
      </form>)
  }

  renderMainPanel () {
    return(
      <div className='main-panel'>
        <header><h1>Experiment types</h1></header>
        { this.renderForm() }

      </div>
    );
  }

  renderAdminPanel () {
    return(
      <div className='admin-panel'>
        <h4>Admin panel</h4>
          <ButtonToolbar>
            <Button bsStyle="link" onClick={this.goHome.bind(this)}>Home</Button>
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

AddExperimentTypePage.propTypes = {
};

AddExperimentTypePage.defaultProps = {
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer(() => {
  const user = Meteor.user();
  const subscription = Meteor.subscribe('experiment-types');
  const loading = (user === undefined || !subscription.ready());
  
  return {
    currentUser: user, // pass as props so that it is fixed for this page
    experimentTypes: ExperimentTypes.find({}).fetch(),
    loading: loading,
  };
}, AddExperimentTypePage);
