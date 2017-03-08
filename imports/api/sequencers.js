import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Sequencers = new Mongo.Collection('sequencers');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish experiments to users that are logged in
  Meteor.publish('sequencers', function sequencersPublication() {
  	return (Sequencers.find());
  })
}

Meteor.methods({
  'sequencers.insert'(name) {
    check(name, String);
    // TODO: check that user is an admin
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Sequencers.insert({
      name: name,
    });
  },

  'sequencers.remove'(sequencerId) {
    check(sequencerId, String);
 
    Sequencers.remove(sequencerId);
  },
});
