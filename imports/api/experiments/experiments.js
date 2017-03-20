import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Experiments = new Mongo.Collection('experiments');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish experiments to users that are logged in
  Meteor.publish('experiments', function experimentsPublication() {
  	return (this.userId ? Experiments.find() : []);
  })
}

Meteor.methods({
  'experiments.insert'(experimentName) {
    check(experimentName, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Experiments.insert({
      title: experimentName,
      Nsamples: 0,
    });
  },

  'experiments.countRecordsWithTitle'(title) {
    check(title, String);
    // TODO: check that filePath exists on the system
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    return (
      Experiments.find(
        {
          title: title,
        }
      ).count()
    );
  },

  // 'experiments.remove'(experimentId) {
  //   check(experimentId, String);
 
  //   Experiments.remove(experimentId);
  // },

});