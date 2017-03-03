import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import '../imports/startup/client/accounts-config.js';
import { renderRoutes } from '../imports/startup/client/routes.js';

import 'react-select/dist/react-select.css';
 
Meteor.startup(() => {
	// console.log('Client started up')
	render(renderRoutes(), document.getElementById('render-target'));
});
