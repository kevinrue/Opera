import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';

import Loading from '/imports/ui/Loading.jsx';

class AuthenticatedApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidUpdate (prevProps, prevState) {
    // Navigate to a sign in page if the user isn't authenticated when data changes
    if (!this.props.isAuthenticated) {
      browserHistory.push('/experiments/403');
    }
  }

  componentWillMount () {
    // Check that the user is logged in before the component mounts
    if (!this.props.isAuthenticated) {
      browserHistory.push('/experiments/403');
    }
  }
 
  render() {
    console.log(this.props.currentUser);
    return (
      <div className='container'>
        {this.props.loading ? <Loading /> : <Nav />}
        {this.props.loading ? <Loading /> : this.props.children}
      </div>
    );
  }
}

AuthenticatedApp.propTypes = {
  isAuthenticated: PropTypes.bool,
};
 
export default createContainer(() => {
  const isAuthenticated = Meteor.userId() !== null;
  const loading = isAuthenticated === undefined;

  return {
    isAuthenticated: isAuthenticated,
    loading: loading,
  };
}, AuthenticatedApp);
