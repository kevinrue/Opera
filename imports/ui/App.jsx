import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
 
import { Experiments } from '../api/experiments.js';
 
let DataGrid = require('react-datagrid')

// App component - represents the whole app
class App extends Component {

  getDataGridColumns() {
    return [
      { name: 'name', width: '85%' }, // the first letter of the 'name' field is automatically capitalised
      { name: 'Nsamples', title: 'Samples', width: '15%' }
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

          <form className="new-experiment" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="newExperimentName"
              placeholder="Type to add new experiments"
            />
          </form>
      </div>
    );
  }
}

App.propTypes = {
  experiments: PropTypes.array.isRequired,
};
 
export default createContainer(() => {
  return {
    experiments: Experiments.find({}).fetch(),
  };
}, App);
