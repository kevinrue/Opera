import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import App from '../imports/ui/App.jsx';

import 'react-datagrid/index.css';
 
Meteor.startup(() => {
	// console.log('Client started up')
	render(<App />, document.getElementById('render-target'));
});
