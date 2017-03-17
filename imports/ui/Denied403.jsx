import React, { Component} from  'react';

export default class Denied extends Component {
  render() {
  	return(
  		<div id='page'>
				<h1>Access denied</h1>
				<p>
					You do not have access to this section of the application.
				</p>
			</div>
  	);
  }
}
