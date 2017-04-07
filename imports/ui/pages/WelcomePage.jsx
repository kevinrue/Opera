import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import Loading from '/imports/ui/Loading.jsx';

// Welcome component - represents the whole app
class WelcomePage extends Component {

  goToListExperiments () {
    browserHistory.push('/experiments');
  }

  goToAddPlatform () {
    browserHistory.push('/platforms');
  }

  renderMainPanel () {
    let username = (this.props.currentUser ? this.props.currentUser.username : "stranger");

    return(
      <div className='main-panel'>
        {
          this.props.loading ? <Loading /> : <header><h1>Welcome { username }!</h1></header>
        }
      </div>
    );
  }

  renderAdminPanel () {
    return(
      <div className='admin-panel'>
        { this.props.currentUser ? 
          <ButtonToolbar>
            <h4>Menu</h4>
            <h5>Experiments</h5>
            <ButtonGroup vertical>
            <Button bsStyle="link" onClick={this.goToListExperiments.bind(this)}>List</Button>
            </ButtonGroup>
            
            <h5>Platforms</h5>
              <Button bsStyle="link" onClick={this.goToAddPlatform.bind(this)}>Add</Button>
          </ButtonToolbar>  : ''
        }
      </div>
    );
  }
 
  render() {
    // console.log(this.props.currentUser);
    return (
      <div id='page'>
        { this.renderMainPanel() }

        { this.renderAdminPanel() }

        <div id="clearingdiv"></div>
      </div>
    );
  }
}

WelcomePage.propTypes = {
  currentUser: PropTypes.object,
};
 
export default createContainer(() => {
  const currentUser = Meteor.user();
  const loading = (currentUser === undefined);

  return {
    currentUser: Meteor.user(),
    loading: loading,
  };
}, WelcomePage);
