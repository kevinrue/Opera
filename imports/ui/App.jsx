import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// App component - represents the whole app
class App extends Component {
 
  render() {
    return (
      <div className="container">

        <p style={{textAlign:'center'}}>Hello {
          this.props.currentUser ? this.props.currentUser.username : "stranger"
        }!</p>

      </div>
    );
  }
}

App.propTypes = {
  currentUser: PropTypes.object,
};
 
export default createContainer(() => {

  return {
    currentUser: Meteor.user(),
  };
}, App);
