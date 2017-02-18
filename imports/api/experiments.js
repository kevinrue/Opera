import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Experiments = new Mongo.Collection('experiments');

Meteor.methods({
  'experiments.insert'(experimentName) {
    check(experimentName, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Experiments.insert({
      name: experimentName,
      Nsamples: 0,
    });
  },
  'experiments.remove'(experimentId) {
    check(experimentId, String);
 
    Experiments.remove(experimentId);
  },
});