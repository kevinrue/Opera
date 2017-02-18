import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
 
import { Experiments } from '../api/experiments.js';
import ExperimentsDropdown from './ExperimentsDropdown.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
 
let DataGrid = require('react-datagrid')

// App component - represents the whole app
class App extends Component {

  getDataGridColumns() {
    return [
      { name: '_id', width: '5%' },
      { name: 'name', width: '85%' }, // the first letter of the 'name' field is automatically capitalised
      { name: 'Nsamples', title: 'Samples', width: '10%' }
    ]
  }
 
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const experimentName = ReactDOM.findDOMNode(this.refs.newExperimentName).value.trim();
 
    Experiments.insert({
      name: experimentName,
      Nsamples: 0
    });
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.newExperimentName).value = '';
  }

  renderExperiments() {
    return (
      <DataGrid
        idProperty='id'
        dataSource={this.props.experiments}
        columns={this.getDataGridColumns()}
        style={{
          height: 200,
           width:'90%',
           marginLeft:'5%',
           marginRight:'5%'
         }}
         withColumnMenu={false}

      />
    )
  }
 
  render() {
    return (
      <div className="container">
        <AccountsUIWrapper />

        <p style={{textAlign:'center'}}>Hello {
          this.props.currentUser ? this.props.currentUser.username : "stranger"
        }!</p>

        <header>
          <h1>Experiment List</h1>
        </header>

        <p>
          This component renders a <code>DataGrid</code> defined in
            the <a href="https://www.npmjs.com/package/react-datagrid">
            <code>react-datagrid</code>
          </a> module.
        </p>
        <p>
          The grid is set to occupy 200 pixels in height, and
          the central 90% of the browser window's width with
          5% margin of either side.
        </p>
        {this.renderExperiments()}

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

      </div>
    );
  }
}

App.propTypes = {
  experiments: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};
 
export default createContainer(() => {
  return {
    experiments: Experiments.find({}).fetch(),
    currentUser: Meteor.user(),
  };
}, App);
