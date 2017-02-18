import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import '../imports/startup/accounts-config.js';
import App from '../imports/ui/App.jsx';

import 'react-datagrid/index.css';
import 'react-select/dist/react-select.css';
 
Meteor.startup(() => {
	// console.log('Client started up')
	render(<App />, document.getElementById('render-target'));
});
