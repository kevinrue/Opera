import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Platforms = new Mongo.Collection('platforms');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish experiments to users that are logged in
  Meteor.publish('platforms', function platformsPublication() {
  	return (Platforms.find());
  })
}

Meteor.methods({
  'platforms.insert'(name) {
    check(name, String);
    // TODO: check that user is an admin
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Platforms.insert({
      name: name,
    });
  },

  'platforms.remove'(sequencerId) {
    check(sequencerId, String);
 
    Platforms.remove(sequencerId);
  },
});
