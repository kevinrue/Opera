import React, { Component } from 'react';
 
let DataGrid = require('react-datagrid')

// App component - represents the whole app
export default class App extends Component {
  getExperiments() {
    return [
      { _id: 1, name: 'This is experiment 1', Nsamples: 0 },
      { _id: 2, name: 'This is experiment 2', Nsamples: 0 },
      { _id: 3, name: 'This is experiment 3', Nsamples: 0 },
    ];
  }

  getDataGridColumns() {
    return [
      { name: '_id', width: '5%' },
      { name: 'name', width: '85%' }, // the first letter of the 'name' field is automatically capitalised
      { name: 'Nsamples', title: 'Samples', width: '10%' }
    ]
  }
 
  renderExperiments() {
    return (
      <DataGrid
        idProperty='id'
        dataSource={this.getExperiments()}
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
      </div>
    );
  }
}